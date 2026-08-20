import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    Users,
    History,
    Plus,
    RefreshCw,
    Download,
    Edit3,
    ArrowRight,
    Search,
    Sparkles,
    CheckCircle2,
    Calendar,
    Clock,
    FileCheck,
    Loader2,
    Building2,
    TrendingUp,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { CustomVariable } from '../components/CustomVariableBuilder';

interface LetterTemplateItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    content_html: string;
    custom_variables: CustomVariable[] | null;
    is_active: boolean;
    generated_letters_count?: number;
    created_at: string;
}

interface RecentLetterItem {
    id: number;
    reference_number: string;
    recipient_name: string;
    recipient_email: string | null;
    template?: { id: number; title: string };
    employee?: { id: number; name: string; department: string };
    created_at: string;
}

interface DashboardProps {
    templates: LetterTemplateItem[];
    recentLetters: RecentLetterItem[];
    stats: {
        total_templates: number;
        total_employees: number;
        total_letters: number;
        last_sync: string | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function Dashboard({ templates, recentLetters, stats, flash }: DashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncNotification, setSyncNotification] = useState<string | null>(null);

    const handleSyncEmployees = async () => {
        setIsSyncing(true);
        setSyncNotification(null);
        try {
            const response = await fetch('/employees/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({ pages: 10 }),
            });

            const data = await response.json();
            if (data.success) {
                setSyncNotification(data.message);
                router.reload({ only: ['stats'] });
            } else {
                setSyncNotification(`Sync failed: ${data.message}`);
            }
        } catch (err) {
            setSyncNotification('Failed to sync employees from external API.');
        } finally {
            setIsSyncing(false);
        }
    };

    const filteredTemplates = templates.filter(
        (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-[#0d0d0d] dark:text-neutral-100">
            <Head title="Dashboard - Chithipatra Document Engine" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-[#141414]/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                                    Chithipatra
                                </h1>
                                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                                    v1.0 Pro
                                </span>
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Dynamic Letter & Document Generation System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />

                        <Link
                            href="/letters/history"
                            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                            <History className="h-3.5 w-3.5" />
                            <span>Audit History</span>
                        </Link>

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

            {/* Notification Banner */}
            {syncNotification && (
                <div className="border-b border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span>{syncNotification}</span>
                        </div>
                        <button
                            onClick={() => setSyncNotification(null)}
                            className="font-medium hover:underline text-xs"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Templates Stat */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Letter Templates
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                <FileText className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                {stats.total_templates}
                            </span>
                            <span className="text-xs text-neutral-500">Ready to deploy</span>
                        </div>
                    </div>

                    {/* Employees Stat */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Synced Employees
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                <Users className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                {stats.total_employees}
                            </span>
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">Live directory</span>
                        </div>
                    </div>

                    {/* Letters Generated Stat */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Letters Generated
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                                <FileCheck className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                {stats.total_letters}
                            </span>
                            <span className="text-xs text-neutral-500">PDF exports</span>
                        </div>
                    </div>

                    {/* Last Sync Stat */}
                    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs transition hover:shadow-md dark:border-neutral-800/80 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Sync Status
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
                                <Clock className="h-4 w-4" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {stats.last_sync ? new Date(stats.last_sync).toLocaleDateString() : 'Never'}
                            </span>
                            <span className="text-[11px] text-neutral-500">Daily @ 01:00 AM</span>
                        </div>
                    </div>
                </div>

                {/* Templates Section */}
                <div>
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                Letter Templates
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Click any template to immediately generate or edit its document schema
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Filter templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 sm:w-64 rounded-lg border border-neutral-300 bg-white py-1.5 pl-8 pr-3 text-xs text-neutral-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                />
                            </div>
                            <Link
                                href="/templates/create"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Create Template</span>
                            </Link>
                        </div>
                    </div>

                    {/* Template Card Grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xs transition hover:border-indigo-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-800"
                            >
                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                            {template.category}
                                        </span>
                                        <span className="text-[11px] text-neutral-400">
                                            {template.generated_letters_count || 0} letters generated
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
                                        {template.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-neutral-500 line-clamp-2 dark:text-neutral-400">
                                        {template.description || 'Standard official template with dynamic employee merge fields.'}
                                    </p>

                                    {template.custom_variables && template.custom_variables.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {template.custom_variables.slice(0, 3).map((v) => (
                                                <span
                                                    key={v.key}
                                                    className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                                                >
                                                    {`{{custom.${v.key}}}`}
                                                </span>
                                            ))}
                                            {template.custom_variables.length > 3 && (
                                                <span className="text-[10px] text-neutral-400 self-center">
                                                    +{template.custom_variables.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
                                    <Link
                                        href={`/templates/${template.id}/edit`}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600 hover:text-indigo-600 dark:text-neutral-400 dark:hover:text-indigo-400"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                        <span>Edit Template</span>
                                    </Link>
                                    <Link
                                        href={`/generate?template_id=${template.id}`}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                                    >
                                        <span>Generate</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Generated Letters Audit Table */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                                Recent Generated Letters
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Audit trail of all compiled and distributed letter snapshots
                            </p>
                        </div>
                        <Link
                            href="/letters/history"
                            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                            View All &rarr;
                        </Link>
                    </div>

                    {recentLetters.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-neutral-200 p-8 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
                            No letters generated yet. Choose a template above to generate your first document!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-200 font-semibold uppercase tracking-wider text-neutral-400 dark:border-neutral-800">
                                        <th className="py-3 px-3">Reference #</th>
                                        <th className="py-3 px-3">Recipient</th>
                                        <th className="py-3 px-3">Template</th>
                                        <th className="py-3 px-3">Date Generated</th>
                                        <th className="py-3 px-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                    {recentLetters.map((letter) => (
                                        <tr key={letter.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                                            <td className="py-3 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                                                {letter.reference_number}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="font-medium text-neutral-900 dark:text-white">
                                                    {letter.recipient_name}
                                                </div>
                                                <div className="text-[11px] text-neutral-400">
                                                    {letter.recipient_email || 'No email specified'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-neutral-600 dark:text-neutral-300">
                                                {letter.template?.title || 'Custom Letter'}
                                            </td>
                                            <td className="py-3 px-3 text-neutral-500 dark:text-neutral-400">
                                                {new Date(letter.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-3 text-right">
                                                <a
                                                    href={`/letters/${letter.id}/download`}
                                                    className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                                >
                                                    <Download className="h-3 w-3 text-neutral-500" />
                                                    <span>PDF</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
