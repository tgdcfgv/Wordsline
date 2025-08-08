// 本地存储服务 - 替代Firebase
export class LocalStorageService {
  static generateUserId() {
    let userId = localStorage.getItem('rect-words-user-id');
    if (!userId) {
      userId = 'local-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('rect-words-user-id', userId);
    }
    return userId;
  }

  static getUserId() {
    return this.generateUserId();
  }
}

// 简化的认证服务 - 仅用于本地用户
export class AuthService {
  static getCurrentUser() {
    return {
      uid: LocalStorageService.getUserId(),
      isAnonymous: true
    };
  }

  static onAuthStateChanged(callback) {
    // 立即调用回调，模拟已登录状态
    setTimeout(() => {
      callback(this.getCurrentUser());
    }, 0);
    
    // 返回一个取消订阅函数
    return () => {};
  }

  static signOut() {
    // 本地应用不需要登出
    return Promise.resolve();
  }
}

// 导出服务
const localServices = {
  AuthService,
  LocalStorageService
};

export default localServices;
