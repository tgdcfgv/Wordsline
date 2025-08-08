// AI服务 - 支持多个AI提供商
class AIService {
  constructor() {
    this.config = {
      provider: "openai",
      apiKey: null,
      baseURL: null,
      model: null,
    };
    this.isConfigured = false;
    this.conversationHistory = [];
    this.maxHistoryLength = 10; // 限制对话历史长度
  }

  // 获取提供商的默认配置
  getProviderDefaults(provider) {
    const defaults = {
      openai: {
        baseURL: "https://api.openai.com/v1",
        model: 'o3',
        models: [
          'o3',
          'o4-mini (high)',
          'o3-mini (high)',
          'o3-mini',
          'GPT-4.1 mini',
          'o1',
          'GPT-4.1 nano',
          'GPT-4.1',
          'GPT-4o mini',
          'o3-pro',
          'GPT-4o',
          'o1-pro',
        ],
      },
      deepseek: {
        baseURL: "https://api.deepseek.com/v1",
        model: "deepseek-reasoner",
        models: [
          "deepseek-reasoner",
          "deepseek-chat"
        ],
      },
      google: {
        baseURL: "https://generativelanguage.googleapis.com/v1beta",
        model: "gemini-2.5-pro",
        models: [
          "gemini-2.5-pro",
          "gemini-2.5-flash",
          "gemini-2.0-pro",
          "gemini-2.0-flash",
          "gemini-1.5-pro",
          "gemini-1.5-flash",
        ],
      },
      anthropic: {
        baseURL: "https://api.anthropic.com/v1",
        model: "claude-sonnet-4-20250514",
        models: [
          "claude-sonnet-4-20250514",
          "claude-opus-4-20250514",
          "claude-3-7-sonnet-20250219",
          "claude-3-5-sonnet-20241022",
          "claude-3-5-haiku-20241022",
          "claude-3-opus-20240229",
          "claude-3-haiku-20240307",
        ],
      },
      moonshot: {
        baseURL: "https://api.moonshot.cn/v1",
        model: "Kimi K2",
        models: ["Kimi K2", "Kimi K1.5"],
      },
      openrouter: {
        baseURL: "https://openrouter.ai/api/v1",
        model: "openai/gpt-4-turbo",
        models: [
          "openai/gpt-4-turbo",
          "anthropic/claude-3-sonnet",
          "google/gemini-pro",
        ],
      },
      qwen: {
        baseURL: "https://dashscope.aliyuncs.com/api/v1",
        model: "qwen3-235b-a22b",
        models: [
          "qwen3-235b-a22b",
          "qwen3-32b",
          "qwen3-30b-a3b",
          "qwen3-14b",
          "qwen3-8b",
          "qwen3-4b",
          "qwen3-1.7b",
          "qwen3-0.6b",
        ],
      },
      mistral: {
        baseURL: "https://api.mistral.ai/v1",
        model: "mistral-large-latest",
        models: [
          "mistral-large-latest",
          "mistral-medium-latest",
          "mistral-small-latest",
        ],
      },
      llama: {
        baseURL: "https://api.together.xyz/v1",
        model: "meta-llama/Llama-3-70b-chat-hf",
        models: [
          "meta-llama/Llama-3-70b-chat-hf",
          "meta-llama/Llama-2-70b-chat-hf",
        ],
      },
    };
    return defaults[provider] || defaults.openai;
  }

  // 获取支持的提供商列表
  getSupportedProviders() {
    return [
      { id: "openai", name: "OpenAI", requiresApiKey: true },
      { id: "deepseek", name: "DeepSeek", requiresApiKey: true },
      { id: "google", name: "Google Gemini", requiresApiKey: true },
      { id: "anthropic", name: "Anthropic Claude", requiresApiKey: true },
      { id: "moonshot", name: "Moonshot Kimi", requiresApiKey: true },
      { id: "openrouter", name: "OpenRouter", requiresApiKey: true },
      { id: "qwen", name: "Alibaba Qwen", requiresApiKey: true },
      { id: "mistral", name: "Mistral AI", requiresApiKey: true },
      { id: "llama", name: "Meta Llama", requiresApiKey: true },
    ];
  }

  // 配置AI服务
  configure(newConfig) {
    const provider = newConfig.provider || "openai";
    const defaults = this.getProviderDefaults(provider);

    this.config = {
      provider: provider,
      apiKey: newConfig.apiKey || null,
      baseURL: newConfig.baseURL || defaults.baseURL,
      model: newConfig.model || defaults.model,
    };

    this.isConfigured = !!this.config.apiKey;
    console.log("AI Service Configured:", this.config);
  }

  // 发送消息到AI
  async sendMessage(message, context = null, useHistory = true) {
    if (!this.isConfigured) {
      throw new Error(
        "AI service not configured. Please set up API key in settings."
      );
    }

    try {
      const systemMessage = this.getSystemMessage();
      let userMessage = message;

      if (context) {
        userMessage = `Context: "${context}"\n\nQuestion: ${message}`;
      }

      const { provider, baseURL, apiKey, model } = this.config;
      const url = `${baseURL}${this.getEndpointForProvider(provider, model)}`;
      const headers = this.getHeadersForProvider(provider, apiKey);

      // 构建消息历史
      const messages = this.buildMessageHistory(
        systemMessage,
        userMessage,
        useHistory
      );
      const body = this.getBodyForProvider(provider, model, messages);

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(30000), // 30秒超时
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = this.getErrorMessage(response.status, errorData);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const aiResponse = this.extractContentFromResponse(provider, data);

      // 更新对话历史
      if (useHistory) {
        this.updateConversationHistory(userMessage, aiResponse);
      }

      return aiResponse;
    } catch (error) {
      console.error(`AI Service Error (${this.config.provider}):`, error);
      throw this.handleError(error);
    }
  }

  // 生成回复的简化方法
  async generateResponse(message, context = null) {
    return this.sendMessage(message, context, true);
  }

  // 获取系统消息
  getSystemMessage() {
    return `You are a helpful AI assistant for language learning and reading comprehension. Your role is to:

1. Help users understand text content and vocabulary
2. Provide clear, concise explanations
3. Offer examples and context when helpful
4. Support language learning with definitions, pronunciations, and usage
5. Answer questions about reading materials accurately

Please be friendly, educational, and supportive in your responses.`;
  }

  // 构建消息历史
  buildMessageHistory(systemMessage, userMessage, useHistory) {
    const messages = [{ role: "system", content: systemMessage }];

    if (useHistory && this.conversationHistory.length > 0) {
      // 添加最近的对话历史
      const recentHistory = this.conversationHistory.slice(
        -this.maxHistoryLength
      );
      messages.push(...recentHistory);
    }

    messages.push({ role: "user", content: userMessage });
    return messages;
  }

  // 更新对话历史
  updateConversationHistory(userMessage, aiResponse) {
    this.conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: aiResponse }
    );

    // 限制历史长度
    if (this.conversationHistory.length > this.maxHistoryLength * 2) {
      this.conversationHistory = this.conversationHistory.slice(
        -this.maxHistoryLength * 2
      );
    }
  }

  // 清除对话历史
  clearHistory() {
    this.conversationHistory = [];
  }

  // 获取错误消息
  getErrorMessage(status, errorData) {
    const commonErrors = {
      400: "Invalid request. Please check your input.",
      401: "Authentication failed. Please check your API key.",
      403: "Access forbidden. Please verify your API permissions.",
      404: "API endpoint not found. Please check your configuration.",
      429: "Rate limit exceeded. Please try again later.",
      500: "Server error. Please try again later.",
      502: "Bad gateway. The AI service is temporarily unavailable.",
      503: "Service unavailable. Please try again later.",
    };

    if (commonErrors[status]) {
      return commonErrors[status];
    }

    return (
      errorData.error?.message ||
      errorData.message ||
      `HTTP ${status}: Request failed`
    );
  }

  // 处理错误
  handleError(error) {
    if (error.name === "AbortError") {
      return new Error("Request timeout. Please try again.");
    }

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      return new Error("Network error. Please check your internet connection.");
    }

    return error;
  }

  getEndpointForProvider(provider, model) {
    switch (provider) {
      case "google":
        return `/models/${model}:generateContent`;
      case "anthropic":
        return "/messages";
      case "qwen":
        return "/services/aigc/text-generation/generation";
      default:
        return "/chat/completions";
    }
  }

  getHeadersForProvider(provider, apiKey) {
    const headers = { "Content-Type": "application/json" };
    switch (provider) {
      case "google":
        headers["X-goog-api-key"] = apiKey;
        break;
      case "anthropic":
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
        break;
      case "openrouter":
        headers["Authorization"] = `Bearer ${apiKey}`;
        headers["HTTP-Referer"] = window.location.origin;
        headers["X-Title"] = "Rect Words App";
        break;
      default:
        headers["Authorization"] = `Bearer ${apiKey}`;
    }
    return headers;
  }

  getBodyForProvider(provider, model, messages) {
    switch (provider) {
      case "google":
        // Google Gemini 需要特殊格式
        const systemMsg =
          messages.find((m) => m.role === "system")?.content || "";
        const userMessages = messages.filter((m) => m.role !== "system");
        const combinedText =
          systemMsg +
          "\n\n" +
          userMessages.map((m) => `${m.role}: ${m.content}`).join("\n\n");

        return {
          contents: [{ parts: [{ text: combinedText }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        };

      case "anthropic":
        const systemMessage =
          messages.find((m) => m.role === "system")?.content || "";
        const conversationMessages = messages.filter(
          (m) => m.role !== "system"
        );

        return {
          model: model,
          max_tokens: 2000,
          temperature: 0.7,
          system: systemMessage,
          messages: conversationMessages,
        };

      case "qwen":
        return {
          model: model,
          input: { messages: messages },
          parameters: {
            max_tokens: 2000,
            temperature: 0.7,
            top_p: 0.8,
          },
        };

      default: // OpenAI, DeepSeek, Moonshot, OpenRouter, Mistral, Llama
        return {
          model: model,
          messages: messages,
          max_tokens: 2000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        };
    }
  }

  extractContentFromResponse(provider, data) {
    try {
      switch (provider) {
        case "google":
          return data.candidates[0].content.parts[0].text;
        case "anthropic":
          return data.content[0].text;
        case "qwen":
          return data.output.text;
        default:
          return data.choices[0].message.content;
      }
    } catch (error) {
      console.error("Error extracting content from response:", error, data);
      throw new Error("Invalid response structure from AI API.");
    }
  }

  // 测试连接
  async testConnection() {
    try {
      const testMessage =
        "Hello! Please respond with 'Connection test successful' to confirm the API is working.";
      const response = await this.sendMessage(testMessage, null, false); // 不使用历史记录

      return {
        success: true,
        message: "AI connection test successful!",
        response:
          response.substring(0, 100) + (response.length > 100 ? "..." : ""),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Connection test failed",
      };
    }
  }

  // 获取服务状态
  getServiceStatus() {
    return {
      isConfigured: this.isConfigured,
      provider: this.config.provider,
      model: this.config.model,
      hasApiKey: !!this.config.apiKey,
      historyLength: this.conversationHistory.length,
    };
  }

  // 重置服务
  reset() {
    this.conversationHistory = [];
    this.isConfigured = false;
    this.config = {
      provider: "openai",
      apiKey: null,
      baseURL: null,
      model: null,
    };
  }
}

const aiService = new AIService();
export default aiService;
