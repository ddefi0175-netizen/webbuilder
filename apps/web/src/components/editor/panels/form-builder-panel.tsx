'use client';

import { useState } from 'react';
import {
    FileText,
    Plus,
    GripVertical,
    Trash2,
    Settings,
    Mail,
    Copy,
    Eye,
    Send,
    ToggleLeft,
    Type,
    Hash,
    Calendar,
    CheckSquare,
    List,
    Upload,
    Phone,
    AtSign,
    AlignLeft,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type FieldType = 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';

interface FormField {
    id: string;
    type: FieldType;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

const fieldTypes: { type: FieldType; icon: typeof Type; label: string }[] = [
    { type: 'text', icon: Type, label: 'Text' },
    { type: 'email', icon: AtSign, label: 'Email' },
    { type: 'phone', icon: Phone, label: 'Phone' },
    { type: 'number', icon: Hash, label: 'Number' },
    { type: 'textarea', icon: AlignLeft, label: 'Text Area' },
    { type: 'select', icon: List, label: 'Dropdown' },
    { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
    { type: 'radio', icon: ToggleLeft, label: 'Radio' },
    { type: 'date', icon: Calendar, label: 'Date' },
    { type: 'file', icon: Upload, label: 'File Upload' },
];

export function FormBuilderPanel() {
    const [activeTab, setActiveTab] = useState<'fields' | 'settings' | 'submissions'>('fields');
    const [fields, setFields] = useState<FormField[]>([
        { id: '1', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
        { id: '2', type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
        { id: '3', type: 'textarea', label: 'Message', placeholder: 'Your message...', required: false },
    ]);
    const [selectedField, setSelectedField] = useState<string | null>(null);
    const [formName, setFormName] = useState('Contact Form');

    const addField = (type: FieldType) => {
        const fieldInfo = fieldTypes.find(f => f.type === type);
        const newField: FormField = {
            id: Date.now().toString(),
            type,
            label: fieldInfo?.label || 'New Field',
            placeholder: '',
            required: false,
            options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
        };
        setFields([...fields, newField]);
        setSelectedField(newField.id);
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedField === id) setSelectedField(null);
    };

    const selectedFieldData = fields.find(f => f.id === selectedField);

    const tabs = [
        { id: 'fields', label: 'Fields', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'submissions', label: 'Submissions', icon: Mail },
    ] as const;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Form Builder</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Create and manage forms
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors',
                            activeTab === tab.id
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <tab.icon className="h-3.5 w-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {activeTab === 'fields' && (
                        <>
                            {/* Form Name */}
                            <div className="space-y-1">
                                <Label className="text-xs">Form Name</Label>
                                <Input
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    className="text-sm"
                                />
                            </div>

                            {/* Field List */}
                            <div className="space-y-2">
                                <Label className="text-xs">Form Fields</Label>
                                {fields.map((field) => {
                                    const fieldInfo = fieldTypes.find(f => f.type === field.type);
                                    const Icon = fieldInfo?.icon || Type;
                                    return (
                                        <div
                                            key={field.id}
                                            className={cn(
                                                'flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors',
                                                selectedField === field.id && 'border-primary bg-primary/5'
                                            )}
                                            onClick={() => setSelectedField(field.id)}
                                        >
                                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{field.label}</p>
                                                <p className="text-xs text-muted-foreground">{fieldInfo?.label}</p>
                                            </div>
                                            {field.required && (
                                                <Star className="h-3 w-3 text-red-500 fill-red-500" />
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 w-7 p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteField(field.id);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Add Field */}
                            <div className="space-y-2">
                                <Label className="text-xs">Add Field</Label>
                                <div className="grid grid-cols-5 gap-1">
                                    {fieldTypes.map((field) => (
                                        <button
                                            key={field.type}
                                            onClick={() => addField(field.type)}
                                            className="flex flex-col items-center gap-1 p-2 border rounded-lg hover:bg-muted transition-colors"
                                            title={field.label}
                                        >
                                            <field.icon className="h-4 w-4" />
                                            <span className="text-[9px] leading-none">{field.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Field Editor */}
                            {selectedFieldData && (
                                <div className="pt-4 border-t space-y-3">
                                    <Label className="text-xs font-medium">Edit Field</Label>

                                    <div className="space-y-1">
                                        <Label className="text-xs">Label</Label>
                                        <Input
                                            value={selectedFieldData.label}
                                            onChange={(e) => updateField(selectedField!, { label: e.target.value })}
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs">Placeholder</Label>
                                        <Input
                                            value={selectedFieldData.placeholder || ''}
                                            onChange={(e) => updateField(selectedField!, { placeholder: e.target.value })}
                                            className="text-sm"
                                        />
                                    </div>

                                    {(selectedFieldData.type === 'select' || selectedFieldData.type === 'radio') && (
                                        <div className="space-y-1">
                                            <Label className="text-xs">Options (one per line)</Label>
                                            <Textarea
                                                value={selectedFieldData.options?.join('\n') || ''}
                                                onChange={(e) => updateField(selectedField!, {
                                                    options: e.target.value.split('\n').filter(Boolean)
                                                })}
                                                className="text-sm min-h-[80px]"
                                            />
                                        </div>
                                    )}

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedFieldData.required}
                                            onChange={(e) => updateField(selectedField!, { required: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Required field</span>
                                    </label>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Preview
                                </Button>
                                <Button size="sm" className="flex-1">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add to Page
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'settings' && (
                        <>
                            <div className="space-y-3">
                                <Label className="text-xs">Form Settings</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Submit Button Text</Label>
                                    <Input defaultValue="Send Message" className="text-sm" />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Success Message</Label>
                                    <Textarea
                                        defaultValue="Thank you! Your submission has been received."
                                        className="text-sm min-h-[60px]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs">Redirect URL (optional)</Label>
                                    <Input placeholder="https://..." className="text-sm" />
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">Email Notifications</Label>

                                <div className="space-y-1">
                                    <Label className="text-xs">Send submissions to</Label>
                                    <Input placeholder="you@example.com" className="text-sm" />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Send confirmation email to submitter</span>
                                </label>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">Spam Protection</Label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Enable reCAPTCHA</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded" defaultChecked />
                                    <span className="text-sm">Honeypot protection</span>
                                </label>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">Integrations</Label>

                                {['Mailchimp', 'HubSpot', 'Zapier', 'Google Sheets'].map((integration) => (
                                    <div key={integration} className="flex items-center justify-between p-2 border rounded-lg">
                                        <span className="text-sm">{integration}</span>
                                        <Button variant="outline" size="sm" className="h-7">Connect</Button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === 'submissions' && (
                        <>
                            <div className="flex items-center justify-between mb-3">
                                <Label className="text-xs">Recent Submissions</Label>
                                <Button variant="outline" size="sm" className="h-7">
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                    Export
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {[
                                    { name: 'John Smith', email: 'john@example.com', date: '2 hours ago' },
                                    { name: 'Sarah Wilson', email: 'sarah@example.com', date: '5 hours ago' },
                                    { name: 'Mike Johnson', email: 'mike@example.com', date: '1 day ago' },
                                ].map((submission, index) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">{submission.name}</span>
                                            <span className="text-xs text-muted-foreground">{submission.date}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{submission.email}</span>
                                        <div className="flex gap-2 mt-2">
                                            <Button variant="ghost" size="sm" className="h-6 text-xs">View</Button>
                                            <Button variant="ghost" size="sm" className="h-6 text-xs text-red-500">Delete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center text-xs text-muted-foreground pt-4">
                                Showing 3 of 24 submissions
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
