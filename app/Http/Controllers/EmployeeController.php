<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Search and list employees for selection / autocomplete.
     */
    public function index(Request $request): JsonResponse|Response
    {
        $query = Employee::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('designation', 'like', "%{$search}%")
                    ->orWhere('department', 'like', "%{$search}%")
                    ->orWhere('external_id', 'like', "%{$search}%");
            });
        }

        if ($request->wantsJson()) {
            $employees = $query->orderBy('name')->limit(50)->get();

            return response()->json($employees);
        }

        $employees = $query->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Trigger manual employee synchronization.
     */
    public function sync(Request $request, EmployeeSyncService $syncService): JsonResponse|RedirectResponse
    {
        $pages = (int) $request->input('pages', 5);
        $result = $syncService->sync($pages);

        if ($request->wantsJson()) {
            return response()->json($result);
        }

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
