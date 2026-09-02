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
        Schema::table('employees', function (Blueprint $table): void {
            // Name parts
            $table->string('first_name')->nullable()->after('name');
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('last_name')->nullable()->after('middle_name');

            // Personal details
            $table->string('gender')->nullable()->after('email');
            $table->string('employee_status')->nullable()->after('gender');
            $table->date('date_of_birth')->nullable()->after('joining_date');
            $table->string('dob_bs')->nullable()->after('date_of_birth');
            $table->string('marital_status')->nullable()->after('dob_bs');

            // Civic / identity
            $table->string('citizenship_number')->nullable()->after('marital_status');
            $table->string('citizenship_issue_date')->nullable()->after('citizenship_number');
            $table->string('citizenship_issue_place')->nullable()->after('citizenship_issue_date');
            $table->string('ssid')->nullable()->after('citizenship_issue_place');

            // Org hierarchy
            $table->unsignedInteger('department_id')->nullable()->after('department');
            $table->unsignedInteger('designation_id')->nullable()->after('designation');
            $table->unsignedInteger('designation_rank')->nullable()->after('designation_id');
            $table->unsignedInteger('dp_rank')->nullable()->after('designation_rank');
            $table->unsignedInteger('rank')->nullable()->after('dp_rank');

            // Tips / payroll details
            $table->string('tips_status')->nullable()->after('salary');
            $table->decimal('point_value', 10, 4)->nullable()->after('tips_status');
            $table->boolean('tips_blank')->default(false)->after('point_value');
            $table->boolean('publish_tips')->default(false)->after('tips_blank');
            $table->boolean('tips_fixed')->default(false)->after('publish_tips');

            // Misc
            $table->boolean('is_incomplete')->default(false)->after('tips_fixed');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table): void {
            $table->dropColumn([
                'first_name',
                'middle_name',
                'last_name',
                'gender',
                'employee_status',
                'date_of_birth',
                'dob_bs',
                'marital_status',
                'citizenship_number',
                'citizenship_issue_date',
                'citizenship_issue_place',
                'ssid',
                'department_id',
                'designation_id',
                'designation_rank',
                'dp_rank',
                'rank',
                'tips_status',
                'point_value',
                'tips_blank',
                'publish_tips',
                'tips_fixed',
                'is_incomplete',
            ]);
        });
    }
};
