<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\GeneratedLetter;
use App\Models\LetterTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LetterTemplateController extends Controller
{
    /**
     * Display a listing of the resource on the Dashboard.
     */
    public function index(Request $request): Response
    {
        $templates = LetterTemplate::query()
            ->withCount('generatedLetters')
            ->orderBy('created_at', 'desc')
            ->get();

        $recentLetters = GeneratedLetter::query()
            ->with(['template', 'employee'])
            ->latest()
            ->limit(10)
            ->get();

        $stats = [
            'total_templates' => LetterTemplate::count(),
            'total_employees' => Employee::count(),
            'total_letters' => GeneratedLetter::count(),
            'last_sync' => Employee::max('updated_at'),
        ];

        return Inertia::render('dashboard', [
            'templates' => $templates,
            'recentLetters' => $recentLetters,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new template.
     */
    public function create(): Response
    {
        return Inertia::render('templates/editor', [
            'template' => null,
            'isEditing' => false,
        ]);
    }

    /**
     * Store a newly created template in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'content_html' => 'required|string',
            'custom_variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']).'-'.Str::random(5);

        $template = LetterTemplate::create($validated);

        return redirect()->route('dashboard')->with('success', 'Letter template created successfully.');
    }

    /**
     * Show the form for editing the specified template.
     */
    public function edit(LetterTemplate $template): Response
    {
        return Inertia::render('templates/editor', [
            'template' => $template,
            'isEditing' => true,
        ]);
    }

    /**
     * Update the specified template in storage.
     */
    public function update(Request $request, LetterTemplate $template): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'nullable|string',
            'content_html' => 'required|string',
            'custom_variables' => 'nullable|array',
            'is_active' => 'boolean',
        ]);

        $template->update($validated);

        return redirect()->route('dashboard')->with('success', 'Letter template updated successfully.');
    }

    /**
     * Remove the specified template from storage.
     */
    public function destroy(LetterTemplate $template): RedirectResponse
    {
        $template->delete();

        return redirect()->route('dashboard')->with('success', 'Letter template deleted successfully.');
    }
}
