import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility function', () => {
    it('merges class names correctly', () => {
        const result = cn('class1', 'class2');
        expect(result).toBe('class1 class2');
    });

    it('handles conditional classes', () => {
        const result = cn('base', true && 'included', false && 'excluded');
        expect(result).toBe('base included');
    });

    it('handles undefined and null values', () => {
        const result = cn('base', undefined, null, 'valid');
        expect(result).toBe('base valid');
    });

    it('handles empty strings', () => {
        const result = cn('base', '', 'valid');
        expect(result).toBe('base valid');
    });

    it('handles object syntax', () => {
        const result = cn('base', { active: true, disabled: false });
        expect(result).toBe('base active');
    });

    it('handles array syntax', () => {
        const result = cn(['class1', 'class2']);
        expect(result).toBe('class1 class2');
    });

    it('merges Tailwind classes correctly (last wins)', () => {
        const result = cn('p-4', 'p-8');
        expect(result).toBe('p-8');
    });

    it('handles Tailwind color conflicts', () => {
        const result = cn('bg-red-500', 'bg-blue-500');
        expect(result).toBe('bg-blue-500');
    });

    it('preserves non-conflicting classes', () => {
        const result = cn('p-4 m-2', 'bg-blue-500');
        expect(result).toBe('p-4 m-2 bg-blue-500');
    });

    it('handles complex nested structures', () => {
        const result = cn(
            'base',
            ['array-class'],
            { 'object-class': true },
            undefined,
            'final'
        );
        expect(result).toContain('base');
        expect(result).toContain('array-class');
        expect(result).toContain('object-class');
        expect(result).toContain('final');
    });
});
