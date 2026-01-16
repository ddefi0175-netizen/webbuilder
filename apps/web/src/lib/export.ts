import { Component, ComponentStyles } from '@/types';
import { generateId } from './utils';

export interface ExportOptions {
    includeStyles: boolean;
    format: 'html' | 'react' | 'vue';
    minify: boolean;
}

function stylesToCSS(styles: ComponentStyles, selector: string): string {
    const cssProperties: string[] = [];

    const addProperty = (prop: string, value: string | number | undefined) => {
        if (value !== undefined && value !== '') {
            cssProperties.push(`  ${prop}: ${value};`);
        }
    };

    // Layout
    addProperty('display', styles.display);
    addProperty('flex-direction', styles.flexDirection);
    addProperty('justify-content', styles.justifyContent);
    addProperty('align-items', styles.alignItems);
    addProperty('flex-wrap', styles.flexWrap);
    addProperty('gap', styles.gap);
    addProperty('grid-template-columns', styles.gridTemplateColumns);
    addProperty('grid-template-rows', styles.gridTemplateRows);

    // Spacing
    addProperty('padding', styles.padding);
    addProperty('padding-top', styles.paddingTop);
    addProperty('padding-right', styles.paddingRight);
    addProperty('padding-bottom', styles.paddingBottom);
    addProperty('padding-left', styles.paddingLeft);
    addProperty('margin', styles.margin);
    addProperty('margin-top', styles.marginTop);
    addProperty('margin-right', styles.marginRight);
    addProperty('margin-bottom', styles.marginBottom);
    addProperty('margin-left', styles.marginLeft);

    // Size
    addProperty('width', styles.width);
    addProperty('height', styles.height);
    addProperty('min-width', styles.minWidth);
    addProperty('max-width', styles.maxWidth);
    addProperty('min-height', styles.minHeight);
    addProperty('max-height', styles.maxHeight);

    // Typography
    addProperty('font-size', styles.fontSize);
    addProperty('font-weight', styles.fontWeight);
    addProperty('line-height', styles.lineHeight);
    addProperty('letter-spacing', styles.letterSpacing);
    addProperty('text-align', styles.textAlign);
    addProperty('text-decoration', styles.textDecoration);
    addProperty('text-transform', styles.textTransform);

    // Colors
    addProperty('color', styles.color);
    addProperty('background-color', styles.backgroundColor);
    addProperty('background-image', styles.backgroundImage);
    addProperty('background-size', styles.backgroundSize);
    addProperty('background-position', styles.backgroundPosition);

    // Border
    addProperty('border', styles.border);
    addProperty('border-radius', styles.borderRadius);
    addProperty('border-width', styles.borderWidth);
    addProperty('border-color', styles.borderColor);
    addProperty('border-style', styles.borderStyle);

    // Effects
    addProperty('box-shadow', styles.boxShadow);
    addProperty('opacity', styles.opacity);

    // Position
    addProperty('position', styles.position);
    addProperty('top', styles.top);
    addProperty('right', styles.right);
    addProperty('bottom', styles.bottom);
    addProperty('left', styles.left);
    addProperty('z-index', styles.zIndex?.toString());

    // Transform
    addProperty('transform', styles.transform);
    addProperty('transition', styles.transition);

    // Other
    addProperty('overflow', styles.overflow);
    addProperty('cursor', styles.cursor);

    if (cssProperties.length === 0) return '';

    return `${selector} {\n${cssProperties.join('\n')}\n}`;
}

function componentToHTML(
    component: Component,
    components: Map<string, Component>,
    depth = 0
): string {
    const indent = '  '.repeat(depth);
    const className = `wb-${component.id}`;

    const getChildrenHTML = () => {
        return component.children
            .map((childId) => {
                const child = components.get(childId);
                return child ? componentToHTML(child, components, depth + 1) : '';
            })
            .filter(Boolean)
            .join('\n');
    };

    switch (component.type) {
        case 'container':
            return `${indent}<div class="${className}">\n${getChildrenHTML()}\n${indent}</div>`;

        case 'text':
            return `${indent}<p class="${className}">${component.props.content || ''}</p>`;

        case 'heading':
            const tag = component.props.level || 'h1';
            return `${indent}<${tag} class="${className}">${component.props.content || ''}</${tag}>`;

        case 'button':
            return `${indent}<button class="${className}">${component.props.text || 'Button'}</button>`;

        case 'image':
            return `${indent}<img class="${className}" src="${component.props.src || ''}" alt="${component.props.alt || ''}" />`;

        case 'link':
            return `${indent}<a class="${className}" href="${component.props.href || '#'}">${component.props.text || 'Link'}</a>`;

        case 'input':
            return `${indent}<input class="${className}" type="${component.props.type || 'text'}" placeholder="${component.props.placeholder || ''}" />`;

        case 'section':
            return `${indent}<section class="${className}">\n${getChildrenHTML()}\n${indent}</section>`;

        case 'nav':
            return `${indent}<nav class="${className}">\n${getChildrenHTML()}\n${indent}</nav>`;

        case 'footer':
            return `${indent}<footer class="${className}">\n${getChildrenHTML()}\n${indent}</footer>`;

        case 'header':
            return `${indent}<header class="${className}">\n${getChildrenHTML()}\n${indent}</header>`;

        case 'form':
            return `${indent}<form class="${className}">\n${getChildrenHTML()}\n${indent}</form>`;

        case 'list':
            const listTag = component.props.ordered ? 'ol' : 'ul';
            return `${indent}<${listTag} class="${className}">\n${getChildrenHTML()}\n${indent}</${listTag}>`;

        case 'list-item':
            return `${indent}<li class="${className}">${component.props.content || ''}</li>`;

        case 'icon':
            return `${indent}<span class="${className} icon icon-${component.props.name || 'default'}"></span>`;

        case 'video':
            return `${indent}<video class="${className}" src="${component.props.src || ''}" ${component.props.controls ? 'controls' : ''}></video>`;

        case 'divider':
            return `${indent}<hr class="${className}" />`;

        case 'spacer':
            return `${indent}<div class="${className}"></div>`;

        case 'card':
            return `${indent}<article class="${className}">\n${getChildrenHTML()}\n${indent}</article>`;

        default:
            return `${indent}<div class="${className}">\n${getChildrenHTML()}\n${indent}</div>`;
    }
}

function componentToReact(
    component: Component,
    components: Map<string, Component>,
    depth = 0
): string {
    const indent = '  '.repeat(depth);
    const className = `wb-${component.id}`;

    const getChildrenJSX = () => {
        return component.children
            .map((childId) => {
                const child = components.get(childId);
                return child ? componentToReact(child, components, depth + 1) : '';
            })
            .filter(Boolean)
            .join('\n');
    };

    switch (component.type) {
        case 'container':
            return `${indent}<div className="${className}">\n${getChildrenJSX()}\n${indent}</div>`;

        case 'text':
            return `${indent}<p className="${className}">${component.props.content || ''}</p>`;

        case 'heading':
            const tag = component.props.level || 'h1';
            const Tag = tag.charAt(0).toUpperCase() + tag.slice(1);
            return `${indent}<${tag} className="${className}">${component.props.content || ''}</${tag}>`;

        case 'button':
            return `${indent}<button className="${className}">${component.props.text || 'Button'}</button>`;

        case 'image':
            return `${indent}<img className="${className}" src="${component.props.src || ''}" alt="${component.props.alt || ''}" />`;

        case 'link':
            return `${indent}<a className="${className}" href="${component.props.href || '#'}">${component.props.text || 'Link'}</a>`;

        case 'input':
            return `${indent}<input className="${className}" type="${component.props.type || 'text'}" placeholder="${component.props.placeholder || ''}" />`;

        case 'section':
            return `${indent}<section className="${className}">\n${getChildrenJSX()}\n${indent}</section>`;

        default:
            return `${indent}<div className="${className}">\n${getChildrenJSX()}\n${indent}</div>`;
    }
}

export function exportToHTML(
    components: Map<string, Component>,
    options: ExportOptions
): string {
    const rootComponent = components.get('root');
    if (!rootComponent) return '';

    // Generate HTML
    const html = componentToHTML(rootComponent, components, 2);

    // Generate CSS
    let css = '';
    if (options.includeStyles) {
        const cssRules: string[] = [];
        components.forEach((component) => {
            const rule = stylesToCSS(component.styles, `.wb-${component.id}`);
            if (rule) cssRules.push(rule);
        });
        css = cssRules.join('\n\n');
    }

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
${css.split('\n').map(line => '    ' + line).join('\n')}
  </style>
</head>
<body>
${html}
</body>
</html>`;

    return options.minify ? minifyHTML(fullHTML) : fullHTML;
}

export function exportToReact(
    components: Map<string, Component>,
    options: ExportOptions
): string {
    const rootComponent = components.get('root');
    if (!rootComponent) return '';

    const jsx = componentToReact(rootComponent, components, 2);

    // Generate CSS
    let css = '';
    if (options.includeStyles) {
        const cssRules: string[] = [];
        components.forEach((component) => {
            const rule = stylesToCSS(component.styles, `.wb-${component.id}`);
            if (rule) cssRules.push(rule);
        });
        css = cssRules.join('\n\n');
    }

    return `import React from 'react';
import './styles.css';

export function ExportedPage() {
  return (
${jsx}
  );
}

export default ExportedPage;

/* styles.css */
/*
${css}
*/
`;
}

function componentToVue(
    component: Component,
    components: Map<string, Component>,
    depth = 0
): string {
    const indent = '  '.repeat(depth);
    const className = `wb-${component.id}`;

    const getChildrenTemplate = () => {
        return component.children
            .map((childId) => {
                const child = components.get(childId);
                return child ? componentToVue(child, components, depth + 1) : '';
            })
            .filter(Boolean)
            .join('\n');
    };

    switch (component.type) {
        case 'container':
            return `${indent}<div class="${className}">\n${getChildrenTemplate()}\n${indent}</div>`;

        case 'text':
            const textContent = component.props.content || '';
            return `${indent}<p class="${className}">${textContent}</p>`;

        case 'heading':
            const tag = component.props.level || 'h1';
            const headingContent = component.props.content || '';
            return `${indent}<${tag} class="${className}">${headingContent}</${tag}>`;

        case 'button':
            const buttonText = component.props.text || 'Button';
            return `${indent}<button class="${className}">${buttonText}</button>`;

        case 'image':
            return `${indent}<img class="${className}" src="${component.props.src || ''}" alt="${component.props.alt || ''}" />`;

        case 'link':
            const linkText = component.props.text || 'Link';
            return `${indent}<a class="${className}" href="${component.props.href || '#'}">${linkText}</a>`;

        case 'input':
            return `${indent}<input class="${className}" type="${component.props.type || 'text'}" placeholder="${component.props.placeholder || ''}" />`;

        case 'section':
            return `${indent}<section class="${className}">\n${getChildrenTemplate()}\n${indent}</section>`;

        case 'nav':
            return `${indent}<nav class="${className}">\n${getChildrenTemplate()}\n${indent}</nav>`;

        case 'footer':
            return `${indent}<footer class="${className}">\n${getChildrenTemplate()}\n${indent}</footer>`;

        case 'header':
            return `${indent}<header class="${className}">\n${getChildrenTemplate()}\n${indent}</header>`;

        case 'form':
            return `${indent}<form class="${className}">\n${getChildrenTemplate()}\n${indent}</form>`;

        case 'list':
            const listTag = component.props.ordered ? 'ol' : 'ul';
            return `${indent}<${listTag} class="${className}">\n${getChildrenTemplate()}\n${indent}</${listTag}>`;

        case 'list-item':
            const listItemContent = component.props.content || '';
            return `${indent}<li class="${className}">${listItemContent}</li>`;

        case 'icon':
            return `${indent}<span class="${className} icon icon-${component.props.name || 'default'}"></span>`;

        case 'video':
            return `${indent}<video class="${className}" src="${component.props.src || ''}" ${component.props.controls ? 'controls' : ''}></video>`;

        case 'divider':
            return `${indent}<hr class="${className}" />`;

        case 'spacer':
            return `${indent}<div class="${className}"></div>`;

        case 'card':
            return `${indent}<article class="${className}">\n${getChildrenTemplate()}\n${indent}</article>`;

        default:
            return `${indent}<div class="${className}">\n${getChildrenTemplate()}\n${indent}</div>`;
    }
}

export function exportToVue(
    components: Map<string, Component>,
    options: ExportOptions
): string {
    const rootComponent = components.get('root');
    if (!rootComponent) return '';

    const template = componentToVue(rootComponent, components, 2);

    // Generate CSS
    let css = '';
    if (options.includeStyles) {
        const cssRules: string[] = [];
        components.forEach((component) => {
            const rule = stylesToCSS(component.styles, `.wb-${component.id}`);
            if (rule) cssRules.push(rule);
        });
        css = cssRules.join('\n\n');
    }

    return `<template>
${template}
</template>

<script setup>
// Component logic here
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

${css}
</style>
`;
}

function minifyHTML(html: string): string {
    return html
        .replace(/\n\s*/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

export function exportProject(
    components: Map<string, Component>,
    options: ExportOptions
): string {
    switch (options.format) {
        case 'html':
            return exportToHTML(components, options);
        case 'react':
            return exportToReact(components, options);
        case 'vue':
            return exportToVue(components, options);
        default:
            return exportToHTML(components, options);
    }
}
