<?php

namespace App\Models;

use Database\Factories\LetterTemplateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string|null $description
 * @property string $category
 * @property string $content_html
 * @property array<int, array{key: string, label: string, type: string, default_value?: string, options?: array<int, string>, required?: bool}>|null $custom_variables
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'title',
    'slug',
    'description',
    'category',
    'content_html',
    'custom_variables',
    'is_active',
])]
class LetterTemplate extends Model
{
    /** @use HasFactory<LetterTemplateFactory> */
    use HasFactory;

    /**
     * Boot the model to auto-generate slug if missing.
     */
    protected static function booted(): void
    {
        static::creating(function (LetterTemplate $template): void {
            if (empty($template->slug)) {
                $baseSlug = Str::slug($template->title);
                $slug = $baseSlug;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$count}";
                    $count++;
                }
                $template->slug = $slug;
            }
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'custom_variables' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the letters generated using this template.
     *
     * @return HasMany<GeneratedLetter, $this>
     */
    public function generatedLetters(): HasMany
    {
        return $this->hasMany(GeneratedLetter::class);
    }
}
