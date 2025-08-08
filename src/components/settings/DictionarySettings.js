import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Book, Eye, EyeOff, Upload, FileText } from 'lucide-react';
import DictionaryService from '../../services/dictionary';
import ToggleSwitch from '../common/buttons/ToggleSwitch';

const SettingsSection = ({ title, description, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {children}
        </div>
    </div>
);

const DictionarySettings = ({ settings = {}, onSettingChange }) => {
    const { t } = useTranslation();
    const [showApiKey, setShowApiKey] = useState(false);
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionResult, setConnectionResult] = useState(null);

    const dictionaryProviders = [
        { id: 'free', name: t('dictionary_settings.providers.free'), requiresApiKey: false, defaultUrl: '/api/dictionary/v2/entries/en' },
        { id: 'local', name: '本地词典文件', requiresApiKey: false, defaultUrl: '' },
        { id: 'merriam-webster', name: t('dictionary_settings.providers.merriam'), requiresApiKey: true, defaultUrl: 'https://www.dictionaryapi.com/api/v3/references/collegiate/json' },
        { id: 'oxford', name: t('dictionary_settings.providers.oxford'), requiresApiKey: true, defaultUrl: 'https://od-api.oxforddictionaries.com/api/v2/entries/en-gb' },
        { id: 'custom', name: t('dictionary_settings.providers.custom'), requiresApiKey: false, defaultUrl: '' }
    ];

    const currentProvider = dictionaryProviders.find(p => p.id === (settings.dictionaryApiProvider || 'free'));

    const handleLocalDictionaryUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    // 这里可以添加解析词典文件的逻辑
                    onSettingChange('localDictionaryFile', file.name);
                    onSettingChange('localDictionaryContent', content);
                    setConnectionResult({
                        success: true,
                        message: `本地词典文件 "${file.name}" 已成功加载`
                    });
                } catch (error) {
                    setConnectionResult({
                        success: false,
                        message: `解析词典文件失败: ${error.message}`
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    const testDictionaryConnection = async () => {
        setTestingConnection(true);
        setConnectionResult(null);
        try {
            DictionaryService.configure({
                apiProvider: settings.dictionaryApiProvider || 'free',
                apiKey: settings.dictionaryApiKey || '',
                baseURL: settings.dictionaryBaseURL || currentProvider?.defaultUrl,
                customEndpoint: settings.dictionaryCustomEndpoint || ''
            });
            const result = await DictionaryService.getWordDefinition('hello');
            if (result && result.meanings && result.meanings.length > 0) {
                setConnectionResult({ 
                    success: true, 
                    message: t('dictionary_settings.test_success'), 
                    word: 'hello', 
                    definition: result.meanings[0].definitions[0]?.definition || 'Definition found'
                });
            } else {
                setConnectionResult({ success: false, message: t('dictionary_settings.test_fail_no_results') });
            }
        } catch (error) {
            setConnectionResult({ success: false, message: error.message || t('dictionary_settings.test_fail') });
        } finally {
            setTestingConnection(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                <Book className="w-8 h-8 mr-4 text-indigo-600" />
                {t('dictionary_settings.title')}
            </h1>

            <SettingsSection title={t('dictionary_settings.service_config')} description={t('dictionary_settings.service_config_desc')}>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('dictionary_settings.provider')}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">选择词典查询服务提供商</p>
                    </div>
                    <select
                        value={settings.dictionaryApiProvider || 'free'}
                        onChange={(e) => onSettingChange('dictionaryApiProvider', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                    >
                        {dictionaryProviders.map(provider => (
                            <option key={provider.id} value={provider.id}>
                                {provider.name} {provider.requiresApiKey ? '🔑' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {settings.dictionaryApiProvider === 'local' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">本地词典文件</label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="file"
                                    accept=".json,.txt,.csv"
                                    onChange={handleLocalDictionaryUpload}
                                    className="hidden"
                                    id="local-dictionary-upload"
                                />
                                <label
                                    htmlFor="local-dictionary-upload"
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    选择词典文件
                                </label>
                                {settings.localDictionaryFile && (
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <FileText className="w-4 h-4 mr-1" />
                                        {settings.localDictionaryFile}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                支持的文件格式：JSON、TXT、CSV。词典文件应包含单词和释义的映射关系。
                            </p>
                        </div>
                    </div>
                )}

                {currentProvider?.requiresApiKey && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('dictionary_settings.api_key')}</label>
                        <div className="relative">
                            <input
                                type={showApiKey ? 'text' : 'password'}
                                value={settings.dictionaryApiKey || ''}
                                onChange={(e) => onSettingChange('dictionaryApiKey', e.target.value)}
                                placeholder={t('dictionary_settings.api_key_placeholder', { provider: currentProvider.name })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                            />
                            <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showApiKey ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('dictionary_settings.api_endpoint')}</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="url"
                            value={settings.dictionaryBaseURL || ''}
                            onChange={(e) => onSettingChange('dictionaryBaseURL', e.target.value)}
                            placeholder={currentProvider?.defaultUrl || t('dictionary_settings.api_endpoint_placeholder')}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 placeholder-gray-400"
                        />
                        <button
                            onClick={testDictionaryConnection}
                            disabled={testingConnection}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors whitespace-nowrap"
                        >
                            {testingConnection ? '测试中' : '测试'}
                        </button>
                    </div>
                </div>

                {settings.dictionaryApiProvider === 'custom' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('dictionary_settings.custom_endpoint')}</label>
                        <input
                            type="text"
                            value={settings.dictionaryCustomEndpoint || ''}
                            onChange={(e) => onSettingChange('dictionaryCustomEndpoint', e.target.value)}
                            placeholder={t('dictionary_settings.custom_endpoint_placeholder')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('dictionary_settings.custom_endpoint_desc')}</p>
                    </div>
                )}

                {/* 测试结果显示 */}
                {connectionResult && (
                    <div className={`p-3 rounded-lg text-sm ${connectionResult.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`}>
                        <p className="font-medium">{connectionResult.success ? '✅ ' : '❌ '} {connectionResult.message}</p>
                        {connectionResult.definition && (
                            <div className="text-xs mt-2">
                                <p className="font-medium">Test definition for "{connectionResult.word}":</p>
                                <p className="mt-1 italic">"{connectionResult.definition}"</p>
                            </div>
                        )}
                    </div>
                )}
            </SettingsSection>

            <SettingsSection title={t('dictionary_settings.lookup_behavior')} description={t('dictionary_settings.lookup_behavior_desc')}>
                <ToggleSwitch
                    checked={settings.autoLookup !== false}
                    onChange={(checked) => onSettingChange('autoLookup', checked)}
                    label={t('dictionary_settings.auto_lookup')}
                    description={t('dictionary_settings.auto_lookup_desc')}
                />
                <ToggleSwitch
                    checked={settings.showPhonetics !== false}
                    onChange={(checked) => onSettingChange('showPhonetics', checked)}
                    label={t('dictionary_settings.show_phonetics')}
                    description={t('dictionary_settings.show_phonetics_desc')}
                />
                <ToggleSwitch
                    checked={settings.showExamples !== false}
                    onChange={(checked) => onSettingChange('showExamples', checked)}
                    label={t('dictionary_settings.show_examples')}
                    description={t('dictionary_settings.show_examples_desc')}
                />
            </SettingsSection>
        </div>
    );
};

export default DictionarySettings;

