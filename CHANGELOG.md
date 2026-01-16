# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-16

### Added
- First stable public release
- Production-ready build verified
- Security scan completed - no vulnerabilities found

### Fixed
- TypeScript: Replaced `any` types with `unknown` in ai-core package for better type safety
- License: Corrected README.md to reflect GPL-3.0 license (was incorrectly stated as MIT)
- Build: Fixed Prisma client generation requirement for production builds

### Security
- Passed CodeQL security analysis with zero vulnerabilities
- All dependencies audited
- Type safety improvements in AI core service layer

---

## [0.1.0] - 2026-01-16

### Added
- Initial public release
- AI-powered website builder with natural language commands
- Drag & drop visual editor with real-time preview
- Component library with 50+ elements
- AI code generation and style assistance
- Export to HTML, React, and Vue formats
- Responsive design tools
- Template gallery with multiple categories
- User authentication system
- Pricing plans with subscription management
- Dashboard with project management
- Support center with comprehensive documentation
- White-label branding options
- Admin panel for system management
- Affiliate program integration

### Features
- **AI Integration**
  - Natural language to website generation
  - Smart component suggestions
  - AI-powered content generation
  - Code explanation and assistance
  - Style optimization

- **Visual Editor**
  - Drag & drop interface
  - Real-time preview across devices
  - Component tree navigation
  - Style panel with live updates
  - Props panel for component customization
  - Layers panel for hierarchy management

- **Code Editor**
  - Syntax highlighting for HTML, CSS, JavaScript
  - Real-time sync with visual editor
  - Code export functionality

- **Advanced Features**
  - SEO optimization tools
  - Analytics integration
  - E-commerce panel
  - Multi-language support
  - Version history tracking
  - Security features (SSL, CSP, XSS protection)
  - Custom code injection
  - Popup builder
  - Collaboration tools (upcoming)

- **Export & Deployment**
  - Export to static HTML/CSS/JS
  - React component export
  - Vue component export
  - One-click deployment (planned)
  - Custom domain support

### Technical Stack
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Editor**: dnd-kit for drag & drop
- **AI**: OpenAI GPT-4 integration
- **State Management**: Zustand with immer
- **Build System**: Turborepo, pnpm workspaces

### Fixed
- Turbo.json configuration for compatibility with Turborepo 1.13.4
- ESLint errors with unescaped quotes in JSX
- TypeScript type errors in vitest configuration
- Font loading issues in sandboxed environments
- Image domain security restrictions in Next.js config
- Vue export implementation (was previously TODO)

### Security
- Implemented restricted image domain patterns
- Added proper HTML entity escaping in JSX
- SSL certificate provisioning
- Content Security Policy headers (configured)
- XSS protection features

### Documentation
- Comprehensive README with quick start guide
- Project plan and specification
- Contributing guidelines
- API documentation structure
- Component guide
- License: GPL-3.0

### Known Issues
- Payment webhook handlers require database integration (implementation pending)
- Some console logging statements should be replaced with structured logging
- Google Fonts disabled for offline/sandboxed environments (uses fallback)
- Type safety improvements needed in some components (feature-gate, pricing config)

### Coming Soon
- Database integration for payment webhooks
- Real-time collaboration features
- Additional template categories
- More AI-powered features
- Performance optimizations
- Enhanced e-commerce capabilities

---

## About

WebBuilder is an AI-powered web builder that enables users to create websites through natural language commands, visual drag-and-drop editing, and intelligent code generation.

For detailed documentation, visit the [docs](./docs) directory.

For support, see [CONTRIBUTING.md](./CONTRIBUTING.md).
