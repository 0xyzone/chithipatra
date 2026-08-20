<?php

namespace App\Console\Commands;

use App\Services\EmployeeSyncService;
use Illuminate\Console\Command;

class SyncEmployeesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:sync-employees {--pages=10 : Maximum pages to sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync employee records from the external Waldo API';

    /**
     * Execute the console command.
     */
    public function handle(EmployeeSyncService $syncService): int
    {
        $this->info('Starting employee synchronization...');
        $maxPages = (int) $this->option('pages');

        $result = $syncService->sync($maxPages);

        if ($result['success']) {
            $this->info($result['message']);
            $this->table(
                ['Metric', 'Count'],
                [
                    ['Total Synced', $result['synced']],
                    ['New Employees Created', $result['created']],
                    ['Existing Employees Updated', $result['updated']],
                    ['Total Available on API', $result['total_available']],
                ]
            );

            return self::SUCCESS;
        }

        $this->error($result['message']);

        return self::FAILURE;
    }
}
