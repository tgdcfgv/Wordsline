# Wordsline

<div align="center">
  <img src="public/logo.svg" alt="Wordsline Logo" width="120" height="120">
  
  **A Modern AI-Powered Reading Companion**
  
  English | [简体中文](./README.zh-CN.md)
  
  [![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](https://github.com/your_username/wordsline)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#installation)
</div>

---

## 🌟 Overview

Wordsline is a cutting-edge, cross-platform reading application that transforms your reading experience through AI-powered language assistance. Built with modern web technologies (Electron + React + Vite), it seamlessly combines immersive reading with intelligent vocabulary learning to help you master new languages and expand your knowledge.

## ✨ Key Features

### 📖 **Immersive Reading Experience**
- Clean, distraction-free interface optimized for long reading sessions
- Customizable themes and typography settings
- Full-screen reading mode for maximum focus
- Support for multiple document formats

### 🤖 **AI-Powered Language Assistant**
- Instant word definitions and translations with context awareness
- Smart phrase explanations and usage examples
- Grammar analysis and sentence structure breakdown
- Powered by OpenAI's advanced language models

### 📚 **Intelligent Wordbook System**
- Automatic vocabulary collection during reading
- Spaced repetition learning algorithm
- Progress tracking and learning analytics
- Export/import functionality for vocabulary lists

### 🌐 **Multi-Platform & Multi-Language**
- Native desktop apps for Windows, macOS, and Linux
- Seamless bilingual interface (English/Chinese)
- Automatic language detection
- Offline reading capabilities

### 📊 **Learning Analytics**
- Reading progress visualization
- Vocabulary growth tracking
- Learning streak monitoring
- Detailed statistics and insights

## 🚀 Quick Start

### System Requirements

- **Node.js**: Version 16.0 or higher
- **npm**: Version 7.0 or higher (or yarn equivalent)
- **Operating System**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 18.04+)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your_username/wordsline.git
   cd wordsline
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run electron:dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run dist
   ```

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm start` / `npm run dev` | Start Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run electron:dev` | Run Electron app in development mode |
| `npm run dist` | Package app for distribution |

## 🔧 Configuration

### API Integration

Wordsline supports multiple dictionary and AI services:

#### Dictionary APIs
- **Free Dictionary API** - No setup required
- **Merriam-Webster Dictionary API** - [Get API Key](https://dictionaryapi.com/)
- **Oxford Dictionary API** - [Get API Key](https://developer.oxforddictionaries.com/)
- **Custom Dictionary API** - Configure your own endpoint

#### AI Services

##### OpenAI Models
- **OpenAI GPT Models** - [Get API Key](https://platform.openai.com/api-keys) | [Documentation](https://platform.openai.com/docs/models)
  - GPT-4.1 - Latest flagship model with enhanced reasoning and knowledge
  - GPT-4.1 Mini - Smaller, faster version of GPT-4.1
  - GPT-4.1 Nano - Most compact version of GPT-4.1
  - GPT-4o - Multimodal model with vision capabilities
  - GPT-4o Mini - Smaller version of GPT-4o
  - o3 - Optimized for efficiency and speed
  - o4-mini - Compact version with strong performance
  - Pricing: $0.01-$0.10 per 1K tokens depending on model

##### DeepSeek Models
- **DeepSeek AI** - [Get API Key](https://platform.deepseek.com/) | [Documentation](https://platform.deepseek.com/docs)
  - DeepSeek-V3 - Latest model with enhanced reasoning
  - DeepSeek-R1 - Research-focused model
  - Pricing: $0.005-$0.02 per 1K tokens

##### Google Models
- **Google Gemini** - [Get API Key](https://ai.google.dev/) | [Documentation](https://ai.google.dev/docs)
  - Gemini 2.0 Flash - Latest fast model
  - Gemini 1.5 Pro - Powerful multimodal model
  - Gemini 1.5 Flash - Fast, efficient model
  - Gemini Pro - Standard model
  - Pricing: $0.0005-$0.0035 per 1K tokens

##### Anthropic Models
- **Anthropic Claude** - [Get API Key](https://console.anthropic.com/) | [Documentation](https://docs.anthropic.com/claude/docs)
  - Claude 4 Sonnet - Latest balanced model
  - Claude 4 Opus - Most powerful Claude model
  - Claude 3.7 Sonnet - Previous generation
  - Claude 3.5 Sonnet - Efficient model
  - Pricing: $0.003-$0.015 per 1K tokens

##### Moonshot Models
- **Moonshot Kimi** - [Get API Key](https://platform.moonshot.cn/) | [Documentation](https://platform.moonshot.cn/docs)
  - Kimi K2 - Latest model
  - Kimi K1 (8K/32K/128K) - Different context window sizes
  - Pricing: ¥0.005-¥0.02 per 1K tokens

##### OpenRouter
- **OpenRouter** - [Get API Key](https://openrouter.ai/keys) | [Documentation](https://openrouter.ai/docs)
  - Access to multiple models through a single API
  - Models from OpenAI, Anthropic, Meta, Mistral, Google, etc.
  - Pricing: Varies by model, typically $0.001-$0.02 per 1K tokens

##### Alibaba Qwen Models
- **Alibaba Qwen** - [Get API Key](https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key) | [Documentation](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
  - Qwen Max - Most powerful model
  - Qwen Plus - Balanced performance
  - Qwen Turbo - Fast, efficient model
  - Qwen 1.5 (7B to 110B) - Various sizes
  - Pricing: ¥0.002-¥0.02 per 1K tokens

##### Mistral AI Models
- **Mistral AI** - [Get API Key](https://console.mistral.ai/) | [Documentation](https://docs.mistral.ai/)
  - Mistral Large 2 - Latest flagship model
  - Mistral Large - Powerful reasoning model
  - Mistral Medium - Balanced performance
  - Mistral Small - Efficient model
  - Mistral Tiny - Most compact model
  - Pricing: €0.0002-€0.008 per 1K tokens

##### Meta Llama Models
- **Meta Llama** (via Together.ai) - [Get API Key](https://api.together.xyz/) | [Documentation](https://docs.together.ai/docs/inference-models)
  - Llama 3 70B - Latest large model
  - Llama 3 8B - Compact version
  - Llama 2 (7B/13B/70B) - Previous generation
  - Pricing: $0.0003-$0.0009 per 1K tokens

### Settings Configuration

Access settings through the application menu or use `Ctrl/Cmd + ,`:

1. **API Keys**: Configure your dictionary and AI service credentials
2. **Reading Preferences**: Customize fonts, themes, and layout
3. **Learning Settings**: Adjust vocabulary collection and review intervals
4. **Language Options**: Set interface language and translation preferences

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + Vite
- **Desktop**: Electron 22
- **Styling**: Tailwind CSS + PostCSS
- **Internationalization**: i18next
- **State Management**: React Context API
- **Data Visualization**: Recharts
- **Icons**: Lucide React

### Project Structure
```
wordsline/
├── src/
│   ├── components/          # React components
│   │   ├── layout/         # Layout components
│   │   ├── modules/        # Feature modules
│   │   ├── settings/       # Settings components
│   │   ├── sidebar/        # Sidebar components
│   │   └── ui/            # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external services
│   ├── utils/             # Utility functions
│   └── constants/         # Application constants
├── scripts/               # Electron main and preload scripts
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with descriptive messages: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new features when applicable
- Update documentation as needed
- Ensure cross-platform compatibility

### Reporting Issues
- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include system information and error logs
- Check existing issues before creating new ones

## 📋 Roadmap

### Version 0.2.0 (Coming Soon)
- [ ] Enhanced PDF reading support
- [ ] Cloud synchronization
- [ ] Advanced learning algorithms
- [ ] Mobile companion app

### Version 0.3.0 (Future)
- [ ] Collaborative reading features
- [ ] Plugin system
- [ ] Advanced analytics dashboard
- [ ] Voice reading capabilities

## 🐛 Troubleshooting

### Common Issues

**App won't start**
- Ensure Node.js version is 16.0 or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**API not working**
- Verify API keys in settings
- Check internet connection
- Review API usage limits

**Performance issues**
- Close unnecessary applications
- Reduce vocabulary collection frequency
- Disable advanced AI features temporarily

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing powerful language models
- The React and Electron communities
- All contributors and beta testers
- Dictionary API providers

---

<div align="center">
  Made with ❤️ by the Wordsline Team
  
  [Website](https://wordsline.com) • [Documentation](docs/) • [Support](https://github.com/your_username/wordsline/issues)
</div>
