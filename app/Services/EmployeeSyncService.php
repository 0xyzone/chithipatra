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
     * Fetch all employees (or up to $maxPages pages) and upsert into the local database.
     *
     * @return array{success: bool, synced: int, created: int, updated: int, total_available: int, message: string}
     */
    public function sync(int $maxPages = 10): array
    {
        $currentPage = 1;
        $totalSynced = 0;
        $totalCreated = 0;
        $totalUpdated = 0;
        $totalAvailable = 0;

        try {
            do {
                $response = Http::withoutVerifying()
                    ->timeout(15)
                    ->retry(3, 200)
                    ->get($this->endpoint, [
                        'page' => $currentPage,
                    ]);

                if (! $response->successful()) {
                    Log::error('Employee sync failed at page '.$currentPage.': '.$response->body());
                    break;
                }

                $json = $response->json();
                $data = $json['data'] ?? [];
                $meta = $json['meta'] ?? [];
                $totalAvailable = $meta['total'] ?? count($data);
                $lastPage = $meta['last_page'] ?? 1;

                if (empty($data)) {
                    break;
                }

                foreach ($data as $item) {
                    $email = trim($item['email'] ?? '');
                    if (empty($email)) {
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

                    $departmentName = is_array($item['department'] ?? null)
                        ? ($item['department']['name'] ?? null)
                        : ($item['department'] ?? null);

                    $designationName = is_array($item['designation'] ?? null)
                        ? ($item['designation']['name'] ?? null)
                        : ($item['designation'] ?? null);

                    $attributes = [
                        'external_id' => $item['employee_code'] ?? ($item['id'] ?? null),
                        'name' => $item['name'] ?? trim(($item['first_name'] ?? '').' '.($item['last_name'] ?? '')),
                        'email' => $email,
                        'designation' => $designationName,
                        'department' => $departmentName,
                        'joining_date' => $joiningDate,
                        'salary' => isset($item['tips_amount']) ? (float) $item['tips_amount'] : null,
                        'phone' => $item['contact_number'] ?? ($item['phone'] ?? null),
                        'avatar' => $item['avatar'] ?? null,
                        'raw_data' => $item,
                    ];

                    $existing = Employee::where('email', $email)->first();

                    if ($existing) {
                        $existing->update($attributes);
                        $totalUpdated++;
                    } else {
                        Employee::create($attributes);
                        $totalCreated++;
                    }

                    $totalSynced++;
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
