import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import ToggleSwitch from "../common/buttons/ToggleSwitch";
import RangeSlider from "../common/forms/RangeSlider";
import SelectField from "../common/forms/SelectField";

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

const ReadingSettings = ({ settings = {}, onSettingChange }) => {
  const [systemFonts, setSystemFonts] = useState([]);

  // 获取系统字体
  useEffect(() => {
    const getSystemFonts = async () => {
      try {
        // 使用Web Font API检测可用字体
        const commonFonts = [
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Georgia",
          "Verdana",
          "Tahoma",
          "Courier New",
          "Monaco",
          "Consolas",
          "Calibri",
          "Microsoft YaHei",
          "SimSun",
          "SimHei",
          "KaiTi",
          "FangSong",
          "PingFang SC",
          "Hiragino Sans GB",
          "STHeiti",
          "WenQuanYi Micro Hei",
        ];

        const availableFonts = [];
        for (const font of commonFonts) {
          // 简单检测字体是否可用
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          context.font = `12px ${font}`;
          const metrics = context.measureText("Hello World");
          if (metrics.width > 0) {
            availableFonts.push(font);
          }
        }

        setSystemFonts(availableFonts);
      } catch (error) {
        console.error("获取系统字体失败:", error);
      }
    };

    getSystemFonts();
  }, []);

  const fontFamilies = [
    { id: "system", name: "系统默认", style: "font-sans" },
    { id: "serif", name: "衬线字体", style: "font-serif" },
    { id: "mono", name: "等宽字体", style: "font-mono" },
    { id: "noto", name: "Noto Serif", style: "font-serif" },
    { id: "predefined-georgia", name: "Georgia", style: "font-serif" },
    { id: "times", name: "Times New Roman", style: "font-serif" },
    ...systemFonts
      .filter((font) => !["Georgia", "Times New Roman"].includes(font)) // 过滤掉已有的字体
      .map((font) => ({
        id: `system-${font.toLowerCase().replace(/\s+/g, "-")}`,
        name: font,
        style: `font-['${font}']`,
      })),
  ];

  const fontSizeOptions = [
    { value: 0, label: "极小" },
    { value: 1, label: "小" },
    { value: 2, label: "标准" },
    { value: 3, label: "大" },
    { value: 4, label: "极大" },
    { value: 5, label: "超大" },
  ];

  const lineHeightOptions = [
    { value: 0, label: "紧密" },
    { value: 1, label: "正常" },
    { value: 2, label: "宽松" },
    { value: 3, label: "很宽松" },
    { value: 4, label: "极宽松" },
    { value: 5, label: "超宽松" },
  ];

  const pageWidthOptions = [
    { value: 0, label: "窄" },
    { value: 1, label: "标准" },
    { value: 2, label: "宽" },
    { value: 3, label: "更宽" },
    { value: 4, label: "极宽" },
    { value: 5, label: "全宽" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <BookOpen className="w-8 h-8 mr-4 text-indigo-600" />
        阅读设置
      </h1>

      <SettingsSection
        title="字体设置"
        description="自定义阅读时的字体样式和大小"
      >
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              字体族
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              选择阅读时使用的字体
            </p>
          </div>
          <select
            value={settings.fontFamily || "system"}
            onChange={(e) => onSettingChange("fontFamily", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
          >
            {fontFamilies.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <RangeSlider
          value={typeof settings.fontSize === "number" ? settings.fontSize : 2}
          onChange={(value) => onSettingChange("fontSize", value)}
          min={0}
          max={5}
          step={1}
          options={fontSizeOptions}
          label="字体大小"
          description="调整阅读时的字体大小"
        />

        <RangeSlider
          value={
            typeof settings.lineHeight === "number" ? settings.lineHeight : 1
          }
          onChange={(value) => onSettingChange("lineHeight", value)}
          min={0}
          max={5}
          step={1}
          options={lineHeightOptions}
          label="行高"
          description="调整文本行间距"
        />
      </SettingsSection>

      <SettingsSection
        title="布局设置"
        description="调整阅读区域的布局和显示方式"
      >
        <RangeSlider
          value={
            typeof settings.pageWidth === "number" ? settings.pageWidth : 1
          }
          onChange={(value) => onSettingChange("pageWidth", value)}
          min={0}
          max={5}
          step={1}
          options={pageWidthOptions}
          label="阅读区域宽度"
          description="调整阅读内容的宽度"
        />

        <ToggleSwitch
          checked={settings.centerContent !== false}
          onChange={(checked) => onSettingChange("centerContent", checked)}
          label="居中显示内容"
          description="将阅读内容在页面中央显示"
        />

        <ToggleSwitch
          checked={settings.showParagraphSpacing !== false}
          onChange={(checked) =>
            onSettingChange("showParagraphSpacing", checked)
          }
          label="显示段落间距"
          description="在段落之间添加额外的空白"
        />
      </SettingsSection>

      <SettingsSection
        title="阅读体验"
        description="优化您的阅读体验和视觉效果"
      >
        <ToggleSwitch
          checked={settings.eyeCareMode === true}
          onChange={(checked) => onSettingChange("eyeCareMode", checked)}
          label="护眼模式"
          description="降低屏幕蓝光，保护视力"
        />

        <ToggleSwitch
          checked={settings.focusMode === true}
          onChange={(checked) => onSettingChange("focusMode", checked)}
          label="专注模式"
          description="隐藏干扰元素，专注阅读"
        />

        <ToggleSwitch
          checked={settings.showReadingProgress !== false}
          onChange={(checked) =>
            onSettingChange("showReadingProgress", checked)
          }
          label="显示阅读进度"
          description="在页面顶部显示阅读进度条"
        />

        <ToggleSwitch
          checked={settings.highlightSelection === true}
          onChange={(checked) => onSettingChange("highlightSelection", checked)}
          label="选中文本高亮"
          description="高亮显示选中的文本内容"
        />
      </SettingsSection>

      <SettingsSection title="阅读模式" description="配置阅读方式和显示方向">
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              阅读模式
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              选择阅读内容的显示方式
            </p>
          </div>
          <select
            value={settings.readingMode || "scroll"}
            onChange={(e) => onSettingChange("readingMode", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
          >
            <option value="scroll">滚动模式</option>
            <option value="pagination">分页模式</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              阅读方向
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              选择文本的阅读方向
            </p>
          </div>
          <select
            value={settings.readingDirection || "ltr"}
            onChange={(e) =>
              onSettingChange("readingDirection", e.target.value)
            }
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
          >
            <option value="ltr">从左到右</option>
            <option value="rtl">从右到左</option>
          </select>
        </div>
      </SettingsSection>

      <SettingsSection
        title="阅读侧边栏"
        description="配置阅读界面侧边栏的功能显示"
      >
        <RangeSlider
          value={
            typeof settings.sidebarWidth === "number"
              ? Math.round((settings.sidebarWidth - 200) / 50)
              : 2
          }
          onChange={(value) =>
            onSettingChange("sidebarWidth", 200 + value * 50)
          }
          min={0}
          max={6}
          step={1}
          options={[
            { value: 0, label: "200px" },
            { value: 1, label: "250px" },
            { value: 2, label: "300px" },
            { value: 3, label: "350px" },
            { value: 4, label: "400px" },
            { value: 5, label: "450px" },
            { value: 6, label: "500px" },
          ]}
          label="侧边栏默认宽度"
          description="调整阅读界面侧边栏的宽度"
        />

        <ToggleSwitch
          checked={settings.sidebarWordbook !== false}
          onChange={(checked) => onSettingChange("sidebarWordbook", checked)}
          label="生词本面板"
          description="在侧边栏显示生词本和学习进度"
        />

        <ToggleSwitch
          checked={settings.sidebarOutline !== false}
          onChange={(checked) => onSettingChange("sidebarOutline", checked)}
          label="文档大纲"
          description="在侧边栏显示文档章节目录"
        />

        <ToggleSwitch
          checked={settings.sidebarBookmarks !== false}
          onChange={(checked) => onSettingChange("sidebarBookmarks", checked)}
          label="书签面板"
          description="在侧边栏显示书签和标注"
        />

        <ToggleSwitch
          checked={settings.sidebarNotes !== false}
          onChange={(checked) => onSettingChange("sidebarNotes", checked)}
          label="笔记面板"
          description="在侧边栏显示阅读笔记"
        />

        <ToggleSwitch
          checked={settings.sidebarSearch !== false}
          onChange={(checked) => onSettingChange("sidebarSearch", checked)}
          label="搜索面板"
          description="在侧边栏显示文档内搜索功能"
        />

        <ToggleSwitch
          checked={settings.sidebarTranslation === true}
          onChange={(checked) => onSettingChange("sidebarTranslation", checked)}
          label="翻译面板"
          description="在侧边栏显示AI翻译功能"
        />
      </SettingsSection>
    </div>
  );
};

export default ReadingSettings;
