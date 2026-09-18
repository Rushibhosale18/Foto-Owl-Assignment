import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (userData) => {
    await AsyncStorage.setItem('@user_session', JSON.stringify(userData));
    set({ user: userData, isAuthenticated: true });
  },
  logout: async () => {
    await AsyncStorage.removeItem('@user_session');
    set({ user: null, isAuthenticated: false });
  },
  loadSession: async () => {
    const session = await AsyncStorage.getItem('@user_session');
    if (session) {
      set({ user: JSON.parse(session), isAuthenticated: true });
    }
  },
}));
