import React from 'react';
import {
    RefreshCw,
    CheckCircle2,
    AlertCircle,
    X,
    Users,
    UserPlus,
    UserCheck,
    Database,
    Sparkles,
    Clock,
} from 'lucide-react';

export interface SyncStatsResult {
    success: boolean;
    synced: number;
    created: number;
    updated: number;
    total_available: number;
    message: string;
}

interface SyncEmployeesModalProps {
    isOpen: boolean;
    isSyncing: boolean;
    result: SyncStatsResult | null;
    error: string | null;
    onClose: () => void;
    onStartSync: () => void;
}

export function SyncEmployeesModal({
    isOpen,
    isSyncing,
    result,
    error,
    onClose,
    onStartSync,
}: SyncEmployeesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
                onClick={!isSyncing ? onClose : undefined}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all dark:border-neutral-800 dark:bg-[#161616] dark:text-neutral-100">
                {/* Close Button */}
                {!isSyncing && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}

                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isSyncing
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                            : result?.success
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : error
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
                    }`}>
                        <RefreshCw className={`h-6 w-6 ${isSyncing ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                            {isSyncing
                                ? 'Syncing Employees from Waldo API...'
                                : result?.success
                                ? 'Synchronization Complete'
                                : error
                                ? 'Sync Failed'
                                : 'Sync Employee Records'}
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Live sync with https://waldo.suminshrestha.com.np/api/employees
                        </p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="mt-5 space-y-4">
                    {/* Syncing State */}
                    {isSyncing && (
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 text-center dark:border-indigo-950/50 dark:bg-indigo-950/20">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
                                <RefreshCw className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="mt-3 text-sm font-semibold text-indigo-950 dark:text-indigo-200">
                                Fetching all records from Waldo API...
                            </h3>
                            <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-300">
                                Downloading all available employee datasets, syncing profile fields, departments, designations, and civic IDs.
                            </p>
                            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-indigo-200/60 dark:bg-indigo-900/60">
                                <div className="h-full w-full animate-pulse bg-indigo-600 dark:bg-indigo-400" />
                            </div>
                        </div>
                    )}

                    {/* Success State with detailed stats */}
                    {!isSyncing && result?.success && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span>{result.message}</span>
                            </div>

                            {/* Stat cards grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/50">
                                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                                        <span className="text-xs font-medium">Total Available on API</span>
                                        <Database className="h-4 w-4 text-neutral-400" />
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                                        {result.total_available}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 dark:border-indigo-950/50 dark:bg-indigo-950/20">
                                    <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
                                        <span className="text-xs font-medium">Total Processed</span>
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-indigo-950 dark:text-indigo-200">
                                        {result.synced}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3.5 dark:border-emerald-950/50 dark:bg-emerald-950/20">
                                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                                        <span className="text-xs font-medium">New Employees Created</span>
                                        <UserPlus className="h-4 w-4" />
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                                        {result.created}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 dark:border-blue-950/50 dark:bg-blue-950/20">
                                    <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                                        <span className="text-xs font-medium">Existing Updated</span>
                                        <UserCheck className="h-4 w-4" />
                                    </div>
                                    <div className="mt-1 text-2xl font-bold text-blue-950 dark:text-blue-200">
                                        {result.updated}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {!isSyncing && error && (
                        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                            <div>
                                <p className="font-semibold">Synchronization failed</p>
                                <p className="mt-0.5 text-rose-700 dark:text-rose-400">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Initial Idle Confirmation State */}
                    {!isSyncing && !result && !error && (
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                            <p className="text-xs text-neutral-600 dark:text-neutral-300">
                                Clicking <strong>Start Sync</strong> will retrieve all employee profiles from the live Waldo API endpoint (<code className="rounded bg-neutral-200/80 px-1 py-0.5 text-[11px] font-mono dark:bg-neutral-800">?all=1</code>). All records, designations, departments, dates, and civic identifiers will be created or refreshed.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                    {!isSyncing && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-2xs transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                            {result || error ? 'Close' : 'Cancel'}
                        </button>
                    )}

                    {!isSyncing && (
                        <button
                            type="button"
                            onClick={onStartSync}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>{result || error ? 'Sync Again' : 'Start Full Sync'}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
