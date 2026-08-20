import React, { useState } from 'react';
import { Plus, Trash2, Tag, Check, Sliders } from 'lucide-react';

export interface CustomVariable {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'select';
    default_value?: string;
    options?: string[];
    required?: boolean;
}

interface CustomVariableBuilderProps {
    variables: CustomVariable[];
    onChange: (variables: CustomVariable[]) => void;
    onInsertVariable?: (key: string) => void;
}

export function CustomVariableBuilder({
    variables,
    onChange,
    onInsertVariable,
}: CustomVariableBuilderProps) {
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [newType, setNewType] = useState<'text' | 'textarea' | 'number' | 'date' | 'select'>('text');
    const [newDefaultValue, setNewDefaultValue] = useState('');
    const [newOptionsText, setNewOptionsText] = useState('');
    const [newRequired, setNewRequired] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const handleAddVariable = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKey.trim() || !newLabel.trim()) return;

        const formattedKey = newKey
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9_]/g, '_');

        if (variables.some((v) => v.key === formattedKey)) {
            alert('A variable with this key already exists.');
            return;
        }

        const options =
            newType === 'select'
                ? newOptionsText
                      .split(',')
                      .map((o) => o.trim())
                      .filter(Boolean)
                : undefined;

        const newVar: CustomVariable = {
            key: formattedKey,
            label: newLabel.trim(),
            type: newType,
            default_value: newDefaultValue.trim() || undefined,
            options,
            required: newRequired,
        };

        onChange([...variables, newVar]);

        // Reset form
        setNewKey('');
        setNewLabel('');
        setNewType('text');
        setNewDefaultValue('');
        setNewOptionsText('');
        setNewRequired(false);
        setIsAdding(false);
    };

    const handleRemoveVariable = (indexToRemove: number) => {
        onChange(variables.filter((_, i) => i !== indexToRemove));
    };

    const handleCopy = (key: string) => {
        const tag = `{{custom.${key}}}`;
        navigator.clipboard.writeText(tag);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);

        if (onInsertVariable) {
            onInsertVariable(tag);
        }
    };

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <h3 className="font-semibold text-neutral-900 dark:text-white">Custom Variables Schema</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Define dynamic variables specific to this template.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80"
                >
                    <Plus className="h-3.5 w-3.5" />
                    {isAdding ? 'Cancel' : 'Add Variable'}
                </button>
            </div>

            {/* List of current custom variables */}
            {variables.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-200 p-6 text-center text-xs text-neutral-400 dark:border-neutral-800 dark:text-neutral-500">
                    No custom variables defined yet. Click &quot;Add Variable&quot; to inject form inputs into the letter.
                </div>
            ) : (
                <div className="space-y-2">
                    {variables.map((variable, idx) => (
                        <div
                            key={variable.key}
                            className="group flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/70 p-3 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-800/40 dark:hover:border-neutral-700"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                                    {variable.type[0].toUpperCase()}
                                </span>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-neutral-900 dark:text-white">
                                            {variable.label}
                                        </span>
                                        <span className="rounded bg-neutral-200/80 px-1.5 py-0.5 text-[10px] font-mono text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                                            {`{{custom.${variable.key}}}`}
                                        </span>
                                        {variable.required && (
                                            <span className="text-[10px] font-medium text-red-500">Required</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Type: <span className="capitalize">{variable.type}</span>
                                        {variable.default_value && ` | Default: "${variable.default_value}"`}
                                        {variable.options && ` | Options: [${variable.options.join(', ')}]`}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleCopy(variable.key)}
                                    className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm border border-neutral-200 transition hover:bg-neutral-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                    title="Click to insert tag"
                                >
                                    {copiedKey === variable.key ? (
                                        <>
                                            <Check className="h-3 w-3 text-emerald-500" />
                                            <span className="text-emerald-600 dark:text-emerald-400">Inserted!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Tag className="h-3 w-3 text-neutral-400" />
                                            <span>Insert</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVariable(idx)}
                                    className="rounded p-1 text-neutral-400 hover:text-red-500 transition-colors"
                                    title="Delete variable"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add New Variable Form */}
            {isAdding && (
                <form
                    onSubmit={handleAddVariable}
                    className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20"
                >
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                        New Custom Field Definition
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Variable Label *
                            </label>
                            <input
                                type="text"
                                value={newLabel}
                                onChange={(e) => {
                                    setNewLabel(e.target.value);
                                    if (!newKey) {
                                        setNewKey(
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9]/g, '_')
                                                .replace(/_+/g, '_')
                                        );
                                    }
                                }}
                                placeholder="e.g. Probation Period"
                                required
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Variable Key (Tag name) *
                            </label>
                            <div className="relative mt-1">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-neutral-400">
                                    custom.
                                </span>
                                <input
                                    type="text"
                                    value={newKey}
                                    onChange={(e) =>
                                        setNewKey(
                                            e.target.value
                                                .toLowerCase()
                                                .replace(/[^a-z0-9_]/g, '_')
                                        )
                                    }
                                    placeholder="probation_period"
                                    required
                                    className="block w-full rounded-md border border-neutral-300 bg-white pl-14 pr-3 py-1.5 text-xs font-mono text-neutral-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Input Type
                            </label>
                            <select
                                value={newType}
                                onChange={(e) => setNewType(e.target.value as any)}
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            >
                                <option value="text">Single Line Text</option>
                                <option value="textarea">Multi-line Textarea</option>
                                <option value="number">Number</option>
                                <option value="date">Date Picker</option>
                                <option value="select">Dropdown Select</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                Default Value (Optional)
                            </label>
                            <input
                                type="text"
                                value={newDefaultValue}
                                onChange={(e) => setNewDefaultValue(e.target.value)}
                                placeholder="e.g. 3 Months"
                                className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            />
                        </div>

                        {newType === 'select' && (
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                    Dropdown Options (Comma separated) *
                                </label>
                                <input
                                    type="text"
                                    value={newOptionsText}
                                    onChange={(e) => setNewOptionsText(e.target.value)}
                                    placeholder="Option A, Option B, Option C"
                                    required
                                    className="mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2 sm:col-span-2 mt-1">
                            <input
                                type="checkbox"
                                id="newVarRequired"
                                checked={newRequired}
                                onChange={(e) => setNewRequired(e.target.checked)}
                                className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:border-neutral-700 dark:bg-neutral-800"
                            />
                            <label htmlFor="newVarRequired" className="text-xs text-neutral-700 dark:text-neutral-300">
                                This field is required when generating letters
                            </label>
                        </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsAdding(false)}
                            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 shadow-sm"
                        >
                            Save Variable
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
export default CustomVariableBuilder;
