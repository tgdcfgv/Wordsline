import React from 'react';
import { User } from 'lucide-react';

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

const AccountSettings = ({ userId }) => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
                <User className="w-8 h-8 mr-4 text-indigo-600" />
                账户信息
            </h1>

            <SettingsSection title="用户信息" description="查看您的账户基本信息">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2"><strong>用户 ID:</strong></p>
                    <p className="select-all font-mono bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        {userId || '加载中...'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        这是您的唯一用户标识符，用于数据同步和备份
                    </p>
                </div>
            </SettingsSection>
        </div>
    );
};

export default AccountSettings;