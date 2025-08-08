import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { User, Eye, EyeOff } from "lucide-react";
import ToggleSwitch from "../common/buttons/ToggleSwitch";

// Updated SettingsSection for better visual hierarchy
const SettingsSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        {description}
      </p>
    )}
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      {children}
    </div>
  </div>
);

const GeneralSettings = ({ settings = {}, onSettingChange }) => {
  const { t, i18n } = useTranslation();
  const [showWebDevPassword, setShowWebDevPassword] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const themes = [
    { id: "light", name: t("themes.light"), icon: "☀️" },
    { id: "dark", name: t("themes.dark"), icon: "🌙" },
    { id: "auto", name: t("themes.auto"), icon: "💻" },
  ];

  const languages = [
    { id: "zh-CN", name: "简体中文" },
    { id: "en", name: "English" },
  ];

  const handleLanguageChange = (lang) => {
    onSettingChange("language", lang);
    i18n.changeLanguage(lang);
  };

  // WebDAV服务器验证函数
  const verifyWebDAVServer = async () => {
    const protocol = settings.syncProtocol || "https";
    const url = settings.syncUrl || "";
    const username = settings.syncWebdavUsername || "";
    const password = settings.syncWebdavPassword || "";

    // 验证必填字段
    if (!url) {
      setVerificationStatus({
        success: false,
        message: "请输入服务器地址",
      });
      return;
    }

    if (!username || !password) {
      setVerificationStatus({
        success: false,
        message: "请输入用户名和密码",
      });
      return;
    }

    setIsVerifying(true);
    setVerificationStatus(null);

    try {
      const fullUrl = `${protocol}://${url}/wordsline`;

      // 创建基本认证头
      const credentials = btoa(`${username}:${password}`);

      // 首先尝试简单的OPTIONS请求来检测服务器
      const optionsResponse = await fetch(fullUrl, {
        method: "OPTIONS",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        mode: "cors",
      });

      // 如果OPTIONS成功，再尝试PROPFIND
      if (optionsResponse.ok) {
        const response = await fetch(fullUrl, {
          method: "PROPFIND",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/xml",
            Depth: "0",
          },
          mode: "cors",
          body: `<?xml version="1.0" encoding="utf-8" ?>
                 <D:propfind xmlns:D="DAV:">
                   <D:prop>
                     <D:resourcetype/>
                     <D:getcontentlength/>
                     <D:getlastmodified/>
                   </D:prop>
                 </D:propfind>`,
        });

        if (response.ok || response.status === 207) {
          setVerificationStatus({
            success: true,
            message: "服务器验证成功！WebDAV连接正常。",
          });
        } else if (response.status === 401) {
          setVerificationStatus({
            success: false,
            message: "认证失败，请检查用户名和密码。",
          });
        } else if (response.status === 404) {
          setVerificationStatus({
            success: false,
            message: "路径不存在，请检查服务器地址。",
          });
        } else {
          setVerificationStatus({
            success: false,
            message: `服务器响应错误 (${response.status}): ${response.statusText}`,
          });
        }
      } else {
        // OPTIONS失败，可能是认证问题
        if (optionsResponse.status === 401) {
          setVerificationStatus({
            success: false,
            message: "认证失败，请检查用户名和密码。",
          });
        } else {
          setVerificationStatus({
            success: false,
            message: `服务器连接失败 (${optionsResponse.status}): ${optionsResponse.statusText}`,
          });
        }
      }
    } catch (error) {
      console.error("WebDAV verification error:", error);

      // 更详细的错误处理
      if (error.name === "TypeError") {
        if (
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError")
        ) {
          setVerificationStatus({
            success: false,
            message:
              "⚠️ 无法连接到服务器。这通常是由于：\n1. CORS跨域限制（常见于浏览器环境）\n2. 服务器地址错误\n3. 网络连接问题\n\n建议：配置信息已保存，可以在实际同步时测试连接。",
          });
        } else {
          setVerificationStatus({
            success: false,
            message: `网络错误: ${error.message}`,
          });
        }
      } else if (error.message.includes("CORS")) {
        setVerificationStatus({
          success: false,
          message:
            "⚠️ 跨域请求被阻止。这是浏览器的安全限制，不影响实际的文件同步功能。配置信息已保存。",
        });
      } else {
        setVerificationStatus({
          success: false,
          message: `连接失败: ${error.message}`,
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <User className="w-8 h-8 mr-4 text-indigo-600" />
        {t("general_settings.title")}
      </h1>

      <SettingsSection title="账户" description="账户信息和本地存储设置">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("general_settings.account_type")}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              所有数据存储在本地设备
            </p>
          </div>
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {t("general_settings.account_type_local")}
          </span>
        </div>
      </SettingsSection>

      <SettingsSection title="同步" description="配置数据和文件的同步设置">
        {/* 文件同步部分 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              文件同步
            </h4>
            <ToggleSwitch
              checked={settings.fileSync === true}
              onChange={(checked) => onSettingChange("fileSync", checked)}
              label=""
              description=""
            />
          </div>

          {settings.fileSync && (
            <div className="space-y-4">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                  "我的文库"附件同步方式:
                </span>
                <select
                  value={settings.fileSyncMethod || "webdav"}
                  onChange={(e) =>
                    onSettingChange("fileSyncMethod", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 min-w-[120px]"
                >
                  <option value="webdav">WebDAV</option>
                  <option value="ftp">FTP</option>
                  <option value="sftp">SFTP</option>
                </select>
              </div>

              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {/* 网址输入 */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                      网址:
                    </span>
                    <div className="flex-1 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                      <select
                        value={settings.syncProtocol || "https"}
                        onChange={(e) =>
                          onSettingChange("syncProtocol", e.target.value)
                        }
                        className="px-3 py-2 bg-transparent border-0 rounded-l-lg focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-200"
                      >
                        <option value="https">https</option>
                        <option value="http">http</option>
                      </select>
                      <span className="text-gray-400 px-2">://</span>
                      <input
                        type="text"
                        value={settings.syncUrl || ""}
                        onChange={(e) =>
                          onSettingChange("syncUrl", e.target.value)
                        }
                        className="flex-1 px-3 py-2 bg-transparent border-0 focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-200"
                        placeholder="domi.teracloud.jp/dav"
                      />
                      <span className="text-gray-400 px-2">/</span>
                      <input
                        type="text"
                        value="wordsline"
                        readOnly
                        className="w-24 px-2 py-2 bg-gray-100 dark:bg-gray-600 border-0 rounded-r-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* 用户名输入 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                    用户名:
                  </span>
                  <input
                    type="text"
                    value={settings.syncWebdavUsername || ""}
                    onChange={(e) =>
                      onSettingChange("syncWebdavUsername", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    placeholder="输入用户名"
                  />
                </div>

                {/* 密码输入和验证按钮 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px]">
                    密码:
                  </span>
                  <div className="flex-1 relative">
                    <input
                      type={showWebDevPassword ? "text" : "password"}
                      value={settings.syncWebdavPassword || ""}
                      onChange={(e) =>
                        onSettingChange("syncWebdavPassword", e.target.value)
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      placeholder="输入密码"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWebDevPassword(!showWebDevPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showWebDevPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={verifyWebDAVServer}
                    disabled={isVerifying}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    {isVerifying ? "验证中..." : "验证服务器"}
                  </button>
                </div>

                {/* 验证结果显示 */}
                {verificationStatus && (
                  <div
                    className={`p-3 rounded-lg ${
                      verificationStatus.success
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        verificationStatus.success
                          ? "text-green-800 dark:text-green-300"
                          : "text-red-800 dark:text-red-300"
                      }`}
                    >
                      {verificationStatus.success ? "✅ " : "❌ "}
                      {verificationStatus.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SettingsSection>

      <SettingsSection
        title={t("general_settings.appearance_language")}
        description={t("general_settings.appearance_language_desc")}
      >
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("general_settings.theme")}
            </span>
          </div>
          <select
            value={settings.theme || "auto"}
            onChange={(e) => onSettingChange("theme", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.icon} {theme.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("general_settings.language")}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("general_settings.language_desc")}
            </p>
          </div>
          <select
            value={settings.language || "zh-CN"}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </SettingsSection>
    </div>
  );
};

export default GeneralSettings;
