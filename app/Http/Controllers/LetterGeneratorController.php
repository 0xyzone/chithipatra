<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\GeneratedLetter;
use App\Models\LetterTemplate;
use App\Services\LetterCompilerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LetterGeneratorController extends Controller
{
    /**
     * Show the Letter Generator wizard / studio.
     */
    public function index(Request $request): Response
    {
        $templates = LetterTemplate::where('is_active', true)->orderBy('title')->get();
        $employees = Employee::orderBy('name')->limit(100)->get();

        $selectedTemplateId = $request->input('template_id');
        $selectedEmployeeId = $request->input('employee_id');

        return Inertia::render('generate/index', [
            'templates' => $templates,
            'employees' => $employees,
            'initialTemplateId' => $selectedTemplateId ? (int) $selectedTemplateId : null,
            'initialEmployeeId' => $selectedEmployeeId ? (int) $selectedEmployeeId : null,
        ]);
    }

    /**
     * Live preview compiled HTML with given employee and dynamic values.
     */
    public function preview(Request $request, LetterCompilerService $compilerService): JsonResponse
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:letter_templates,id',
            'employee_id' => 'nullable|exists:employees,id',
            'custom_values' => 'nullable|array',
        ]);

        $template = LetterTemplate::findOrFail($validated['template_id']);
        $employee = ! empty($validated['employee_id']) ? Employee::find($validated['employee_id']) : null;
        $customValues = $validated['custom_values'] ?? [];

        $compiledHtml = $compilerService->compile($template, $employee, $customValues);

        return response()->json([
            'compiled_html' => $compiledHtml,
        ]);
    }

    /**
     * Save generated letter snapshot to database.
     */
    public function store(Request $request, LetterCompilerService $compilerService): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'letter_template_id' => 'required|exists:letter_templates,id',
            'employee_id' => 'nullable|exists:employees,id',
            'custom_values' => 'nullable|array',
        ]);

        $template = LetterTemplate::findOrFail($validated['letter_template_id']);
        $employee = ! empty($validated['employee_id']) ? Employee::find($validated['employee_id']) : null;
        $customValues = $validated['custom_values'] ?? [];

        $compiledHtml = $compilerService->compile($template, $employee, $customValues);

        $refNumber = 'LTR-'.date('Y').'-'.strtoupper(Str::random(6));

        $letter = GeneratedLetter::create([
            'letter_template_id' => $template->id,
            'employee_id' => $employee?->id,
            'reference_number' => $refNumber,
            'recipient_name' => $employee ? $employee->name : ($customValues['recipient_name'] ?? 'Recipient'),
            'recipient_email' => $employee?->email,
            'custom_values' => $customValues,
            'compiled_html' => $compiledHtml,
            'generated_by' => auth()->id(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'letter' => $letter,
                'download_url' => route('letters.download', $letter->id),
            ]);
        }

        return redirect()->route('letters.history')->with('success', "Letter generated with Ref #{$refNumber}.");
    }

    /**
     * Audit log of generated letters.
     */
    public function history(): Response
    {
        $letters = GeneratedLetter::with(['template', 'employee', 'author'])
            ->latest()
            ->paginate(20);

        return Inertia::render('generate/history', [
            'letters' => $letters,
        ]);
    }

    /**
     * Download or stream compiled PDF of a saved generated letter.
     */
    public function download(GeneratedLetter $letter, LetterCompilerService $compilerService): HttpResponse
    {
        $filename = Str::slug($letter->template->title ?? 'Letter').'-'.$letter->reference_number.'.pdf';

        $pdf = $compilerService->generatePdf($letter->compiled_html, $letter->template->title ?? 'Generated Letter');

        return $pdf->download($filename);
    }

    /**
     * Direct live PDF export from generator wizard without saving.
     */
    public function exportDirect(Request $request, LetterCompilerService $compilerService): HttpResponse
    {
        $validated = $request->validate([
            'template_id' => 'required|exists:letter_templates,id',
            'employee_id' => 'nullable|exists:employees,id',
            'custom_values' => 'nullable|array',
        ]);

        $template = LetterTemplate::findOrFail($validated['template_id']);
        $employee = ! empty($validated['employee_id']) ? Employee::find($validated['employee_id']) : null;
        $customValues = $validated['custom_values'] ?? [];

        $compiledHtml = $compilerService->compile($template, $employee, $customValues);
        $filename = Str::slug($template->title).'-'.date('YmdHis').'.pdf';

        $pdf = $compilerService->generatePdf($compiledHtml, $template->title);

        return $pdf->download($filename);
    }
}
