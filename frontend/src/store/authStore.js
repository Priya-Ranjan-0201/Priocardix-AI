import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('pulseiq_user')) || null,
  isAuthenticated: !!localStorage.getItem('pulseiq_user'),

  loginSuccess: (userData) => {
    localStorage.setItem('pulseiq_user', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('pulseiq_user');
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
