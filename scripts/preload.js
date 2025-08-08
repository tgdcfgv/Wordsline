const { contextBridge, ipcRenderer } = require('electron');

// 暴露受保护的方法到渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取应用版本
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // 显示消息框
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // 菜单事件监听
  onMenuNewDocument: (callback) => ipcRenderer.on('menu-new-document', callback),
  onMenuImportData: (callback) => ipcRenderer.on('menu-import-data', callback),
  onMenuExportData: (callback) => ipcRenderer.on('menu-export-data', callback),
  
  // 文件夹操作 API
  selectFolder: (options) => ipcRenderer.invoke('select-folder', options),
  checkFolderExists: (folderPath) => ipcRenderer.invoke('check-folder-exists', folderPath),
  createFolder: (folderPath) => ipcRenderer.invoke('create-folder', folderPath),
  getDefaultDataPaths: () => ipcRenderer.invoke('get-default-data-paths'),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  
  // 移除监听器
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});
