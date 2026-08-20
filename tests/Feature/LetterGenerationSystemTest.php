<?php

use App\Models\Employee;
use App\Models\LetterTemplate;
use App\Services\LetterCompilerService;

test('letter compiler replaces system, employee, and custom tags correctly', function () {
    $compiler = new LetterCompilerService;

    $employee = Employee::create([
        'name' => 'John Doe',
        'email' => 'john.doe@example.com',
        'designation' => 'Staff Software Engineer',
        'department' => 'Engineering',
        'salary' => 125000.00,
        'joining_date' => '2025-01-15',
    ]);

    $template = '
        <p>Dear {{employee.name}},</p>
        <p>Your designation is {{employee.designation}} in the {{employee.department}} Department.</p>
        <p>Your annual salary is {{employee.salary}}.</p>
        <p>Reporting to {{custom.manager}} with a probation of {{custom.probation}}.</p>
    ';

    $compiled = $compiler->compile($template, $employee, [
        'manager' => 'Sarah Connor',
        'probation' => '3 Months',
    ]);

    expect($compiled)->toContain('Dear John Doe,')
        ->toContain('Staff Software Engineer')
        ->toContain('Engineering Department')
        ->toContain('$125,000.00')
        ->toContain('Reporting to Sarah Connor')
        ->toContain('probation of 3 Months');
});

test('letter compiler generates valid PDF binary', function () {
    $compiler = new LetterCompilerService;
    $pdf = $compiler->generatePdf('<h1>Test Letter</h1><p>Hello World</p>', 'Test');
    $output = $pdf->output();

    expect($output)->not->toBeEmpty()
        ->and(str_starts_with($output, '%PDF'))->toBeTrue();
});

test('dashboard page is accessible and returns letter templates and statistics', function () {
    $response = $this->get(route('dashboard'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page->component('dashboard')
            ->has('templates')
            ->has('stats')
            ->has('recentLetters')
        );
});

test('letter generation preview endpoint works', function () {
    $template = LetterTemplate::create([
        'title' => 'Sample Test Letter',
        'category' => 'General',
        'content_html' => '<p>Hello {{employee.name}} with probation {{custom.probation_period}}.</p>',
    ]);

    $employee = Employee::create([
        'name' => 'Jane Smith',
        'email' => 'jane.smith@example.com',
        'designation' => 'Lead Engineer',
    ]);

    $response = $this->postJson(route('letters.preview'), [
        'template_id' => $template->id,
        'employee_id' => $employee->id,
        'custom_values' => ['probation_period' => '6 Months'],
    ]);

    $response->assertOk()
        ->assertJsonStructure(['compiled_html']);
});

test('letter generation store endpoint saves record and produces reference number', function () {
    $template = LetterTemplate::create([
        'title' => 'Offer Letter Confirmation',
        'category' => 'Appointment',
        'content_html' => '<p>Offer for {{employee.name}} with probation {{custom.probation_period}}.</p>',
    ]);

    $employee = Employee::create([
        'name' => 'Alice Walker',
        'email' => 'alice.walker@example.com',
        'designation' => 'Marketing Manager',
    ]);

    $response = $this->postJson(route('letters.store'), [
        'letter_template_id' => $template->id,
        'employee_id' => $employee->id,
        'custom_values' => ['probation_period' => '3 Months'],
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'success',
            'letter' => ['id', 'reference_number', 'recipient_name'],
            'download_url',
        ]);

    $this->assertDatabaseHas('generated_letters', [
        'letter_template_id' => $template->id,
    ]);
});
