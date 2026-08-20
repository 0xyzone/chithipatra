<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\LetterTemplate;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPDFInstance;
use Carbon\Carbon;

class LetterCompilerService
{
    /**
     * Compile template HTML content by replacing tags with employee, system, and custom variables.
     *
     * @param  array<string, mixed>  $customValues
     */
    public function compile(LetterTemplate|string $template, ?Employee $employee = null, array $customValues = []): string
    {
        $html = is_string($template) ? $template : $template->content_html;

        // 1. Prepare system tags
        $systemTags = [
            '{{system.current_date}}' => Carbon::now()->format('F j, Y'),
            '{{system.current_date_formatted}}' => Carbon::now()->format('d M, Y'),
            '{{system.current_year}}' => Carbon::now()->format('Y'),
            '{{system.current_time}}' => Carbon::now()->format('h:i A'),
            '{{system.company_name}}' => config('app.name', 'Acme Corporation'),
        ];

        // 2. Prepare employee tags
        $employeeTags = [];
        if ($employee) {
            $employeeTags = [
                '{{employee.id}}' => (string) $employee->id,
                '{{employee.code}}' => $employee->external_id ?? 'N/A',
                '{{employee.external_id}}' => $employee->external_id ?? 'N/A',
                '{{employee.name}}' => $employee->name,
                '{{employee.email}}' => $employee->email,
                '{{employee.designation}}' => $employee->designation ?? 'N/A',
                '{{employee.department}}' => $employee->department ?? 'N/A',
                '{{employee.phone}}' => $employee->phone ?? 'N/A',
                '{{employee.salary}}' => $employee->salary !== null ? '$'.number_format((float) $employee->salary, 2) : 'N/A',
                '{{employee.joining_date}}' => $employee->joining_date ? $employee->joining_date->format('F j, Y') : 'N/A',
            ];
        }

        // 3. Prepare custom variables tags
        $customTags = [];
        foreach ($customValues as $key => $value) {
            // Support both {{custom.key}} and {{key}}
            $formattedValue = is_array($value) ? implode(', ', $value) : (string) $value;
            $customTags["{{custom.{$key}}}"] = $formattedValue;
            $customTags["{{{$key}}}"] = $formattedValue;
        }

        // Merge all replacements
        $replacements = array_merge($systemTags, $employeeTags, $customTags);

        // Perform tag substitution
        return strtr($html, $replacements);
    }

    /**
     * Wrap compiled HTML in a clean, print-ready A4 layout for DomPDF rendering.
     */
    public function wrapInPrintLayout(string $compiledHtml, string $title = 'Letter'): string
    {
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>{$title}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 20mm 20mm 20mm 20mm;
        }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            background: #ffffff;
        }
        p {
            margin: 0 0 12pt 0;
        }
        h1 { font-size: 20pt; font-weight: bold; margin: 0 0 14pt 0; color: #111827; }
        h2 { font-size: 16pt; font-weight: bold; margin: 0 0 12pt 0; color: #1f2937; }
        h3 { font-size: 13pt; font-weight: bold; margin: 0 0 10pt 0; color: #374151; }
        ul, ol {
            margin: 0 0 12pt 20pt;
            padding: 0;
        }
        li {
            margin-bottom: 4pt;
        }
        blockquote {
            margin: 12pt 0;
            padding-left: 14pt;
            border-left: 3pt solid #3b82f6;
            color: #4b5563;
            font-style: italic;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 14pt 0;
        }
        th, td {
            border: 1px solid #d1d5db;
            padding: 6pt 10pt;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: bold;
        }
        hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 16pt 0;
        }
        .header-bar {
            border-bottom: 2px solid #2563eb;
            padding-bottom: 12pt;
            margin-bottom: 20pt;
        }
        .footer-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 9pt;
            color: #9ca3af;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 6pt;
        }
    </style>
</head>
<body>
    {$compiledHtml}
</body>
</html>
HTML;
    }

    /**
     * Generate DomPDF instance for downloading or streaming.
     */
    public function generatePdf(string $compiledHtml, string $title = 'Letter'): DomPDFInstance
    {
        $fullHtml = $this->wrapInPrintLayout($compiledHtml, $title);

        /** @var DomPDFInstance $pdf */
        $pdf = Pdf::loadHTML($fullHtml)
            ->setPaper('a4', 'portrait')
            ->setWarnings(false);

        return $pdf;
    }
}
