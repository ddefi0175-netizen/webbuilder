# AI WebBuilder

🚀 A modern, AI-powered web builder that enables users to create websites through natural language commands, visual drag-and-drop editing, and intelligent code generation.

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Node](https://img.shields.io/badge/node-20%2B-green.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0%2B-blue.svg)
![CI](https://github.com/ddefi0175-netizen/webbuilder/actions/workflows/ci.yml/badge.svg)

## ✨ Features

### 🎨 Visual Editor

- Intuitive drag-and-drop interface
- Real-time preview across devices
- Component library with 50+ elements
- Responsive design tools

### 🤖 AI-Powered

- **Natural Language Commands**: "Add a hero section with a gradient background"
- **Smart Code Generation**: Convert descriptions to clean, semantic code
- **Style Assistant**: "Make the button more prominent"
- **Content Generation**: AI-written text, AI-generated images
- **Code Explanation**: Understand any piece of code instantly

### 💻 Code Editor

- Full Monaco editor integration
- Syntax highlighting for HTML, CSS, JavaScript, TypeScript
- Inline AI suggestions
- Real-time sync with visual editor

### 🚀 Export & Deploy

- Export to static HTML/CSS/JS
- Framework exports (React, Vue, Svelte)
- One-click deployment to Vercel/Netlify
- Custom domain support

## 🏁 Quick Start

```bash
# Clone the repository
git clone https://github.com/ddefi0175-netizen/webbuilder.git

# Install dependencies
cd webbuilder
pnpm install

# Set up environment
cp .env.example .env.local
# Add your API keys to .env.local

# Start development
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to start building!

## 📚 Documentation

- [Project Plan](./docs/PROJECT_PLAN.md) - Full project specification
- [Setup Guide](./docs/SETUP.md) - Development environment setup
- [API Reference](./docs/API.md) - Backend API documentation
- [Component Guide](./docs/COMPONENTS.md) - Available components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Redis
- **AI**: OpenAI GPT-4, DALL-E 3
- **Editor**: Monaco Editor, dnd-kit
- **UI**: shadcn/ui, Radix UI

## 📁 Project Structure

```
webbuilder/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Express backend
├── packages/
│   ├── ai-core/      # AI service layer
│   ├── components/   # Shared components
│   └── shared-types/ # TypeScript types
├── docs/             # Documentation
└── docker/           # Docker configs
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for AI capabilities
- [Vercel](https://vercel.com) for Next.js
- [shadcn](https://ui.shadcn.com) for beautiful components

---

Built with ❤️ by the WebBuilder Team
