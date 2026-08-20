import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    FileText,
    User,
    Download,
    Eye,
    Sparkles,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    RefreshCw,
    Building2,
    Calendar,
    Save,
    ExternalLink,
} from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { CustomVariable } from '../../components/CustomVariableBuilder';

interface EmployeeItem {
    id: number;
    name: string;
    email: string;
    designation: string | null;
    department: string | null;
    salary: number | null;
    phone: string | null;
    external_id: string | null;
    joining_date: string | null;
}

interface TemplateItem {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    content_html: string;
    custom_variables: CustomVariable[] | null;
}

interface LetterGeneratorProps {
    templates: TemplateItem[];
    employees: EmployeeItem[];
    initialTemplateId?: number | null;
    initialEmployeeId?: number | null;
}

export default function LetterGenerator({
    templates,
    employees,
    initialTemplateId,
    initialEmployeeId,
}: LetterGeneratorProps) {
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>(
        initialTemplateId || (templates[0]?.id ?? '')
    );
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | ''>(
        initialEmployeeId || (employees[0]?.id ?? '')
    );
    const [employeeSearch, setEmployeeSearch] = useState('');
    const [customValues, setCustomValues] = useState<Record<string, any>>({});
    const [compiledHtml, setCompiledHtml] = useState<string>('');
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

    const selectedTemplate = templates.find((t) => t.id === Number(selectedTemplateId));
    const selectedEmployee = employees.find((e) => e.id === Number(selectedEmployeeId));

    // Initialize custom variable defaults when template changes
    useEffect(() => {
        if (selectedTemplate?.custom_variables) {
            const defaults: Record<string, any> = {};
            selectedTemplate.custom_variables.forEach((v) => {
                defaults[v.key] = v.default_value ?? '';
            });
            setCustomValues(defaults);
        } else {
            setCustomValues({});
        }
    }, [selectedTemplateId]);

    // Live preview fetcher (debounced)
    useEffect(() => {
        if (!selectedTemplateId) return;

        const timer = setTimeout(async () => {
            setIsLoadingPreview(true);
            try {
                const response = await fetch('/letters/preview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN':
                            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    },
                    body: JSON.stringify({
                        template_id: selectedTemplateId,
                        employee_id: selectedEmployeeId || null,
                        custom_values: customValues,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompiledHtml(data.compiled_html);
                }
            } catch (err) {
                console.error('Preview error:', err);
            } finally {
                setIsLoadingPreview(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [selectedTemplateId, selectedEmployeeId, customValues]);

    const handleCustomValueChange = (key: string, value: any) => {
        setCustomValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveAndGenerate = async () => {
        if (!selectedTemplateId) {
            alert('Please select a template first.');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/letters/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    letter_template_id: selectedTemplateId,
                    employee_id: selectedEmployeeId || null,
                    custom_values: customValues,
                }),
            });

            const data = await response.json();
            if (data.success && data.download_url) {
                window.location.href = data.download_url;
            } else {
                router.visit('/letters/history');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to generate letter. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDirectExport = () => {
        if (!selectedTemplateId) return;

        // Build hidden form submission to trigger direct download
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/letters/export-direct';

        const csrf = document.createElement('input');
        csrf.type = 'hidden';
        csrf.name = '_token';
        csrf.value = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
        form.appendChild(csrf);

        const templateInput = document.createElement('input');
        templateInput.type = 'hidden';
        templateInput.name = 'template_id';
        templateInput.value = String(selectedTemplateId);
        form.appendChild(templateInput);

        if (selectedEmployeeId) {
            const empInput = document.createElement('input');
            empInput.type = 'hidden';
            empInput.name = 'employee_id';
            empInput.value = String(selectedEmployeeId);
            form.appendChild(empInput);
        }

        Object.entries(customValues).forEach(([k, v]) => {
            const valInput = document.createElement('input');
            valInput.type = 'hidden';
            valInput.name = `custom_values[${k}]`;
            valInput.value = String(v);
            form.appendChild(valInput);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
            emp.email.toLowerCase().includes(employeeSearch.toLowerCase()) ||
            (emp.department && emp.department.toLowerCase().includes(employeeSearch.toLowerCase())) ||
            (emp.external_id && emp.external_id.toLowerCase().includes(employeeSearch.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-[#0d0d0d] dark:text-neutral-100">
            <Head title="Generate Document - Chithipatra" />

            {/* Top Navigation Bar */}
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
                                Letter Generation Studio
                            </h1>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Merge dynamic template schema with employee records
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={handleDirectExport}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-2xs transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                        >
                            <Download className="h-4 w-4 text-neutral-500" />
                            <span>Quick Export PDF</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveAndGenerate}
                            disabled={isSaving || !selectedTemplateId}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            <span>Save & Download</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Studio Grid: Controls & Dynamic Form on Left, Live A4 Preview on Right */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column: Template, Employee & Dynamic Form Fields */}
                    <div className="space-y-5 lg:col-span-5">
                        {/* 1. Template Selection Card */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center justify-between">
                                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    <FileText className="h-4 w-4 text-indigo-500" />
                                    1. Select Letter Template
                                </label>
                                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                    {templates.length} available
                                </span>
                            </div>
                            <select
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(Number(e.target.value))}
                                className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            >
                                {templates.map((tpl) => (
                                    <option key={tpl.id} value={tpl.id}>
                                        [{tpl.category}] {tpl.title}
                                    </option>
                                ))}
                            </select>
                            {selectedTemplate?.description && (
                                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    {selectedTemplate.description}
                                </p>
                            )}
                        </div>

                        {/* 2. Employee Selection Card with Autocomplete Search */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center justify-between">
                                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    <User className="h-4 w-4 text-emerald-500" />
                                    2. Target Employee Record
                                </label>
                                <span className="text-xs text-neutral-400">
                                    {employees.length} Synced
                                </span>
                            </div>

                            <input
                                type="text"
                                placeholder="Search employee by name, email, department..."
                                value={employeeSearch}
                                onChange={(e) => setEmployeeSearch(e.target.value)}
                                className="mb-2 block w-full rounded-lg border border-neutral-300 bg-neutral-50/50 px-3 py-1.5 text-xs text-neutral-900 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />

                            <select
                                value={selectedEmployeeId}
                                onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
                                className="block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            >
                                <option value="">-- No Employee Selected (Manual Mode) --</option>
                                {filteredEmployees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name} ({emp.designation || 'Staff'} • {emp.department || 'General'})
                                    </option>
                                ))}
                            </select>

                            {selectedEmployee && (
                                <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-xs dark:border-emerald-950/60 dark:bg-emerald-950/20">
                                    <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300">
                                        <span>{selectedEmployee.name}</span>
                                        <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                                            {selectedEmployee.external_id || `#${selectedEmployee.id}`}
                                        </span>
                                    </div>
                                    <div className="mt-1 grid grid-cols-2 gap-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                                        <div>📧 {selectedEmployee.email}</div>
                                        <div>💼 {selectedEmployee.designation || 'N/A'}</div>
                                        <div>🏢 {selectedEmployee.department || 'N/A'}</div>
                                        <div>📅 Joined: {selectedEmployee.joining_date || 'N/A'}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Dynamic Template Schema Form Generator */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-3 flex items-center justify-between">
                                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                    3. Dynamic Form Fields
                                </label>
                                <span className="text-xs text-neutral-400">
                                    {selectedTemplate?.custom_variables?.length || 0} fields
                                </span>
                            </div>

                            {!selectedTemplate?.custom_variables || selectedTemplate.custom_variables.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
                                    This template uses only standard employee tags. No custom inputs required.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedTemplate.custom_variables.map((field) => (
                                        <div key={field.key} className="space-y-1">
                                            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                                <span className="ml-1.5 font-mono text-[10px] text-neutral-400">
                                                    {`{{custom.${field.key}}}`}
                                                </span>
                                            </label>

                                            {/* Field Types */}
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    rows={3}
                                                    value={customValues[field.key] ?? ''}
                                                    onChange={(e) => handleCustomValueChange(field.key, e.target.value)}
                                                    placeholder={field.default_value || `Enter ${field.label}...`}
                                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 shadow-2xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                                />
                                            ) : field.type === 'select' ? (
                                                <select
                                                    value={customValues[field.key] ?? ''}
                                                    onChange={(e) => handleCustomValueChange(field.key, e.target.value)}
                                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 shadow-2xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                                >
                                                    <option value="">-- Choose Option --</option>
                                                    {field.options?.map((opt) => (
                                                        <option key={opt} value={opt}>
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'date' ? (
                                                <input
                                                    type="date"
                                                    value={customValues[field.key] ?? ''}
                                                    onChange={(e) => handleCustomValueChange(field.key, e.target.value)}
                                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 shadow-2xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                                />
                                            ) : (
                                                <input
                                                    type={field.type === 'number' ? 'number' : 'text'}
                                                    value={customValues[field.key] ?? ''}
                                                    onChange={(e) => handleCustomValueChange(field.key, e.target.value)}
                                                    placeholder={field.default_value || `Enter ${field.label}...`}
                                                    className="block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 shadow-2xs focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Live Real-Time Compiled A4 Preview */}
                    <div className="flex flex-col lg:col-span-7">
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                                    Live Document Preview (A4 Dimensions)
                                </span>
                                {isLoadingPreview && (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-neutral-400" />
                                )}
                            </div>
                            <span className="rounded bg-neutral-200/70 px-2 py-0.5 text-[11px] font-mono text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                210mm × 297mm
                            </span>
                        </div>

                        {/* A4 Canvas Container */}
                        <div className="flex grow items-start justify-center overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-200/50 p-4 md:p-8 dark:border-neutral-800 dark:bg-neutral-950/80">
                            <div className="w-full max-w-[210mm] min-h-[297mm] rounded-sm bg-white p-[20mm] text-[#1a1a1a] shadow-2xl ring-1 ring-black/5 dark:bg-white dark:text-[#1a1a1a]">
                                <div
                                    dangerouslySetInnerHTML={{ __html: compiledHtml }}
                                    className="prose prose-neutral max-w-none text-sm leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-neutral-300 [&_th]:bg-neutral-100 [&_th]:p-2 [&_td]:border [&_td]:border-neutral-300 [&_td]:p-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
