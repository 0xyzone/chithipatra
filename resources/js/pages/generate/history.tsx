import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileCheck, Search, Calendar, User, FileText } from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';

interface GeneratedLetterItem {
    id: number;
    reference_number: string;
    recipient_name: string;
    recipient_email: string | null;
    custom_values: Record<string, any> | null;
    created_at: string;
    template?: { id: number; title: string; category: string };
    employee?: { id: number; name: string; department: string; designation: string };
    author?: { id: number; name: string };
}

interface HistoryProps {
    letters: {
        data: GeneratedLetterItem[];
        links: any[];
        total: number;
    };
}

export default function LetterHistory({ letters }: HistoryProps) {
    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-[#0d0d0d] dark:text-neutral-100">
            <Head title="Generated Letters Audit History - Chithipatra" />

            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-[#141414]/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 shadow-2xs hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Dashboard</span>
                        </Link>
                        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
                        <div>
                            <h1 className="text-base font-bold text-neutral-900 dark:text-white">
                                Generated Letters Audit Log
                            </h1>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Permanent record of compiled documents and PDF certificates
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />
                        <Link
                            href="/generate"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <FileText className="h-3.5 w-3.5" />
                            <span>New Letter</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                                All Issued Documents ({letters.total})
                            </h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Re-download original pixel-perfect PDF snapshots at any time
                            </p>
                        </div>
                    </div>

                    {letters.data.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
                            No letter history found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-neutral-200 font-semibold uppercase tracking-wider text-neutral-400 dark:border-neutral-800">
                                        <th className="py-3.5 px-3">Ref Code</th>
                                        <th className="py-3.5 px-3">Recipient</th>
                                        <th className="py-3.5 px-3">Template Category</th>
                                        <th className="py-3.5 px-3">Template Title</th>
                                        <th className="py-3.5 px-3">Date Issued</th>
                                        <th className="py-3.5 px-3 text-right">PDF Download</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                                    {letters.data.map((letter) => (
                                        <tr key={letter.id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                                            <td className="py-3.5 px-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                                {letter.reference_number}
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <div className="font-medium text-neutral-900 dark:text-white">
                                                    {letter.recipient_name}
                                                </div>
                                                <div className="text-[11px] text-neutral-400">
                                                    {letter.recipient_email || (letter.employee?.department ? `Dept: ${letter.employee.department}` : 'N/A')}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-3">
                                                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                                    {letter.template?.category || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-3 text-neutral-700 dark:text-neutral-200">
                                                {letter.template?.title || 'Custom Template'}
                                            </td>
                                            <td className="py-3.5 px-3 text-neutral-500 dark:text-neutral-400">
                                                {new Date(letter.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>
                                            <td className="py-3.5 px-3 text-right">
                                                <a
                                                    href={`/letters/${letter.id}/download`}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                                                >
                                                    <Download className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                                                    <span>Download PDF</span>
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
