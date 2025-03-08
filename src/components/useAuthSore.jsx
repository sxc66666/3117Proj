import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,  // ✅ 确保从 localStorage 读取
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user)); // ✅ 存储到 localStorage
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem("user"); // ✅ 清除 localStorage
    set({ user: null });
  }
}));

export default useAuthStore;
