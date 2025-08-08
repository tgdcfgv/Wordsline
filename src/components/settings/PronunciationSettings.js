import React, { useState } from 'react';
import { Volume2, Eye, EyeOff } from 'lucide-react';
import SelectField from '../common/forms/SelectField';
import ToggleSwitch from '../common/buttons/ToggleSwitch';

// 统一的设置区域组件
const SettingsSection = ({ title, description, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {children}
        </div>
    </div>
);

const PronunciationSettings = ({ settings = {}, onSettingChange }) => {
    const [showApiKey, setShowApiKey] = useState(false);
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionResult, setConnectionResult] = useState(null);
    
    const accentOptions = [
        { value: 'us', label: '🇺🇸 美式发音' },
        { value: 'uk', label: '🇬🇧 英式发音' },
        { value: 'au', label: '🇦🇺 澳式发音' }
    ];

    const speedOptions = [
        { value: 'slow', label: '慢速' },
        { value: 'normal', label: '正常' },
        { value: 'fast', label: '快速' }
    ];

    const ttsProviderOptions = [
        { value: 'browser', label: '浏览器内置TTS' },
        { value: 'openai', label: 'OpenAI TTS' },
        { value: 'minimax', label: 'MiniMax TTS' },
        { value: 'elevenlabs', label: 'ElevenLabs TTS' },
        { value: 'azure', label: 'Azure TTS' },
        { value: 'custom', label: '自定义API' }
    ];

    const getModelOptions = (provider) => {
        switch (provider) {
            case 'openai':
                return [
                    { value: 'tts-1-hd', label: 'TTS-1-HD (高质量)' },
                    { value: 'tts-1', label: 'TTS-1 (标准)' }
                ];
            case 'minimax':
                return [
                    { value: 'speech-02-hd', label: 'Speech-02-HD' }
                ];
            case 'elevenlabs':
                return [
                    { value: 'multilingual-v2', label: 'Multilingual v2' },
                    { value: 'turbo-v2.5', label: 'Turbo v2.5' },
                    { value: 'flash-v2.5', label: 'Flash v2.5' }
                ];
            default:
                return [{ value: 'default', label: '默认模型' }];
        }
    };

    const getDefaultBaseURL = (provider) => {
        switch (provider) {
            case 'openai':
                return 'https://api.openai.com/v1/audio/speech';
            case 'minimax':
                return 'https://api.minimax.chat/v1/text_to_speech';
            case 'elevenlabs':
                return 'https://api.elevenlabs.io/v1/text-to-speech';
            case 'azure':
                return 'https://eastus.tts.speech.microsoft.com/cognitiveservices/v1';
            default:
                return '';
        }
    };

    const testTTSConnection = async () => {
        if (!settings.ttsApiKey) {
            setConnectionResult({ success: false, message: '请输入API密钥' });
            return;
        }

        setTestingConnection(true);
        setConnectionResult(null);

        try {
            // 这里应该调用实际的TTS测试接口
            await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
            
            setConnectionResult({ 
                success: true, 
                message: 'TTS服务连接成功！' 
            });
        } catch (error) {
            setConnectionResult({ 
                success: false, 
                message: '连接失败：' + error.message 
            });
        } finally {
            setTestingConnection(false);
            setTimeout(() => setConnectionResult(null), 3000);
        }
    };

    const currentModelOptions = getModelOptions(settings.ttsProvider || 'browser');

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                <Volume2 className="w-8 h-8 mr-4 text-indigo-600" />
                发音设置
            </h1>

            <SettingsSection title="单词发音" description="配置单词查询时的发音设置">
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">发音偏好</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">选择您偏好的英语发音风格</p>
                    </div>
                    <select
                        value={settings.accent || 'us'}
                        onChange={(e) => onSettingChange('accent', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                    >
                        {accentOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">语音速度</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">调整语音播放的速度</p>
                    </div>
                    <select
                        value={settings.speechSpeed || 'normal'}
                        onChange={(e) => onSettingChange('speechSpeed', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                    >
                        {speedOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <ToggleSwitch
                    checked={settings.autoPlay !== false}
                    onChange={(checked) => onSettingChange('autoPlay', checked)}
                    label="自动播放发音"
                    description="查词时自动播放单词发音"
                />
                
                <ToggleSwitch
                    checked={settings.showPhonetics !== false}
                    onChange={(checked) => onSettingChange('showPhonetics', checked)}
                    label="显示音标"
                    description="在单词释义中显示国际音标"
                />
                
                <ToggleSwitch
                    checked={settings.repeatOnClick === true}
                    onChange={(checked) => onSettingChange('repeatOnClick', checked)}
                    label="点击重复播放"
                    description="点击单词时重复播放发音"
                />
            </SettingsSection>

            <SettingsSection title="文本朗读 (TTS)" description="配置文本转语音服务提供商和相关设置">
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">服务提供商</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">选择语音合成服务</p>
                    </div>
                    <select
                        value={settings.ttsProvider || 'browser'}
                        onChange={(e) => onSettingChange('ttsProvider', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                    >
                        {ttsProviderOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* AI TTS API配置 */}
                {settings.ttsProvider && settings.ttsProvider !== 'browser' && (
                    <>
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API密钥</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">TTS服务的API密钥</p>
                            </div>
                            <div className="flex items-center space-x-2 min-w-[200px]">
                                <div className="relative flex-1">
                                    <input
                                        type={showApiKey ? "text" : "password"}
                                        value={settings.ttsApiKey || ""}
                                        onChange={(e) => onSettingChange('ttsApiKey', e.target.value)}
                                        placeholder="输入API密钥"
                                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API基础URL</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">TTS服务的API地址</p>
                            </div>
                            <input
                                type="text"
                                value={settings.ttsBaseURL || getDefaultBaseURL(settings.ttsProvider)}
                                onChange={(e) => onSettingChange('ttsBaseURL', e.target.value)}
                                placeholder={getDefaultBaseURL(settings.ttsProvider)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[200px]"
                            />
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">语音模型</span>
                                <p className="text-xs text-gray-500 dark:text-gray-400">选择语音合成模型</p>
                            </div>
                            <select
                                value={settings.ttsModel || currentModelOptions[0]?.value}
                                onChange={(e) => onSettingChange('ttsModel', e.target.value)}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                            >
                                {currentModelOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 测试连接按钮 */}
                        <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex-1">
                                {connectionResult && (
                                    <div className={`text-sm ${connectionResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {connectionResult.message}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={testTTSConnection}
                                disabled={testingConnection || !settings.ttsApiKey}
                                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md flex items-center space-x-2"
                            >
                                {testingConnection ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>测试中...</span>
                                    </>
                                ) : (
                                    <span>测试连接</span>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </SettingsSection>
        </div>
    );
};

export default PronunciationSettings;
