'use client';

import { useState } from 'react';
import {
    Languages,
    Plus,
    Globe,
    Check,
    ChevronRight,
    Edit,
    Trash2,
    Copy,
    Flag,
    Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    isDefault: boolean;
    completionRate: number;
}

const availableLanguages: Omit<Language, 'isDefault' | 'completionRate'>[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
];

export function MultiLanguagePanel() {
    const [activeLanguages, setActiveLanguages] = useState<Language[]>([
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isDefault: true, completionRate: 100 },
        { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isDefault: false, completionRate: 75 },
    ]);
    const [showAddLanguage, setShowAddLanguage] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    const unaddedLanguages = availableLanguages.filter(
        lang => !activeLanguages.some(al => al.code === lang.code)
    );

    const handleAddLanguage = (lang: typeof availableLanguages[0]) => {
        setActiveLanguages([...activeLanguages, {
            ...lang,
            isDefault: false,
            completionRate: 0
        }]);
        setShowAddLanguage(false);
    };

    const handleRemoveLanguage = (code: string) => {
        if (activeLanguages.find(l => l.code === code)?.isDefault) return;
        setActiveLanguages(activeLanguages.filter(l => l.code !== code));
    };

    const handleSetDefault = (code: string) => {
        setActiveLanguages(activeLanguages.map(l => ({
            ...l,
            isDefault: l.code === code
        })));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-2">
                    <Languages className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Multi-Language</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                    Manage translations for your website
                </p>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {!showAddLanguage ? (
                        <>
                            {/* Active Languages */}
                            <div className="space-y-2">
                                <Label className="text-xs">Active Languages</Label>
                                {activeLanguages.map((lang) => (
                                    <div
                                        key={lang.code}
                                        className={cn(
                                            'p-3 border rounded-lg cursor-pointer transition-colors',
                                            selectedLanguage === lang.code && 'border-primary bg-primary/5'
                                        )}
                                        onClick={() => setSelectedLanguage(lang.code)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{lang.flag}</span>
                                                <div>
                                                    <span className="font-medium text-sm">{lang.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-1">
                                                        ({lang.nativeName})
                                                    </span>
                                                </div>
                                                {lang.isDefault && (
                                                    <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        'h-full rounded-full',
                                                        lang.completionRate === 100 ? 'bg-green-500' :
                                                            lang.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                    )}
                                                    style={{ width: `${lang.completionRate}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {lang.completionRate}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setShowAddLanguage(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Language
                            </Button>

                            {/* Translation Editor */}
                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs">Edit Translations</Label>
                                    <span className="text-xs text-muted-foreground">
                                        {activeLanguages.find(l => l.code === selectedLanguage)?.name}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {[
                                        { key: 'nav.home', en: 'Home', translation: selectedLanguage === 'es' ? 'Inicio' : 'Home' },
                                        { key: 'nav.about', en: 'About', translation: selectedLanguage === 'es' ? 'Acerca de' : 'About' },
                                        { key: 'nav.contact', en: 'Contact', translation: selectedLanguage === 'es' ? 'Contacto' : 'Contact' },
                                        { key: 'hero.title', en: 'Welcome', translation: selectedLanguage === 'es' ? 'Bienvenido' : 'Welcome' },
                                        { key: 'cta.signup', en: 'Sign Up', translation: selectedLanguage === 'es' ? 'Registrarse' : 'Sign Up' },
                                    ].map((item) => (
                                        <div key={item.key} className="p-2 bg-muted rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <code className="text-xs text-muted-foreground">{item.key}</code>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="text-xs text-muted-foreground mb-1">
                                                EN: {item.en}
                                            </div>
                                            <Input
                                                defaultValue={item.translation}
                                                className="h-8 text-sm"
                                                placeholder="Enter translation..."
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Language Settings */}
                            <div className="pt-4 border-t space-y-3">
                                <Label className="text-xs">Language Settings</Label>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Auto-detect visitor language</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" defaultChecked />
                                        <span className="text-sm">Show language switcher</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded" />
                                        <span className="text-sm">Use browser language as default</span>
                                    </label>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Export Translations
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Globe className="h-4 w-4 mr-2" />
                                    Auto-translate with AI
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm font-medium">Add Language</Label>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAddLanguage(false)}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <Input
                                placeholder="Search languages..."
                                className="text-sm mb-3"
                            />

                            <div className="space-y-1">
                                {unaddedLanguages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                                        onClick={() => handleAddLanguage(lang)}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <div className="text-left">
                                            <span className="font-medium text-sm block">{lang.name}</span>
                                            <span className="text-xs text-muted-foreground">{lang.nativeName}</span>
                                        </div>
                                        <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
