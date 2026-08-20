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
 * @property string $email
 * @property string|null $designation
 * @property string|null $department
 * @property Carbon|null $joining_date
 * @property float|null $salary
 * @property string|null $phone
 * @property string|null $avatar
 * @property array<string, mixed>|null $raw_data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'external_id',
    'name',
    'email',
    'designation',
    'department',
    'joining_date',
    'salary',
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
            'salary' => 'decimal:2',
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
