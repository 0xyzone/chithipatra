import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Search,
    RefreshCw,
    Filter,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Building2,
    Briefcase,
    Mail,
    Phone,
    Calendar,
    ArrowLeft,
    FileText,
    IdCard,
    CheckCircle2,
    XCircle,
    UserCheck,
    Eye,
    X,
    SlidersHorizontal,
    Database,
} from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { SyncEmployeesModal, SyncStatsResult } from '../../components/SyncEmployeesModal';

interface EmployeeItem {
    id: number;
    external_id: string | null;
    name: string;
    first_name: string | null;
    middle_name: string | null;
    last_name: string | null;
    email: string | null;
    gender: string | null;
    employee_status: string | null;
    designation: string | null;
    designation_id: number | null;
    designation_rank: number | null;
    department: string | null;
    department_id: number | null;
    joining_date: string | null;
    date_of_birth: string | null;
    dob_bs: string | null;
    marital_status: string | null;
    citizenship_number: string | null;
    citizenship_issue_date: string | null;
    citizenship_issue_place: string | null;
    ssid: string | null;
    dp_rank: number | null;
    rank: number | null;
    salary: number | null;
    tips_status: string | null;
    point_value: number | null;
    tips_blank: boolean;
    publish_tips: boolean;
    tips_fixed: boolean;
    is_incomplete: boolean;
    phone: string | null;
    avatar: string | null;
    raw_data: Record<string, any> | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedEmployees {
    data: EmployeeItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface EmployeesIndexProps {
    employees: PaginatedEmployees;
    departments: string[];
    designations: string[];
    statuses: string[];
    filters: {
        search: string;
        department: string;
        designation: string;
        status: string;
        sort: string;
        direction: string;
        per_page: number;
    };
    totalCount: number;
}

export default function EmployeesIndex({
    employees,
    departments,
    designations,
    statuses,
    filters,
    totalCount,
}: EmployeesIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [department, setDepartment] = useState(filters.department || '');
    const [designation, setDesignation] = useState(filters.designation || '');
    const [status, setStatus] = useState(filters.status || '');
    const [perPage, setPerPage] = useState(filters.per_page || 20);

    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<SyncStatsResult | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);

    const applyFilters = (overrides = {}) => {
        const query = {
            search,
            department,
            designation,
            status,
            per_page: perPage,
            sort: filters.sort,
            direction: filters.direction,
            ...overrides,
        };

        // Clean empty keys
        Object.keys(query).forEach((key) => {
            if ((query as any)[key] === '' || (query as any)[key] === null) {
                delete (query as any)[key];
            }
        });

        router.get('/employees', query, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ page: 1 });
    };

    const handleSort = (field: string) => {
        const nextDirection =
            filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        applyFilters({ sort: field, direction: nextDirection, page: 1 });
    };

    const handleResetFilters = () => {
        setSearch('');
        setDepartment('');
        setDesignation('');
        setStatus('');
        setPerPage(20);
        router.get('/employees', {}, { preserveState: true, replace: true });
    };

    const handleSyncEmployees = async () => {
        setIsSyncing(true);
        setSyncError(null);
        setSyncResult(null);
        setIsSyncModalOpen(true);

        try {
            const response = await fetch('/employees/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({}),
            });

            const data: SyncStatsResult = await response.json();
            if (data.success) {
                setSyncResult(data);
                router.reload();
            } else {
                setSyncError(data.message || 'Synchronization failed.');
            }
        } catch (err: any) {
            setSyncError(err?.message || 'Failed to sync employees from external API.');
        } finally {
            setIsSyncing(false);
        }
    };

    const hasActiveFilters = Boolean(
        filters.search || filters.department || filters.designation || filters.status
    );

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-[#0d0d0d] dark:text-neutral-100">
            <Head title="Employee Directory - Chithipatra" />

            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-[#141414]/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                                    Employee Directory
                                </h1>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">
                                    {totalCount} Total
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Synced live records from Waldo HRMS
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />

                        <button
                            type="button"
                            onClick={handleSyncEmployees}
                            disabled={isSyncing}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                            title="Sync live employee records from Waldo API"
                        >
                            <RefreshCw className={`h-3.5 w-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
                            <span>{isSyncing ? 'Syncing...' : 'Sync Employees'}</span>
                        </button>

                        <Link
                            href="/generate"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Generate Letter</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Sync Employees Modal */}
            <SyncEmployeesModal
                isOpen={isSyncModalOpen}
                isSyncing={isSyncing}
                result={syncResult}
                error={syncError}
                onClose={() => setIsSyncModalOpen(false)}
                onStartSync={handleSyncEmployees}
            />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
                {/* Search & Filter Toolbar */}
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900">
                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            {/* Search bar */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, code, email, designation, phone, citizenship..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-900 placeholder:text-neutral-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-800"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    <Search className="h-3.5 w-3.5" />
                                    <span>Filter</span>
                                </button>

                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetFilters}
                                        className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-medium text-neutral-600 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        <span>Reset</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter Select Dropdowns */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Department */}
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Department
                                </label>
                                <select
                                    value={department}
                                    onChange={(e) => {
                                        setDepartment(e.target.value);
                                        applyFilters({ department: e.target.value, page: 1 });
                                    }}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white"
                                >
                                    <option value="">All Departments ({departments.length})</option>
                                    {departments.map((dept) => (
                                        <option key={dept} value={dept}>
                                            {dept}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Designation */}
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Designation
                                </label>
                                <select
                                    value={designation}
                                    onChange={(e) => {
                                        setDesignation(e.target.value);
                                        applyFilters({ designation: e.target.value, page: 1 });
                                    }}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white"
                                >
                                    <option value="">All Designations ({designations.length})</option>
                                    {designations.map((des) => (
                                        <option key={des} value={des}>
                                            {des}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Employee Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        applyFilters({ status: e.target.value, page: 1 });
                                    }}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white"
                                >
                                    <option value="">All Statuses ({statuses.length})</option>
                                    {statuses.map((st) => (
                                        <option key={st} value={st}>
                                            {st}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Per page */}
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Rows Per Page
                                </label>
                                <select
                                    value={perPage}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        setPerPage(val);
                                        applyFilters({ per_page: val, page: 1 });
                                    }}
                                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 text-xs font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-white"
                                >
                                    <option value={15}>15 per page</option>
                                    <option value={20}>20 per page</option>
                                    <option value={50}>50 per page</option>
                                    <option value={100}>100 per page</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Employees Table Container */}
                <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xs dark:border-neutral-800/80 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-neutral-200/80 px-6 py-4 dark:border-neutral-800/80">
                        <div className="flex items-center gap-2.5">
                            <Users className="h-4 w-4 text-neutral-500" />
                            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                All Employees
                            </h2>
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                Showing {employees.from || 0} - {employees.to || 0} of {employees.total}
                            </span>
                        </div>
                    </div>

                    {employees.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                                <Users className="h-6 w-6 text-neutral-400" />
                            </div>
                            <h3 className="mt-4 text-sm font-semibold text-neutral-900 dark:text-white">
                                No employees found
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {hasActiveFilters
                                    ? 'Try changing or clearing your search filters.'
                                    : 'Click "Sync Employees" to import employee records from Waldo HRMS.'}
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-200 bg-neutral-50/50 font-semibold uppercase tracking-wider text-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/40">
                                        <th
                                            className="cursor-pointer py-3.5 px-4 hover:text-neutral-700 dark:hover:text-neutral-200"
                                            onClick={() => handleSort('external_id')}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>Code</span>
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer py-3.5 px-4 hover:text-neutral-700 dark:hover:text-neutral-200"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>Name & Details</span>
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer py-3.5 px-4 hover:text-neutral-700 dark:hover:text-neutral-200"
                                            onClick={() => handleSort('department')}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>Department</span>
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </th>
                                        <th
                                            className="cursor-pointer py-3.5 px-4 hover:text-neutral-700 dark:hover:text-neutral-200"
                                            onClick={() => handleSort('designation')}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>Designation</span>
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </th>
                                        <th className="py-3.5 px-4">Status / Gender</th>
                                        <th
                                            className="cursor-pointer py-3.5 px-4 hover:text-neutral-700 dark:hover:text-neutral-200"
                                            onClick={() => handleSort('joining_date')}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span>Joining Date</span>
                                                <ArrowUpDown className="h-3 w-3" />
                                            </div>
                                        </th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                    {employees.data.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            className="group transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="py-3.5 px-4 font-mono font-medium text-neutral-500 dark:text-neutral-400">
                                                {emp.external_id || `#${emp.id}`}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-neutral-900 dark:text-white">
                                                    {emp.name}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    {emp.email ? (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3 text-neutral-400" />
                                                            {emp.email}
                                                        </span>
                                                    ) : (
                                                        <span className="italic text-neutral-400">No email</span>
                                                    )}
                                                    {emp.phone && (
                                                        <span className="flex items-center gap-1 text-neutral-400">
                                                            • {emp.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                    <Building2 className="h-3 w-3 text-neutral-400" />
                                                    {emp.department || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                                                {emp.designation || 'Staff'}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex flex-col gap-1">
                                                    {emp.employee_status && (
                                                        <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                            emp.employee_status.toLowerCase() === 'active' || emp.employee_status.toLowerCase() === 'permanent'
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                                        }`}>
                                                            {emp.employee_status}
                                                        </span>
                                                    )}
                                                    {emp.gender && (
                                                        <span className="text-[11px] text-neutral-400 capitalize">
                                                            {emp.gender}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                                                {emp.joining_date ? (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3 text-neutral-400" />
                                                        {new Date(emp.joining_date).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedEmployee(emp)}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                                        title="View full profile"
                                                    >
                                                        <Eye className="h-3 w-3 text-neutral-400" />
                                                        <span>Profile</span>
                                                    </button>
                                                    <Link
                                                        href={`/generate?employee_id=${emp.id}`}
                                                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60"
                                                        title="Generate letter for this employee"
                                                    >
                                                        <Sparkles className="h-3 w-3" />
                                                        <span>Generate</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {employees.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                Page {employees.current_page} of {employees.last_page}
                            </div>
                            <div className="flex items-center gap-1">
                                {employees.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        preserveState
                                        className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : link.url
                                                ? 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'
                                                : 'cursor-not-allowed text-neutral-300 dark:text-neutral-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Profile Drawer / Modal */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedEmployee(null)}
                    />
                    <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all dark:border-neutral-800 dark:bg-[#161616] dark:text-neutral-100">
                        <button
                            type="button"
                            onClick={() => setSelectedEmployee(null)}
                            className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        {/* Profile Header */}
                        <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-md">
                                {selectedEmployee.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                                    {selectedEmployee.name}
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                    {selectedEmployee.designation || 'Staff'} • {selectedEmployee.department || 'General'}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                        Code: {selectedEmployee.external_id || `#${selectedEmployee.id}`}
                                    </span>
                                    {selectedEmployee.employee_status && (
                                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                            {selectedEmployee.employee_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Details Grid */}
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* Personal Details */}
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50 space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    Personal Details
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Email</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.email || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Phone</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.phone || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Gender</span>
                                        <span className="font-medium text-neutral-900 dark:text-white capitalize">{selectedEmployee.gender || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Marital Status</span>
                                        <span className="font-medium text-neutral-900 dark:text-white capitalize">{selectedEmployee.marital_status || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Date of Birth (AD)</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.date_of_birth || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">DOB (BS)</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.dob_bs || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Civic & Identity Details */}
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50 space-y-2">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                    Civic & Identity
                                </h4>
                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Citizenship No.</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.citizenship_number || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Issue Date</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.citizenship_issue_date || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Issue Place</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.citizenship_issue_place || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">SSID</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.ssid || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Joining Date</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.joining_date || '—'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Salary / Tips</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{selectedEmployee.salary ? `NPR ${selectedEmployee.salary}` : '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Generate Link */}
                        <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                            <button
                                type="button"
                                onClick={() => setSelectedEmployee(null)}
                                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                Close
                            </button>
                            <Link
                                href={`/generate?employee_id=${selectedEmployee.id}`}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Generate Letter for {selectedEmployee.first_name || selectedEmployee.name}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
