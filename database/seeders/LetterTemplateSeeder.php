<?php

namespace Database\Seeders;

use App\Models\LetterTemplate;
use Illuminate\Database\Seeder;

class LetterTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Appointment / Offer Letter
        LetterTemplate::updateOrCreate(
            ['slug' => 'appointment-offer-letter'],
            [
                'title' => 'Official Appointment & Offer Letter',
                'category' => 'Appointment',
                'description' => 'Standard official employment offer letter with probation terms and salary breakdown.',
                'custom_variables' => [
                    [
                        'key' => 'reporting_manager',
                        'label' => 'Reporting Manager',
                        'type' => 'text',
                        'default_value' => 'Jane Smith (VP of Engineering)',
                        'required' => true,
                    ],
                    [
                        'key' => 'probation_period',
                        'label' => 'Probation Period',
                        'type' => 'select',
                        'default_value' => '3 Months',
                        'options' => ['1 Month', '3 Months', '6 Months', 'No Probation'],
                        'required' => true,
                    ],
                    [
                        'key' => 'working_hours',
                        'label' => 'Working Hours',
                        'type' => 'text',
                        'default_value' => '9:00 AM - 5:00 PM (Monday to Friday)',
                        'required' => false,
                    ],
                    [
                        'key' => 'additional_perks',
                        'label' => 'Additional Perks & Benefits',
                        'type' => 'textarea',
                        'default_value' => 'Comprehensive Health Insurance, Annual Performance Bonus, and $1,000 Annual Learning Stipend.',
                        'required' => false,
                    ],
                ],
                'content_html' => '
<div style="text-align: right; margin-bottom: 20px;">
    <strong>Date:</strong> {{system.current_date}}<br>
    <strong>Ref:</strong> APPT/{{employee.code}}/{{system.current_year}}
</div>

<p>
    <strong>To:</strong><br>
    <strong>{{employee.name}}</strong><br>
    Email: {{employee.email}}<br>
    Phone: {{employee.phone}}
</p>

<h2 style="text-align: center; color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">APPOINTMENT LETTER</h2>

<p>Dear <strong>{{employee.name}}</strong>,</p>

<p>We are pleased to offer you the position of <strong>{{employee.designation}}</strong> in the <strong>{{employee.department}}</strong> Department at <strong>{{system.company_name}}</strong>. We were very impressed with your background, experience, and energy during our selection process.</p>

<p>Your employment will formally commence on <strong>{{employee.joining_date}}</strong> under the following agreed terms and conditions:</p>

<ul>
    <li><strong>Designation:</strong> {{employee.designation}}</li>
    <li><strong>Department:</strong> {{employee.department}}</li>
    <li><strong>Annual Gross Remuneration:</strong> {{employee.salary}}</li>
    <li><strong>Probation Period:</strong> {{custom.probation_period}}</li>
    <li><strong>Reporting To:</strong> {{custom.reporting_manager}}</li>
    <li><strong>Working Hours:</strong> {{custom.working_hours}}</li>
</ul>

<p><strong>Benefits & Allowances:</strong><br>{{custom.additional_perks}}</p>

<p>During the probation period, either party may terminate this employment contract by providing two weeks written notice. Upon successful completion of probation, employment confirmation will be formally issued.</p>

<p>Please sign and return the duplicate copy of this letter as a token of your acceptance of this offer.</p>

<br><br>
<table style="width: 100%; border: none;">
    <tr style="border: none;">
        <td style="width: 50%; border: none;">
            ___________________________<br>
            <strong>Authorized Signatory</strong><br>
            {{system.company_name}}
        </td>
        <td style="width: 50%; border: none; text-align: right;">
            ___________________________<br>
            <strong>{{employee.name}}</strong><br>
            Candidate Signature
        </td>
    </tr>
</table>
                ',
                'is_active' => true,
            ]
        );

        // 2. Experience & Relieving Certificate
        LetterTemplate::updateOrCreate(
            ['slug' => 'experience-relieving-certificate'],
            [
                'title' => 'Experience & Relieving Certificate',
                'category' => 'Certificate',
                'description' => 'Formal relieving and service experience certificate given upon employee exit.',
                'custom_variables' => [
                    [
                        'key' => 'last_working_day',
                        'label' => 'Last Working Day',
                        'type' => 'date',
                        'default_value' => date('Y-m-d'),
                        'required' => true,
                    ],
                    [
                        'key' => 'conduct_rating',
                        'label' => 'Character & Conduct Assessment',
                        'type' => 'select',
                        'default_value' => 'Exemplary',
                        'options' => ['Exemplary', 'Good and Professional', 'Satisfactory'],
                        'required' => true,
                    ],
                    [
                        'key' => 'special_contributions',
                        'label' => 'Key Contributions / Summary',
                        'type' => 'textarea',
                        'default_value' => 'demonstrated exceptional leadership and technical competence across all project milestones.',
                        'required' => false,
                    ],
                ],
                'content_html' => '
<div style="text-align: right; margin-bottom: 24px;">
    <strong>Date of Issue:</strong> {{system.current_date}}
</div>

<h2 style="text-align: center; color: #111827; letter-spacing: 1px; margin-bottom: 24px;">TO WHOM IT MAY CONCERN</h2>

<p>This is to certify that <strong>{{employee.name}}</strong> (Employee ID: <strong>{{employee.code}}</strong>) was employed with <strong>{{system.company_name}}</strong> from <strong>{{employee.joining_date}}</strong> to <strong>{{custom.last_working_day}}</strong>.</p>

<p>During their tenure with us, they served in the role of <strong>{{employee.designation}}</strong> within the <strong>{{employee.department}}</strong> Department.</p>

<p>During their period of employment, {{employee.name}} {{custom.special_contributions}}. Their conduct and character were found to be <strong>{{custom.conduct_rating}}</strong> throughout their service.</p>

<p>They have been relieved from all company responsibilities and duties effective the close of business hours on <strong>{{custom.last_working_day}}</strong>. All company dues, equipment, and clearances have been satisfactorily resolved.</p>

<p>We take this opportunity to thank {{employee.name}} for their dedicated service and wish them every success in all future professional and personal endeavors.</p>

<br><br><br>
<div>
    <strong>Sincerely,</strong><br><br>
    ___________________________<br>
    <strong>Human Resources Department</strong><br>
    {{system.company_name}}
</div>
                ',
                'is_active' => true,
            ]
        );

        // 3. Salary Increment & Promotion Letter
        LetterTemplate::updateOrCreate(
            ['slug' => 'salary-increment-promotion'],
            [
                'title' => 'Annual Salary Increment & Promotion',
                'category' => 'Compensation',
                'description' => 'Official letter revising employee salary and announcing promotions/appraisals.',
                'custom_variables' => [
                    [
                        'key' => 'effective_date',
                        'label' => 'Effective Date',
                        'type' => 'date',
                        'default_value' => date('Y-m-01'),
                        'required' => true,
                    ],
                    [
                        'key' => 'new_designation',
                        'label' => 'New Designation (if promoted)',
                        'type' => 'text',
                        'default_value' => 'Senior Specialist',
                        'required' => false,
                    ],
                    [
                        'key' => 'increment_percentage',
                        'label' => 'Increment Percentage (%)',
                        'type' => 'number',
                        'default_value' => '15',
                        'required' => true,
                    ],
                    [
                        'key' => 'revised_salary',
                        'label' => 'Revised Monthly / Annual Salary',
                        'type' => 'text',
                        'default_value' => '$85,000.00 / year',
                        'required' => true,
                    ],
                ],
                'content_html' => '
<div style="text-align: right; margin-bottom: 20px;">
    <strong>Date:</strong> {{system.current_date}}<br>
    <strong>Confidential</strong>
</div>

<p>
    <strong>Dear {{employee.name}},</strong><br>
    {{employee.designation}} - {{employee.department}}<br>
    Employee Code: {{employee.code}}
</p>

<h2 style="color: #047857; text-align: center; margin: 20px 0;">ANNUAL PERFORMANCE APPRAISAL & SALARY REVISION</h2>

<p>On behalf of the leadership team at <strong>{{system.company_name}}</strong>, we would like to commend you on your high standard of performance and dedication over the past year.</p>

<p>In recognition of your valuable contributions, we are thrilled to revise your compensation package effective from <strong>{{custom.effective_date}}</strong>.</p>

<table style="width: 100%; border: 1px solid #d1d5db; margin: 16px 0;">
    <tr style="background-color: #f9fafb;">
        <th style="padding: 8px; border: 1px solid #d1d5db;">Particulars</th>
        <th style="padding: 8px; border: 1px solid #d1d5db;">Details</th>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #d1d5db;">Designation</td>
        <td style="padding: 8px; border: 1px solid #d1d5db;"><strong>{{custom.new_designation}}</strong></td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #d1d5db;">Appraisal Increment</td>
        <td style="padding: 8px; border: 1px solid #d1d5db;">{{custom.increment_percentage}}%</td>
    </tr>
    <tr>
        <td style="padding: 8px; border: 1px solid #d1d5db;">Revised Total Compensation</td>
        <td style="padding: 8px; border: 1px solid #d1d5db;"><strong>{{custom.revised_salary}}</strong></td>
    </tr>
</table>

<p>All other terms and conditions of your employment contract remain unchanged. We look forward to your continuous commitment and leadership as we scale new heights together.</p>

<br><br>
<p>
    Warm regards,<br><br>
    ___________________________<br>
    <strong>Head of People & Culture</strong><br>
    {{system.company_name}}
</p>
                ',
                'is_active' => true,
            ]
        );
    }
}
