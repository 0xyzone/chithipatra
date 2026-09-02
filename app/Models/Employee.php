<?php

namespace App\Models;

use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $external_id
 * @property string $name
 * @property string|null $first_name
 * @property string|null $middle_name
 * @property string|null $last_name
 * @property string|null $email
 * @property string|null $gender
 * @property string|null $employee_status
 * @property string|null $designation
 * @property string|null $department
 * @property Carbon|null $joining_date
 * @property Carbon|null $date_of_birth
 * @property string|null $dob_bs
 * @property string|null $marital_status
 * @property string|null $citizenship_number
 * @property string|null $citizenship_issue_date
 * @property string|null $citizenship_issue_place
 * @property string|null $ssid
 * @property int|null $department_id
 * @property int|null $designation_id
 * @property int|null $designation_rank
 * @property int|null $dp_rank
 * @property int|null $rank
 * @property float|null $salary
 * @property string|null $tips_status
 * @property float|null $point_value
 * @property bool $tips_blank
 * @property bool $publish_tips
 * @property bool $tips_fixed
 * @property bool $is_incomplete
 * @property string|null $phone
 * @property string|null $avatar
 * @property array<string, mixed>|null $raw_data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'external_id',
    'name',
    'first_name',
    'middle_name',
    'last_name',
    'email',
    'gender',
    'employee_status',
    'designation',
    'designation_id',
    'designation_rank',
    'department',
    'department_id',
    'joining_date',
    'date_of_birth',
    'dob_bs',
    'marital_status',
    'citizenship_number',
    'citizenship_issue_date',
    'citizenship_issue_place',
    'ssid',
    'dp_rank',
    'rank',
    'salary',
    'tips_status',
    'point_value',
    'tips_blank',
    'publish_tips',
    'tips_fixed',
    'is_incomplete',
    'phone',
    'avatar',
    'raw_data',
])]
class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'joining_date' => 'date',
            'date_of_birth' => 'date',
            'salary' => 'decimal:2',
            'point_value' => 'decimal:4',
            'tips_blank' => 'boolean',
            'publish_tips' => 'boolean',
            'tips_fixed' => 'boolean',
            'is_incomplete' => 'boolean',
            'raw_data' => 'array',
        ];
    }

    /**
     * Get the letters generated for this employee.
     *
     * @return HasMany<GeneratedLetter, $this>
     */
    public function generatedLetters(): HasMany
    {
        return $this->hasMany(GeneratedLetter::class);
    }
}
