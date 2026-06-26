import { create } from 'zustand';

interface UiState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  isAIChatOpen: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  toggleAIChat: () => void;
  setAIChatOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'system',
  sidebarOpen: false,
  isAIChatOpen: false,
  setTheme: (theme) => set({ theme }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleAIChat: () => set((state) => ({ isAIChatOpen: !state.isAIChatOpen })),
  setAIChatOpen: (open) => set({ isAIChatOpen: open })
}));
