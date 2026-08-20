<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('generated_letters', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('letter_template_id')->constrained('letter_templates')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->string('reference_number')->unique();
            $table->string('recipient_name');
            $table->string('recipient_email')->nullable();
            $table->json('custom_values')->nullable();
            $table->longText('compiled_html');
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('generated_letters');
    }
};
