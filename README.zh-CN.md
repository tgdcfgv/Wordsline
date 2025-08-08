# Rect Words

<div align="center">
  <img src="public/logo.svg" alt="Rect Words Logo" width="120" height="120">
  
  **现代化 AI 驱动的阅读伴侣**
  
  [English](./README.md) | 简体中文
  
  [![版本](https://img.shields.io/badge/版本-0.1.0-blue.svg)](https://github.com/your_username/rect-words)
  [![许可证](https://img.shields.io/badge/许可证-MIT-green.svg)](LICENSE)
  [![平台](https://img.shields.io/badge/平台-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](#安装)
</div>

---

## 🌟 项目概述

Rect Words 是一款前沿的跨平台阅读应用程序，通过 AI 驱动的语言辅助功能彻底改变您的阅读体验。采用现代 Web 技术构建（Electron + React + Vite），无缝结合沉浸式阅读与智能词汇学习，帮助您掌握新语言并扩展知识面。

## ✨ 核心功能

### 📖 **沉浸式阅读体验**

- 简洁无干扰的界面，专为长时间阅读优化
- 可自定义的主题和字体设置
- 全屏阅读模式，最大化专注度
- 支持多种文档格式

### 🤖 **AI 驱动的语言助手**

- 基于上下文的即时单词定义和翻译
- 智能短语解释和用法示例
- 语法分析和句子结构解析
- 由 OpenAI 先进语言模型驱动

### 📚 **智能生词本系统**

- 阅读过程中自动收集词汇
- 间隔重复学习算法
- 进度跟踪和学习分析
- 词汇表导入/导出功能

### 🌐 **多平台与多语言**

- Windows、macOS 和 Linux 原生桌面应用
- 无缝双语界面（中英文）
- 自动语言检测
- 离线阅读功能

### 📊 **学习分析**

- 阅读进度可视化
- 词汇增长跟踪
- 学习连续性监控
- 详细统计和洞察

## 🚀 快速开始

### 系统要求

- **Node.js**: 16.0 或更高版本
- **npm**: 7.0 或更高版本（或等效的 yarn）
- **操作系统**: Windows 10+、macOS 10.14+ 或 Linux（Ubuntu 18.04+）

### 安装步骤

1. **克隆仓库**

   ```bash
   git clone https://github.com/your_username/rect-words.git
   cd rect-words
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run electron:dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   npm run dist
   ```

## 🛠️ 开发脚本

| 命令                        | 描述                           |
| --------------------------- | ------------------------------ |
| `npm start` / `npm run dev` | 启动 Vite 开发服务器           |
| `npm run build`             | 构建生产版本                   |
| `npm run preview`           | 预览生产构建                   |
| `npm run electron:dev`      | 在开发模式下运行 Electron 应用 |
| `npm run dist`              | 打包应用程序用于分发           |

## 🔧 配置设置

### API 集成

Rect Words 支持多种词典和 AI 服务：

#### 词典 API

- **免费词典 API** - 无需设置
- **韦氏词典 API** - [获取 API 密钥](https://dictionaryapi.com/)
- **牛津词典 API** - [获取 API 密钥](https://developer.oxforddictionaries.com/)
- **自定义词典 API** - 配置您自己的端点

#### AI 服务

##### OpenAI 模型
- **OpenAI GPT 模型** - [获取 API 密钥](https://platform.openai.com/api-keys) | [文档](https://platform.openai.com/docs/models)
  - GPT-4.1 - 最新旗舰模型，增强了推理和知识能力
  - GPT-4.1 Mini - GPT-4.1的小型快速版本
  - GPT-4.1 Nano - GPT-4.1的最紧凑版本
  - GPT-4o - 具有视觉能力的多模态模型
  - GPT-4o Mini - GPT-4o的小型版本
  - o3 - 针对效率和速度优化的模型
  - o4-mini - 性能强大的紧凑型模型
  - 价格：根据模型不同，每1K tokens $0.01-$0.10

##### DeepSeek 模型
- **DeepSeek AI** - [获取 API 密钥](https://platform.deepseek.com/) | [文档](https://platform.deepseek.com/docs)
  - DeepSeek-V3 - 具有增强推理能力的最新模型
  - DeepSeek-R1 - 研究导向型模型
  - 价格：每1K tokens $0.005-$0.02

##### Google 模型
- **Google Gemini** - [获取 API 密钥](https://ai.google.dev/) | [文档](https://ai.google.dev/docs)
  - Gemini 2.0 Flash - 最新快速模型
  - Gemini 1.5 Pro - 强大的多模态模型
  - Gemini 1.5 Flash - 快速高效模型
  - Gemini Pro - 标准模型
  - 价格：每1K tokens $0.0005-$0.0035

##### Anthropic 模型
- **Anthropic Claude** - [获取 API 密钥](https://console.anthropic.com/) | [文档](https://docs.anthropic.com/claude/docs)
  - Claude 4 Sonnet - 最新平衡型模型
  - Claude 4 Opus - 最强大的Claude模型
  - Claude 3.7 Sonnet - 上一代模型
  - Claude 3.5 Sonnet - 高效模型
  - 价格：每1K tokens $0.003-$0.015

##### Moonshot 模型
- **Moonshot Kimi** - [获取 API 密钥](https://platform.moonshot.cn/) | [文档](https://platform.moonshot.cn/docs)
  - Kimi K2 - 最新模型
  - Kimi K1 (8K/32K/128K) - 不同上下文窗口大小
  - 价格：每1K tokens ¥0.005-¥0.02

##### OpenRouter
- **OpenRouter** - [获取 API 密钥](https://openrouter.ai/keys) | [文档](https://openrouter.ai/docs)
  - 通过单一API访问多种模型
  - 包括OpenAI、Anthropic、Meta、Mistral、Google等模型
  - 价格：根据模型不同，通常每1K tokens $0.001-$0.02

##### 阿里巴巴通义千问模型
- **阿里巴巴通义千问** - [获取 API 密钥](https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key) | [文档](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
  - 通义千问 Max - 最强大的模型
  - 通义千问 Plus - 平衡性能模型
  - 通义千问 Turbo - 快速高效模型
  - 通义千问 1.5 (7B至110B) - 不同规模大小
  - 价格：每1K tokens ¥0.002-¥0.02

##### Mistral AI 模型
- **Mistral AI** - [获取 API 密钥](https://console.mistral.ai/) | [文档](https://docs.mistral.ai/)
  - Mistral Large 2 - 最新旗舰模型
  - Mistral Large - 强大推理模型
  - Mistral Medium - 平衡性能模型
  - Mistral Small - 高效模型
  - Mistral Tiny - 最紧凑模型
  - 价格：每1K tokens €0.0002-€0.008

##### Meta Llama 模型
- **Meta Llama** (通过Together.ai) - [获取 API 密钥](https://api.together.xyz/) | [文档](https://docs.together.ai/docs/inference-models)
  - Llama 3 70B - 最新大型模型
  - Llama 3 8B - 紧凑版本
  - Llama 2 (7B/13B/70B) - 上一代模型
  - 价格：每1K tokens $0.0003-$0.0009

### 设置配置

通过应用程序菜单访问设置或使用 `Ctrl/Cmd + ,`：

1. **API 密钥**: 配置您的词典和 AI 服务凭据
2. **阅读偏好**: 自定义字体、主题和布局
3. **学习设置**: 调整词汇收集和复习间隔
4. **语言选项**: 设置界面语言和翻译偏好

## 🏗️ 架构设计

### 技术栈

- **前端**: React 18 + Vite
- **桌面**: Electron 22
- **样式**: Tailwind CSS + PostCSS
- **国际化**: i18next
- **状态管理**: React Context API
- **数据可视化**: Recharts
- **图标**: Lucide React

### 项目结构

```
rect-words/
├── src/
│   ├── components/          # React 组件
│   │   ├── layout/         # 布局组件
│   │   ├── modules/        # 功能模块
│   │   ├── settings/       # 设置组件
│   │   ├── sidebar/        # 侧边栏组件
│   │   └── ui/            # 可复用 UI 组件
│   ├── context/           # React 上下文提供者
│   ├── hooks/             # 自定义 React 钩子
│   ├── services/          # API 和外部服务
│   ├── utils/             # 工具函数
│   └── constants/         # 应用常量
├── scripts/               # Electron 主进程和预加载脚本
├── public/               # 静态资源
└── docs/                 # 文档
```

## 🤝 贡献指南

我们欢迎社区贡献！以下是您可以帮助的方式：

### 开始贡献

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 进行更改并彻底测试
4. 使用描述性消息提交：`git commit -m 'Add amazing feature'`
5. 推送到您的分支：`git push origin feature/amazing-feature`
6. 打开 Pull Request

### 开发指南

- 遵循现有的代码风格和约定
- 编写清晰、描述性的提交消息
- 为新功能添加测试（如适用）
- 根据需要更新文档
- 确保跨平台兼容性

### 报告问题

- 使用 GitHub 问题跟踪器
- 提供详细的重现步骤
- 包含系统信息和错误日志
- 在创建新问题之前检查现有问题

## 📋 发展路线图

### 版本 0.2.0（即将推出）

- [ ] 增强的 PDF 阅读支持
- [ ] 云同步功能
- [ ] 高级学习算法
- [ ] 移动端配套应用

### 版本 0.3.0（未来）

- [ ] 协作阅读功能
- [ ] 插件系统
- [ ] 高级分析仪表板
- [ ] 语音阅读功能

## 🐛 故障排除

### 常见问题

**应用无法启动**

- 确保 Node.js 版本为 16.0 或更高
- 清除 node_modules 并重新安装：`rm -rf node_modules && npm install`

**API 无法工作**

- 在设置中验证 API 密钥
- 检查网络连接
- 查看 API 使用限制

**性能问题**

- 关闭不必要的应用程序
- 降低词汇收集频率
- 暂时禁用高级 AI 功能

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- OpenAI 提供强大的语言模型
- React 和 Electron 社区
- 所有贡献者和测试用户
- 词典 API 提供商

---

<div align="center">
  由 Rect Words 团队用 ❤️ 制作
  
  [官网](https://rectwords.com) • [文档](docs/) • [支持](https://github.com/your_username/rect-words/issues)
</div>
