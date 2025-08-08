import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  BarChart3, 
  Star, 
  Settings, 
  Moon, 
  Sun 
} from 'lucide-react';
import { modules } from '../../constants/config';
import SidebarButton from '../common/buttons/SidebarButton';
import logoSrc from '/logo.svg';

const Sidebar = memo(({ activeModule, theme, onModuleChange, onThemeToggle }) => {
  const { t } = useTranslation();

  return (
    <nav className="w-24 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-5 px-2 shadow-lg z-20 transition-colors duration-300">
      <div className="mb-8">
        <img src={logoSrc} alt="Rect Words Logo" className="w-12 h-12" />
      </div>
      
      <div className="space-y-2 w-full">
        <SidebarButton 
          icon={BookOpen} 
          label={t('Library')} 
          isActive={activeModule === modules.LIBRARY || activeModule === modules.READER}
          onClick={() => onModuleChange(modules.LIBRARY)} 
        />
        
        <SidebarButton 
          icon={BarChart3} 
          label={t('Wordbook')} 
          isActive={activeModule === modules.WORDBOOK}
          onClick={() => onModuleChange(modules.WORDBOOK)} 
        />
        
        <SidebarButton 
          icon={Star} 
          label={t('Review')} 
          isActive={activeModule === modules.REVIEW}
          onClick={() => onModuleChange(modules.REVIEW)} 
        />
      </div>
      
      <div className="mt-auto space-y-2 w-full">
        <SidebarButton 
          icon={theme === 'light' ? Moon : Sun} 
          label={theme === 'light' ? t('Dark Mode') : t('Light Mode')} 
          onClick={onThemeToggle} 
        />
        
        <SidebarButton 
          icon={Settings} 
          label={t('Settings')} 
          onClick={() => onModuleChange(modules.SETTINGS)} 
        />
      </div>
    </nav>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
