import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Trash2,
    Sliders,
    Eye,
    Tag,
    FileText,
    Check,
    Layers,
} from 'lucide-react';
import { ThemeToggle } from '../../components/ThemeToggle';
import { DocumentEditor } from '../../components/DocumentEditor';
import { CustomVariableBuilder, CustomVariable } from '../../components/CustomVariableBuilder';

interface LetterTemplateModel {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    content_html: string;
    custom_variables: CustomVariable[] | null;
    is_active: boolean;
}

interface TemplateEditorProps {
    template?: LetterTemplateModel | null;
    isEditing: boolean;
}

export default function TemplateEditor({ template, isEditing }: TemplateEditorProps) {
    const { data, setData, post, put, delete: destroy, processing, errors } = useForm({
        title: template?.title || '',
        category: template?.category || 'General',
        description: template?.description || '',
        content_html: template?.content_html || '<h2>OFFICIAL LETTER</h2><p>Dear <strong>{{employee.name}}</strong>,</p><p>We are writing regarding...</p>',
        custom_variables: template?.custom_variables || ([] as CustomVariable[]),
        is_active: template?.is_active ?? true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && template) {
            put(`/templates/${template.id}`);
        } else {
            post('/templates');
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this letter template?')) {
            destroy(`/templates/${template?.id}`);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors dark:bg-[#0d0d0d] dark:text-neutral-100">
            <Head title={isEditing ? `Edit: ${data.title}` : 'Create Letter Template'} />

            {/* Header Toolbar */}
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
                                {isEditing ? 'Edit Template' : 'Design New Letter Template'}
                            </h1>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Google Docs-style rich text builder with dynamic tag injection
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />
                        {isEditing && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isEditing ? 'Update Template' : 'Save Template'}</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Template Metadata Card */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Template Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Official Employment Appointment Letter"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Category
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                >
                                    <option value="General">General</option>
                                    <option value="Appointment">Appointment / Offer</option>
                                    <option value="Certificate">Certificate / Relieving</option>
                                    <option value="Compensation">Compensation / Appraisal</option>
                                    <option value="Disciplinary">Disciplinary / Warning</option>
                                </select>
                            </div>

                            <div className="sm:col-span-3">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    Description / Usage Notes (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Short description of when and how this letter should be used."
                                    className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 shadow-2xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Google Docs Style Rich Text Editor with A4 Dimensions & Merge Tags */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Document Canvas & Layout
                            </h2>
                            <span className="text-xs text-neutral-400">
                                A4 Portrait (210mm × 297mm)
                            </span>
                        </div>

                        <DocumentEditor
                            content={data.content_html}
                            onChange={(html) => setData('content_html', html)}
                            customVariables={data.custom_variables}
                        />
                        {errors.content_html && (
                            <p className="mt-1 text-xs text-red-500">{errors.content_html}</p>
                        )}
                    </div>

                    {/* Custom Dynamic Variable Builder */}
                    <div>
                        <CustomVariableBuilder
                            variables={data.custom_variables || []}
                            onChange={(variables) => setData('custom_variables', variables)}
                        />
                    </div>
                </form>
            </main>
        </div>
    );
}
