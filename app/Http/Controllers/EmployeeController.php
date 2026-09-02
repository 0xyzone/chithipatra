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
     * Search, filter, and list employees.
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
                    ->orWhere('external_id', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('citizenship_number', 'like', "%{$search}%");
            });
        }

        if ($department = $request->input('department')) {
            $query->where('department', $department);
        }

        if ($designation = $request->input('designation')) {
            $query->where('designation', $designation);
        }

        if ($status = $request->input('status')) {
            $query->where('employee_status', $status);
        }

        if ($request->wantsJson()) {
            $employees = $query->orderBy('name')->limit(50)->get();

            return response()->json($employees);
        }

        $sortField = $request->input('sort', 'name');
        $sortDirection = $request->input('direction', 'asc') === 'desc' ? 'desc' : 'asc';
        $allowedSorts = ['name', 'external_id', 'department', 'designation', 'joining_date', 'salary', 'created_at'];

        if (in_array($sortField, $allowedSorts, true)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        $perPage = (int) $request->input('per_page', 20);
        $perPage = min(max($perPage, 10), 100);

        $employees = $query->paginate($perPage)->withQueryString();

        $departments = Employee::whereNotNull('department')
            ->where('department', '!=', '')
            ->distinct()
            ->orderBy('department')
            ->pluck('department');

        $designations = Employee::whereNotNull('designation')
            ->where('designation', '!=', '')
            ->distinct()
            ->orderBy('designation')
            ->pluck('designation');

        $statuses = Employee::whereNotNull('employee_status')
            ->where('employee_status', '!=', '')
            ->distinct()
            ->orderBy('employee_status')
            ->pluck('employee_status');

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'departments' => $departments,
            'designations' => $designations,
            'statuses' => $statuses,
            'filters' => [
                'search' => $request->input('search', ''),
                'department' => $request->input('department', ''),
                'designation' => $request->input('designation', ''),
                'status' => $request->input('status', ''),
                'sort' => $sortField,
                'direction' => $sortDirection,
                'per_page' => $perPage,
            ],
            'totalCount' => Employee::count(),
        ]);
    }

    /**
     * Trigger manual employee synchronization.
     */
    public function sync(Request $request, EmployeeSyncService $syncService): JsonResponse|RedirectResponse
    {
        $pages = $request->has('pages') ? (int) $request->input('pages') : null;
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
