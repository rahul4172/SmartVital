import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bell, Shield, Save } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import toast from 'react-hot-toast';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user } = useAuthStore();
  const { theme, setTheme } = useUiStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    notifications: true
  });

  const handleSave = () => {
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully!');
      onClose();
    }, 800);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto h-[600px] md:h-[500px]"
            >
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/50 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 md:p-6 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                <div className="hidden md:flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg shrink-0">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">Settings</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </div>

                <TabButton 
                  active={activeTab === 'profile'} 
                  onClick={() => setActiveTab('profile')}
                  icon={<User size={18} />}
                  label="Profile"
                />
                <TabButton 
                  active={activeTab === 'preferences'} 
                  onClick={() => setActiveTab('preferences')}
                  icon={<Bell size={18} />}
                  label="Preferences"
                />
                <TabButton 
                  active={activeTab === 'security'} 
                  onClick={() => setActiveTab('security')}
                  icon={<Shield size={18} />}
                  label="Security"
                />
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 relative">
                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
                >
                  <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'profile' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h2>
                          <p className="text-sm text-slate-500 mt-1">Update your personal information and contact details.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input 
                              type="text" 
                              value={formData.fullName}
                              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                            <input 
                              type="email" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'preferences' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Preferences</h2>
                          <p className="text-sm text-slate-500 mt-1">Customize your app experience.</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">Dark Mode</p>
                              <p className="text-sm text-slate-500">Toggle dark theme</p>
                            </div>
                            <button 
                              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">Push Notifications</p>
                              <p className="text-sm text-slate-500">Receive alerts on devices</p>
                            </div>
                            <button 
                              onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.notifications ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'security' && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security</h2>
                          <p className="text-sm text-slate-500 mt-1">Manage your password and account security.</p>
                        </div>

                        <div className="space-y-4">
                          <button 
                            onClick={() => toast.success("Password reset instructions sent to your email")}
                            className="w-full text-left px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
                          >
                            <p className="font-bold text-slate-900 dark:text-white">Change Password</p>
                            <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                          </button>
                          
                          <button 
                            onClick={() => {
                              toast.error("Account deactivation is disabled in this environment.");
                            }}
                            className="w-full text-left px-4 py-3 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-900/30 rounded-xl transition-colors mt-8"
                          >
                            <p className="font-bold text-red-600 dark:text-red-400">Deactivate Account</p>
                            <p className="text-sm text-red-500/80">Temporarily disable your account</p>
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 mt-auto shrink-0">
                  <button 
                    onClick={onClose}
                    className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all w-full md:w-auto shrink-0 ${
        active 
          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
