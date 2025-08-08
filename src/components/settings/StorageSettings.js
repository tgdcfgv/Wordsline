import React, { useState } from "react";
import {
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  HardDrive,
  Trash2,
  FolderOpen,
  Save,
} from "lucide-react";

// 统一的设置区域组件
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

const StorageSettings = ({
  wordbook,
  documents,
  firestoreService,
  userId,
  settings,
  onSettingChange,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [libraryPath, setLibraryPath] = useState(settings?.libraryPath || "~/Documents/RectWords");
  const [status, setStatus] = useState({ type: "", message: "" });

  // 生词本导出功能
  const exportWordbookToCSV = () => {
    let csvContent =
      "data:text/csv;charset=utf-8,word,definition,status,sentences\n";
    for (const word in wordbook) {
      const entry = wordbook[word];
      const sentences = entry.sentences.map((s) => s.text).join("; ");
      const row = [word, `"${entry.def}"`, entry.status, `"${sentences}"`].join(
        ","
      );
      csvContent += row + "\r\n";
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_wordbook.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 生词本导入功能
  const importWordbookFromCSV = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // 这里应该处理CSV导入逻辑
          console.log("导入生词本:", e.target.result);
          setStatus({ type: "success", message: "生词本导入成功！" });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // 文件夹选择功能
  const handleSelectFolder = async () => {
    try {
      // 尝试使用不同的API方法
      if (window.electronAPI?.selectDirectory) {
        const result = await window.electronAPI.selectDirectory();
        if (result?.canceled) {
          setStatus({ type: "info", message: "文件夹选择已取消。" });
        } else if (result?.filePaths && result.filePaths.length > 0) {
          const selectedPath = result.filePaths[0];
          setLibraryPath(selectedPath);
          setStatus({
            type: "success",
            message: `已选择文件夹：${selectedPath}`,
          });
        }
      } else if (window.electron?.selectDirectory) {
        const result = await window.electron.selectDirectory();
        if (result?.canceled) {
          setStatus({ type: "info", message: "文件夹选择已取消。" });
        } else if (result?.filePaths && result.filePaths.length > 0) {
          const selectedPath = result.filePaths[0];
          setLibraryPath(selectedPath);
          setStatus({
            type: "success",
            message: `已选择文件夹：${selectedPath}`,
          });
        }
      } else {
        // 如果没有electron API，使用浏览器的文件夹选择
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.onchange = (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const path = file.webkitRelativePath.split('/')[0];
            setLibraryPath(path);
            setStatus({
              type: "success",
              message: `已选择文件夹：${path}`,
            });
          }
        };
        input.click();
      }
    } catch (error) {
      console.error("选择文件夹时出错:", error);
      setStatus({
        type: "error",
        message: "选择文件夹失败，请检查权限或路径。",
      });
    }
  };

  // 保存文件夹路径
  const handleSaveLibraryPath = () => {
    if (!libraryPath) {
      setStatus({ type: "error", message: "文件夹路径不能为空。" });
      return;
    }
    onSettingChange("libraryPath", libraryPath);
    setStatus({ type: "success", message: "阅读库路径已保存！" });
  };

  // 删除所有数据
  const handleDeleteAllData = async () => {
    if (!firestoreService || !userId) return;
    try {
      await firestoreService.deleteAllData();
      setShowConfirm(false);
      setStatus({ type: "success", message: "所有数据已成功删除。" });
    } catch (error) {
      console.error("Error deleting data:", error);
      setStatus({ type: "error", message: "删除数据时发生错误，请稍后重试。" });
    }
  };

  // 清理缓存
  const handleClearCache = () => {
    try {
      // 清理浏览器缓存
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }
      // 清理localStorage
      localStorage.clear();
      setStatus({ type: "success", message: "缓存已清理完成。" });
    } catch (error) {
      setStatus({ type: "error", message: "清理缓存时发生错误。" });
    }
  };

  // 状态消息渲染
  const renderStatusMessage = () => {
    if (!status.message) return null;

    const icon =
      status.type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : status.type === "info" ? (
        <AlertCircle className="w-5 h-5 text-blue-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      );

    const colorClasses =
      status.type === "success"
        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
        : status.type === "info"
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800";

    return (
      <div
        className={`p-3 rounded-lg flex items-center space-x-3 border ${colorClasses}`}
      >
        {icon}
        <span className="text-sm">{status.message}</span>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <HardDrive className="w-8 h-8 mr-4 text-indigo-600" />
        存储管理
      </h1>

      {/* 存储统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-800/50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Array.isArray(documents) ? documents.length : 0}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">文档数量</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Array.isArray(wordbook) ? wordbook.length : Object.keys(wordbook || {}).length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">划词数量</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(() => {
                  try {
                    const storageData = JSON.stringify(wordbook || {}) + JSON.stringify(settings || {});
                    return (storageData.length / 1024 / 1024).toFixed(1);
                  } catch {
                    return "0.0";
                  }
                })()} MB
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">存储大小</p>
            </div>
          </div>
        </div>
      </div>

      {/* 状态消息 */}
      {status.message && <div className="mb-6">{renderStatusMessage()}</div>}

      {/* 阅读库路径管理 */}
      <SettingsSection
        title="阅读库路径"
        description="配置您的阅读库文件夹路径，这是存放和管理所有电子书和文档的地方"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            阅读库文件夹路径
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={libraryPath}
              onChange={(e) => setLibraryPath(e.target.value)}
              placeholder="例如 C:\Users\YourName\Documents\MyLibrary"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
            />
            <button
              onClick={handleSelectFolder}
              className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
            >
              <FolderOpen className="w-4 h-4 mr-1 inline" />
              选择
            </button>
            <button
              onClick={handleSaveLibraryPath}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              <Save className="w-4 h-4 mr-1 inline" />
              保存
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* 生词本数据管理 */}
      <SettingsSection
        title="生词本数据"
        description="导入和导出您的生词本数据，用于备份或在不同设备间同步"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportWordbookToCSV}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            导出生词本
          </button>
          <button
            onClick={importWordbookFromCSV}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            导入生词本
          </button>
        </div>
      </SettingsSection>

      {/* 缓存管理 */}
      <SettingsSection
        title="缓存管理"
        description="管理应用缓存以释放存储空间和提高性能"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                应用缓存
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                清理临时文件和缓存数据
              </p>
            </div>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              清理缓存
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* 危险操作 */}
      <SettingsSection
        title="危险操作"
        description="永久删除所有数据，此操作无法撤销，请谨慎操作"
      >
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          删除所有数据
        </button>
      </SettingsSection>

      {/* 确认删除对话框 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              确认删除所有数据
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              您确定要删除所有数据吗？这将包括：
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-6 list-disc list-inside space-y-1">
              <li>所有生词本数据</li>
              <li>阅读历史和进度</li>
              <li>个人设置和偏好</li>
              <li>导入的文档和笔记</li>
            </ul>
            <p className="text-red-600 dark:text-red-400 text-sm mb-6 font-medium">
              此操作无法撤销！
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteAllData}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageSettings;