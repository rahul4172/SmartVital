import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { PageTransition } from './PageTransition';
import { useUiStore } from '../../store/ui.store';
import { useAuthStore } from '../../store/auth.store';
import { EmergencyAlert } from '../ui/EmergencyAlert';
import { AIChat } from '../AIAssistant/AIChat';

export function MainLayout() {
  const toggleSidebar = useUiStore(state => state.toggleSidebar);
  const theme = useUiStore(state => state.theme);
  const user = useAuthStore(state => state.user);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
    } else {
      // system
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-transparent flex relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-cyan-500/10 blur-[100px] animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-cyan-400/10 dark:bg-blue-500/10 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] rounded-full bg-purple-500/10 dark:bg-purple-500/10 blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <EmergencyAlert />
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Top Header */}
        <header className="lg:hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-cyan-500/30">
              <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover scale-[1.15]" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">SmartVital</span>
          </div>
          <button 
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </header>

        {/* Desktop Header area / Breadcrumbs could go here */}
        <div className="hidden lg:flex h-16 bg-transparent items-center justify-end px-8">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
          <div className="max-w-7xl mx-auto">
            <React.Suspense fallback={<div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div></div>}>
              <AnimatePresence mode="wait">
                <PageTransition key={window.location.pathname}>
                  <Outlet />
                </PageTransition>
              </AnimatePresence>
            </React.Suspense>
          </div>
        </div>
      </main>

      {/* Global AI Chat Assistant */}
      <AIChat />
    </div>
  );
}
