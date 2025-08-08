import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Book,
  Bot,
  BookOpen,
  Volume2,
  BookMarked,
  Scan,
  Info,
  ChevronRight,
  Database,
} from "lucide-react";
import GeneralSettings from "../settings/GeneralSettings";
import DictionarySettings from "../settings/DictionarySettings";
import AISettings from "../settings/AISettings";
import ReadingSettings from "../settings/ReadingSettings";
import PronunciationSettings from "../settings/PronunciationSettings";
import WordbookSettings from "../settings/WordbookSettings";
import ImportSettings from "../settings/ImportSettings";
// import AboutSettings from "../settings/AboutSettings"; // 组件不存在，暂时注释
import AboutSettings from "../settings/AboutSettings";
import StorageSettings from "../settings/StorageSettings";

const SettingsPage = ({
  userId,
  wordbook,
  documents,
  firestoreService,
  onSettingChange,
  settings = {},
  localStorageService,
  currentHash = "", // 新增：当前hash参数
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("general");

  // 根据hash自动设置活动部分
  useEffect(() => {
    if (currentHash.startsWith('#settings/')) {
      const section = currentHash.replace('#settings/', '');
      // 验证section是否存在于settingsSections中
      const validSections = [
        "general", "dictionary", "ai", "reading", 
        "pronunciation", "wordbook", "import", "storage", "about"
      ];
      if (validSections.includes(section)) {
        setActiveSection(section);
      }
    }
  }, [currentHash]);

  // 处理设置项点击，同时更新hash和活动状态
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    window.location.hash = `#settings/${sectionId}`;
  };

  const safeSettings = settings || {};
  const safeWordbook = Array.isArray(wordbook) ? wordbook : [];

  const settingsSections = [
    {
      id: "general",
      title: t("settings.general"),
      icon: User,
      description: t("settings.general_desc"),
    },
    {
      id: "dictionary",
      title: t("settings.dictionary"),
      icon: Book,
      description: t("settings.dictionary_desc"),
    },
    {
      id: "ai",
      title: t("settings.ai"),
      icon: Bot,
      description: t("settings.ai_desc"),
    },
    {
      id: "reading",
      title: t("settings.reading"),
      icon: BookOpen,
      description: t("settings.reading_desc"),
    },
    {
      id: "pronunciation",
      title: t("settings.pronunciation"),
      icon: Volume2,
      description: t("settings.pronunciation_desc"),
    },
    {
      id: "wordbook",
      title: t("settings.wordbook"),
      icon: BookMarked,
      description: t("settings.wordbook_desc"),
    },
    {
      id: "import",
      title: t("settings.import"),
      icon: Scan,
      description: t("settings.import_desc"),
    },
    {
      id: "storage",
      title: "存储管理",
      icon: Database,
      description: "管理应用数据、文件夹路径和缓存",
    },
    {
      id: "about",
      title: t("settings.about"),
      icon: Info,
      description: t("settings.about_desc"),
    },
  ];

  const renderSettingContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
            userId={userId}
          />
        );
      case "dictionary":
        return (
          <DictionarySettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
          />
        );
      case "ai":
        return (
          <AISettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
          />
        );
      case "reading":
        return (
          <ReadingSettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
          />
        );
      case "pronunciation":
        return (
          <PronunciationSettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
          />
        );
      case "wordbook":
        return (
          <WordbookSettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
            wordbook={safeWordbook}
          />
        );
      case "import":
        return (
          <ImportSettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
          />
        );
      case "storage":
        return (
          <StorageSettings
            wordbook={safeWordbook}
            documents={documents}
            firestoreService={firestoreService}
            userId={userId}
            settings={safeSettings}
            onSettingChange={onSettingChange}
          />
        );
      case "about":
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">关于</h1>
            <AboutSettings />
          </div>
        );
      default:
        return (
          <GeneralSettings
            settings={safeSettings}
            onSettingChange={onSettingChange}
            userId={userId}
          />
        );
    }
  };

  const renderNavigationButton = (section) => {
    const Icon = section.icon;
    const isActive = activeSection === section.id;

    return (
      <button
        key={section.id}
        onClick={() => handleSectionClick(section.id)}
        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
          isActive
            ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-3" />
          <div>
            <div className="font-medium">{section.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {section.description}
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 transition-transform" />
      </button>
    );
  };

  return (
    <div className="p-4 h-full">
      <div className="flex h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
        <div className="w-80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 flex flex-col rounded-l-xl">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {settingsSections.map(renderNavigationButton)}
          </nav>
        </div>

        <div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex flex-col rounded-r-xl">
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {renderSettingContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
