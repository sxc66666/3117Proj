// src/store/useAuthStore.js
import { create } from 'zustand';  // 使用命名导入

const useAuthStore = create((set) => ({
  user: null,  // 初始化用户为空
  setUser: (user) => set({ user }),  // 设置用户信息
  clearUser: () => set({ user: null }),  // 清空用户信息
}));

export default useAuthStore;
