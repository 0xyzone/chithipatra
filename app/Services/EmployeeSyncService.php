<?php

namespace App\Services;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class EmployeeSyncService
{
    protected string $endpoint = 'https://waldo.suminshrestha.com.np/api/employees';

    /**
     * Fetch all employees and upsert into the local database.
     *
     * @param  int|null  $maxPages  Max pages if paginated (null for no limit / fetch all via all=1)
     * @return array{success: bool, synced: int, created: int, updated: int, total_available: int, message: string}
     */
    public function sync(?int $maxPages = null): array
    {
        $currentPage = 1;
        $totalSynced = 0;
        $totalCreated = 0;
        $totalUpdated = 0;
        $totalAvailable = 0;

        try {
            do {
                $queryParams = [
                    'all' => 1,
                ];

                if ($maxPages !== null) {
                    unset($queryParams['all']);
                    $queryParams['page'] = $currentPage;
                }

                $response = Http::withoutVerifying()
                    ->timeout(60)
                    ->retry(3, 200)
                    ->get($this->endpoint, $queryParams);

                if (! $response->successful()) {
                    Log::error('Employee sync failed: '.$response->body());
                    break;
                }

                $json = $response->json();
                $data = $json['data'] ?? (is_array($json) && array_is_list($json) ? $json : []);
                $meta = $json['meta'] ?? [];
                $totalAvailable = $meta['total'] ?? count($data);
                $lastPage = $meta['last_page'] ?? 1;

                if (empty($data)) {
                    break;
                }

                foreach ($data as $item) {
                    $externalId = trim((string) ($item['employee_code'] ?? ($item['id'] ?? '')));
                    $email = trim($item['email'] ?? '');
                    $email = ! empty($email) ? $email : null;

                    if (empty($externalId) && empty($email)) {
                        continue;
                    }

                    // Format dates
                    $joiningDate = null;
                    if (! empty($item['join_date_formatted'])) {
                        try {
                            $joiningDate = Carbon::parse($item['join_date_formatted'])->toDateString();
                        } catch (Throwable) {
                            $joiningDate = null;
                        }
                    }

                    $dateOfBirth = null;
                    if (! empty($item['dob_ad'])) {
                        try {
                            $dateOfBirth = Carbon::parse($item['dob_ad'])->toDateString();
                        } catch (Throwable) {
                            $dateOfBirth = null;
                        }
                    }

                    $departmentName = is_array($item['department'] ?? null)
                        ? ($item['department']['name'] ?? null)
                        : ($item['department'] ?? null);

                    $designationName = is_array($item['designation'] ?? null)
                        ? ($item['designation']['name'] ?? null)
                        : ($item['designation'] ?? null);

                    $designationId = is_array($item['designation'] ?? null)
                        ? ($item['designation']['id'] ?? null)
                        : ($item['designation_id'] ?? null);

                    $designationRank = is_array($item['designation'] ?? null)
                        ? ($item['designation']['rank'] ?? null)
                        : null;

                    $attributes = [
                        'external_id' => ! empty($externalId) ? $externalId : null,
                        'name' => $item['name'] ?? trim(($item['first_name'] ?? '').' '.($item['last_name'] ?? '')),
                        'first_name' => $item['first_name'] ?? null,
                        'middle_name' => $item['middle_name'] ?? null,
                        'last_name' => $item['last_name'] ?? null,
                        'email' => $email,
                        'gender' => $item['gender'] ?? null,
                        'employee_status' => $item['employee_status'] ?? null,
                        'designation' => $designationName,
                        'designation_id' => $designationId,
                        'designation_rank' => $designationRank,
                        'department' => $departmentName,
                        'department_id' => is_array($item['department'] ?? null)
                            ? ($item['department']['id'] ?? null)
                            : ($item['department_id'] ?? null),
                        'joining_date' => $joiningDate,
                        'date_of_birth' => $dateOfBirth,
                        'dob_bs' => $item['dob_bs'] ?? null,
                        'marital_status' => $item['marital_status'] ?? null,
                        'citizenship_number' => $item['citizenship_number'] ?? null,
                        'citizenship_issue_date' => $item['citizenship_issue_date'] ?? null,
                        'citizenship_issue_place' => $item['citizenship_issue_place'] ?? null,
                        'ssid' => $item['ssid'] ?? null,
                        'dp_rank' => $item['dp_rank'] ?? null,
                        'rank' => $item['rank'] ?? null,
                        'salary' => isset($item['tips_amount']) ? (float) $item['tips_amount'] : null,
                        'tips_status' => $item['tips_status'] ?? null,
                        'point_value' => isset($item['point_value']) ? (float) $item['point_value'] : null,
                        'tips_blank' => (bool) ($item['tips_blank'] ?? false),
                        'publish_tips' => (bool) ($item['publish_tips'] ?? false),
                        'tips_fixed' => (bool) ($item['tips_fixed'] ?? false),
                        'is_incomplete' => (bool) ($item['is_incomplete'] ?? false),
                        'phone' => $item['contact_number'] ?? ($item['phone'] ?? null),
                        'avatar' => $item['avatar'] ?? null,
                        'raw_data' => $item,
                    ];

                    $existing = null;
                    if (! empty($externalId)) {
                        $existing = Employee::where('external_id', $externalId)->first();
                    } elseif (! empty($email)) {
                        $existing = Employee::where('email', $email)->first();
                    }

                    if ($existing) {
                        $existing->update($attributes);
                        $totalUpdated++;
                    } else {
                        Employee::create($attributes);
                        $totalCreated++;
                    }

                    $totalSynced++;
                }

                // If fetched with all=1 (single response with everything), stop after first pass
                if ($maxPages === null) {
                    break;
                }

                $currentPage++;
            } while ($currentPage <= min($lastPage, $maxPages));

            return [
                'success' => true,
                'synced' => $totalSynced,
                'created' => $totalCreated,
                'updated' => $totalUpdated,
                'total_available' => $totalAvailable,
                'message' => "Successfully synced {$totalSynced} employees ({$totalCreated} created, {$totalUpdated} updated).",
            ];
        } catch (Throwable $e) {
            Log::error('Employee sync exception: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return [
                'success' => false,
                'synced' => $totalSynced,
                'created' => $totalCreated,
                'updated' => $totalUpdated,
                'total_available' => $totalAvailable,
                'message' => 'Sync failed: '.$e->getMessage(),
            ];
        }
    }
}
