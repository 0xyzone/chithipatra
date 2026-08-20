<?php

namespace App\Models;

use Database\Factories\GeneratedLetterFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $letter_template_id
 * @property int|null $employee_id
 * @property string $reference_number
 * @property string $recipient_name
 * @property string|null $recipient_email
 * @property array<string, mixed>|null $custom_values
 * @property string $compiled_html
 * @property int|null $generated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'letter_template_id',
    'employee_id',
    'reference_number',
    'recipient_name',
    'recipient_email',
    'custom_values',
    'compiled_html',
    'generated_by',
])]
class GeneratedLetter extends Model
{
    /** @use HasFactory<GeneratedLetterFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'custom_values' => 'array',
        ];
    }

    /**
     * Get the template used to generate this letter.
     *
     * @return BelongsTo<LetterTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(LetterTemplate::class, 'letter_template_id');
    }

    /**
     * Get the employee recipient.
     *
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    /**
     * Get the user who generated this letter.
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
