import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Minus,
    Undo,
    Redo,
    Tag,
    User,
    Sparkles,
    Calendar,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { CustomVariable } from './CustomVariableBuilder';

interface DocumentEditorProps {
    content: string;
    onChange: (html: string) => void;
    customVariables?: CustomVariable[];
}

export function DocumentEditor({ content, onChange, customVariables = [] }: DocumentEditorProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Underline,
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: 'Start writing your official letter template or insert tags from the sidebar...',
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) {
        return null;
    }

    const insertMergeTag = (tag: string) => {
        editor.chain().focus().insertContent(` ${tag} `).run();
    };

    const systemTags = [
        { tag: '{{system.current_date}}', label: 'Current Date (e.g. August 20, 2026)', category: 'System' },
        { tag: '{{system.current_date_formatted}}', label: 'Short Date (e.g. 20 Aug, 2026)', category: 'System' },
        { tag: '{{system.current_year}}', label: 'Current Year (e.g. 2026)', category: 'System' },
        { tag: '{{system.company_name}}', label: 'Company Name', category: 'System' },
    ];

    const employeeTags = [
        { tag: '{{employee.name}}', label: 'Full Name' },
        { tag: '{{employee.email}}', label: 'Email Address' },
        { tag: '{{employee.designation}}', label: 'Designation / Job Title' },
        { tag: '{{employee.department}}', label: 'Department' },
        { tag: '{{employee.joining_date}}', label: 'Joining Date' },
        { tag: '{{employee.salary}}', label: 'Salary / Remuneration' },
        { tag: '{{employee.phone}}', label: 'Contact Phone' },
        { tag: '{{employee.code}}', label: 'Employee Code / ID' },
    ];

    return (
        <div className="relative flex flex-col rounded-2xl border border-neutral-200 bg-neutral-100/70 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/80">
            {/* Sticky Floating Formatting Toolbar */}
            <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-1 border-b border-neutral-200 bg-white/95 px-4 py-2.5 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95">
                <div className="flex flex-wrap items-center gap-0.5 sm:gap-1">
                    {/* Headings */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`rounded p-1.5 text-xs font-bold transition ${
                            editor.isActive('heading', { level: 1 })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Heading 1"
                    >
                        <Heading1 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`rounded p-1.5 text-xs font-bold transition ${
                            editor.isActive('heading', { level: 2 })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Heading 2"
                    >
                        <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`rounded p-1.5 text-xs font-bold transition ${
                            editor.isActive('heading', { level: 3 })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Heading 3"
                    >
                        <Heading3 className="h-4 w-4" />
                    </button>

                    <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-800" />

                    {/* Inline Formats */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('bold')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Bold"
                    >
                        <Bold className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('italic')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Italic"
                    >
                        <Italic className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('underline')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Underline"
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('strike')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Strikethrough"
                    >
                        <Strikethrough className="h-4 w-4" />
                    </button>

                    <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-800" />

                    {/* Alignments */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive({ textAlign: 'left' })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Align Left"
                    >
                        <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive({ textAlign: 'center' })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Align Center"
                    >
                        <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive({ textAlign: 'right' })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Align Right"
                    >
                        <AlignRight className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive({ textAlign: 'justify' })
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Justify"
                    >
                        <AlignJustify className="h-4 w-4" />
                    </button>

                    <div className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-800" />

                    {/* Lists & Blocks */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('bulletList')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Bullet List"
                    >
                        <List className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('orderedList')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`rounded p-1.5 transition ${
                            editor.isActive('blockquote')
                                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        }`}
                        title="Blockquote"
                    >
                        <Quote className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition"
                        title="Divider Line"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                </div>

                {/* Undo / Redo & Sidebar Toggle */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        title="Undo"
                    >
                        <Undo className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="rounded p-1.5 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        title="Redo"
                    >
                        <Redo className="h-4 w-4" />
                    </button>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`ml-2 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                            sidebarOpen
                                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
                        }`}
                    >
                        <Tag className="h-3.5 w-3.5" />
                        <span>Merge Tags</span>
                        {sidebarOpen ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Editor Body with A4 Canvas and Right Sidebar */}
            <div className="flex grow overflow-hidden">
                {/* Main A4 Document Canvas Viewport */}
                <div className="flex grow justify-center overflow-y-auto p-4 md:p-8">
                    {/* Google Docs-Style Centered A4 Page Simulation */}
                    <div className="w-full max-w-[210mm] min-h-[297mm] rounded-sm bg-white p-[20mm] text-[#1a1a1a] shadow-2xl ring-1 ring-black/5 dark:bg-white dark:text-[#1a1a1a]">
                        <EditorContent
                            editor={editor}
                            className="prose prose-neutral max-w-none text-sm leading-relaxed focus:outline-none [&_.is-editor-empty]:before:text-neutral-400 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-neutral-900 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-neutral-900 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:border [&_th]:border-neutral-300 [&_th]:bg-neutral-100 [&_th]:p-2 [&_td]:border [&_td]:border-neutral-300 [&_td]:p-2"
                        />
                    </div>
                </div>

                {/* Collapsible Right Sidebar: Variable Insertion Drawer */}
                {sidebarOpen && (
                    <div className="w-80 shrink-0 border-l border-neutral-200 bg-white p-4 overflow-y-auto dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4">
                            <h4 className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-white text-sm">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                Variable Inserter
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Click any tag below to insert it at your current cursor position.
                            </p>
                        </div>

                        {/* Employee System Tags */}
                        <div className="mb-5">
                            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                <User className="h-3.5 w-3.5 text-indigo-500" />
                                Employee Variables
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {employeeTags.map((item) => (
                                    <button
                                        key={item.tag}
                                        type="button"
                                        onClick={() => insertMergeTag(item.tag)}
                                        className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-left text-xs transition hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40"
                                    >
                                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                            {item.label}
                                        </span>
                                        <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-indigo-600 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white dark:bg-neutral-700 dark:text-indigo-300">
                                            {item.tag}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* System Tags */}
                        <div className="mb-5">
                            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                                System & Date
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {systemTags.map((item) => (
                                    <button
                                        key={item.tag}
                                        type="button"
                                        onClick={() => insertMergeTag(item.tag)}
                                        className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-left text-xs transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/40"
                                    >
                                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                            {item.label}
                                        </span>
                                        <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-emerald-600 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white dark:bg-neutral-700 dark:text-emerald-300">
                                            {item.tag}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Template Variables */}
                        <div>
                            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                                <Tag className="h-3.5 w-3.5 text-purple-500" />
                                Custom Fields ({customVariables.length})
                            </div>
                            {customVariables.length === 0 ? (
                                <p className="rounded-md bg-neutral-50 p-2 text-center text-[11px] text-neutral-400 dark:bg-neutral-800/40 dark:text-neutral-500">
                                    No custom fields yet. Add them in the schema section below.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    {customVariables.map((variable) => (
                                        <button
                                            key={variable.key}
                                            type="button"
                                            onClick={() => insertMergeTag(`{{custom.${variable.key}}}`)}
                                            className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-left text-xs transition hover:border-purple-300 hover:bg-purple-50/50 dark:border-neutral-800 dark:bg-neutral-800/50 dark:hover:border-purple-900 dark:hover:bg-purple-950/40"
                                        >
                                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                                                {variable.label}
                                            </span>
                                            <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-purple-600 shadow-2xs group-hover:bg-purple-600 group-hover:text-white dark:bg-neutral-700 dark:text-purple-300">
                                                {`{{custom.${variable.key}}}`}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default DocumentEditor;
