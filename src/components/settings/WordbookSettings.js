import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookMarked } from 'lucide-react';
import ToggleSwitch from '../common/buttons/ToggleSwitch';
import SelectField from '../common/forms/SelectField';

const SettingsSection = ({ title, description, children }) => (
    <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            {children}
        </div>
    </div>
);

const WordbookSettings = ({ settings = {}, onSettingChange, wordbook = [] }) => {
    const { t } = useTranslation();

    const reviewMethods = [
        { id: 'spaced', name: t('wordbook_settings.review_methods.spaced'), description: t('wordbook_settings.review_methods.spaced_desc') },
        { id: 'random', name: t('wordbook_settings.review_methods.random'), description: t('wordbook_settings.review_methods.random_desc') },
        { id: 'sequential', name: t('wordbook_settings.review_methods.sequential'), description: t('wordbook_settings.review_methods.sequential_desc') },
        { id: 'difficulty', name: t('wordbook_settings.review_methods.difficulty'), description: t('wordbook_settings.review_methods.difficulty_desc') }
    ];

    const reviewIntervals = [
        { id: 'daily', name: t('wordbook_settings.review_intervals.daily') },
        { id: 'every2days', name: t('wordbook_settings.review_intervals.every2days') },
        { id: 'weekly', name: t('wordbook_settings.review_intervals.weekly') },
        { id: 'custom', name: t('wordbook_settings.review_intervals.custom') }
    ];

    const wordbookStats = {
        total: wordbook.length,
        mastered: wordbook.filter(w => w.status === 'mastered').length,
        learning: wordbook.filter(w => w.status === 'learning').length,
        new: wordbook.filter(w => w.status === 'new' || !w.status).length
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                <BookMarked className="w-8 h-8 mr-4 text-indigo-600" />
                {t('wordbook_settings.title')}
            </h1>

            <SettingsSection title={t('wordbook_settings.stats')} description={t('wordbook_settings.stats_desc')}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wordbookStats.total}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('wordbook_settings.total_words')}</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{wordbookStats.mastered}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('wordbook_settings.mastered')}</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{wordbookStats.learning}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('wordbook_settings.learning')}</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{wordbookStats.new}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('wordbook_settings.new_words')}</p>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title={t('wordbook_settings.review_plan')} description={t('wordbook_settings.review_plan_desc')}>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('wordbook_settings.review_method')}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">选择复习方法和算法</p>
                    </div>
                    <select
                        value={settings.reviewMethod || 'spaced'}
                        onChange={(e) => onSettingChange('reviewMethod', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                    >
                        {reviewMethods.map(method => (
                            <option key={method.id} value={method.id}>
                                {method.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('wordbook_settings.review_frequency')}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">设置复习频率</p>
                    </div>
                    <select
                        value={settings.reviewInterval || 'daily'}
                        onChange={(e) => onSettingChange('reviewInterval', e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 min-w-[160px]"
                    >
                        {reviewIntervals.map(interval => (
                            <option key={interval.id} value={interval.id}>
                                {interval.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {settings.reviewInterval === 'custom' && (
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('wordbook_settings.custom_interval')}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">自定义复习间隔（小时）</p>
                        </div>
                        <input
                            type="number" min="1" max="720"
                            value={settings.customReviewInterval || 24}
                            onChange={(e) => onSettingChange('customReviewInterval', parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 min-w-[160px]"
                            placeholder="24"
                        />
                    </div>
                )}
            </SettingsSection>

            <SettingsSection title={t('wordbook_settings.daily_goal')} description={t('wordbook_settings.daily_goal_desc')}>
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('wordbook_settings.daily_review_target')}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('wordbook_settings.daily_review_target_desc')}</p>
                    </div>
                    <input
                        type="number" min="5" max="100"
                        value={settings.dailyReviewTarget || 20}
                        onChange={(e) => onSettingChange('dailyReviewTarget', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 min-w-[160px]"
                    />
                </div>
                
                <div className="flex items-center justify-between py-3">
                    <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('wordbook_settings.daily_new_words_target')}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('wordbook_settings.daily_new_words_target_desc')}</p>
                    </div>
                    <input
                        type="number" min="5" max="50"
                        value={settings.dailyNewWordsTarget || 10}
                        onChange={(e) => onSettingChange('dailyNewWordsTarget', parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 min-w-[160px]"
                    />
                </div>
            </SettingsSection>

            <SettingsSection title={t('wordbook_settings.learning_behavior')} description={t('wordbook_settings.learning_behavior_desc')}>
                <ToggleSwitch
                    checked={settings.autoAddToWordbook !== false}
                    onChange={(checked) => onSettingChange('autoAddToWordbook', checked)}
                    label={t('wordbook_settings.auto_add_to_wordbook')}
                    description={t('wordbook_settings.auto_add_to_wordbook_desc')}
                />
                <ToggleSwitch
                    checked={settings.showMasteryHints !== false}
                    onChange={(checked) => onSettingChange('showMasteryHints', checked)}
                    label={t('wordbook_settings.show_mastery_hints')}
                    description={t('wordbook_settings.show_mastery_hints_desc')}
                />
                <ToggleSwitch
                    checked={settings.reviewReminders !== false}
                    onChange={(checked) => onSettingChange('reviewReminders', checked)}
                    label={t('wordbook_settings.review_reminders')}
                    description={t('wordbook_settings.review_reminders_desc')}
                />
            </SettingsSection>


        </div>
    );
};

export default WordbookSettings;

