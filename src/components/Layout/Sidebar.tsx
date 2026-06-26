import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/auth.store';
import { useUiStore } from '../../store/ui.store';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  Home, User, Activity, Clock, Bell, Heart, Brain, Droplets, Wind, Zap,
  Search, Link as LinkIcon, Sliders, TrendingUp, FileText, Pill, FileBox,
  Stethoscope, Calendar, Video, Smartphone, Settings, LogOut, ChevronLeft, ChevronRight,
  Sun, Moon, Shield, Users, Database, BarChart2, FileDigit, Cpu, UserCog, CheckSquare, List, MessageSquare
} from 'lucide-react';

export function Sidebar() {
  const { user, role, clearAuth } = useAuthStore();
  const { sidebarOpen, toggleSidebar, theme, setTheme, toggleAIChat } = useUiStore();
  const navigate = useNavigate();
  
  // Local state for desktop collapse
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    } finally {
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getNavSections = () => {
    if (role === 'patient') {
      return [
        {
          header: 'Overview',
          items: [
            { name: 'Dashboard', path: '/patient/dashboard', icon: <Home size={20} /> },
            { name: 'My Profile', path: '/patient/profile', icon: <User size={20} /> }
          ]
        },
        {
          header: 'Health Monitoring',
          items: [
            { name: 'Live Monitoring', path: '/patient/monitoring', icon: <Activity size={20} /> },
            { name: 'Symptom Checker', path: '/patient/symptoms', icon: <Activity size={20} /> },
            { name: 'Vitals History', path: '/patient/vitals', icon: <Activity size={20} /> },
            { name: 'Health Timeline', path: '/patient/timeline', icon: <Clock size={20} /> },
            { name: 'My Alerts', path: '/patient/alerts', icon: <Bell size={20} /> }
          ]
        },
        {
          header: 'Disease Predictions',
          items: [
            { name: 'Heart Disease Risk', path: '/patient/predictions/heart', icon: <Heart size={20} /> },
            { name: 'Stroke Risk', path: '/patient/predictions/stroke', icon: <Brain size={20} /> },
            { name: 'Diabetes Risk', path: '/patient/predictions/diabetes', icon: <Droplets size={20} /> },
            { name: 'Lung Cancer Risk', path: '/patient/predictions/lung', icon: <Wind size={20} /> }
          ]
        },
        {
          header: 'AI Intelligence',
          items: [
            { name: 'Explainable AI', path: '/patient/explainability', icon: <Search size={20} /> },
            { name: 'Comorbidity Engine', path: '/patient/comorbidity', icon: <LinkIcon size={20} /> },
            { name: 'What-If Simulator', path: '/patient/simulator', icon: <Sliders size={20} /> },
            { name: 'Risk Forecasting', path: '/patient/forecast', icon: <TrendingUp size={20} /> }
          ]
        },
        {
          header: 'Medical Records',
          items: [
            { name: 'Health Summary', path: '/patient/summary', icon: <FileText size={20} /> },
            { name: 'Medications Tracker', path: '/patient/medications', icon: <Pill size={20} /> },
            { name: 'Lab Results', path: '/patient/labs', icon: <FileBox size={20} /> },
            { name: 'Reports', path: '/patient/reports', icon: <FileDigit size={20} /> }
          ]
        },
        {
          header: 'Connected Care',
          items: [
            { name: 'My Doctor', path: '/patient/doctor', icon: <Stethoscope size={20} /> },
            { name: 'Appointments', path: '/patient/appointments', icon: <Calendar size={20} /> },
            { name: 'Teleconsult', path: '/patient/teleconsult', icon: <Video size={20} /> }
          ]
        },
        {
          header: 'Devices',
          items: [
            { name: 'My Devices', path: '/patient/devices', icon: <Smartphone size={20} /> },
            { name: 'Device Setup', path: '/patient/devices/setup', icon: <Settings size={20} /> }
          ]
        }
      ];
    } else if (role === 'doctor') {
      return [
        {
          header: 'Overview',
          items: [
            { name: 'Doctor Dashboard', path: '/doctor/dashboard', icon: <Home size={20} /> },
            { name: 'My Profile', path: '/doctor/profile', icon: <User size={20} /> }
          ]
        },
        {
          header: 'Patient Care',
          items: [
            { name: 'All Patients', path: '/doctor/patients', icon: <Users size={20} /> },
            { name: 'Patient Messages', path: '/doctor/messages', icon: <MessageSquare size={20} /> },
            { name: 'Critical Alerts', path: '/doctor/alerts', icon: <Bell size={20} /> },
            { name: 'Clinical Notes', path: '/doctor/notes', icon: <FileText size={20} /> },
            { name: 'Prescriptions', path: '/doctor/prescriptions', icon: <Pill size={20} /> },
            { name: 'Appointments', path: '/doctor/appointments', icon: <Calendar size={20} /> }
          ]
        },
        {
          header: 'AI Insights',
          items: [
            { name: 'Patient Risk Overview', path: '/doctor/risk-overview', icon: <Activity size={20} /> },
            { name: 'Explainable AI Viewer', path: '/doctor/explainability', icon: <Search size={20} /> },
            { name: 'Comorbidity Viewer', path: '/doctor/comorbidity', icon: <LinkIcon size={20} /> }
          ]
        },
        {
          header: 'Reports',
          items: [
            { name: 'Generate Reports', path: '/doctor/reports', icon: <FileDigit size={20} /> },
            { name: 'Patient Analytics', path: '/doctor/analytics', icon: <BarChart2 size={20} /> }
          ]
        }
      ];
    } else if (role === 'admin') {
      return [
        {
          header: 'Overview',
          items: [
            { name: 'Admin Dashboard', path: '/admin/dashboard', icon: <Home size={20} /> }
          ]
        },
        {
          header: 'User Management',
          items: [
            { name: 'All Users', path: '/admin/users', icon: <Users size={20} /> },
            { name: 'Doctors', path: '/admin/doctors', icon: <Stethoscope size={20} /> },
            { name: 'Patients', path: '/admin/patients', icon: <User size={20} /> },
            { name: 'Researchers', path: '/admin/researchers', icon: <Database size={20} /> }
          ]
        },
        {
          header: 'System',
          items: [
            { name: 'Devices', path: '/admin/devices', icon: <Smartphone size={20} /> },
            { name: 'System Health', path: '/admin/system-health', icon: <Activity size={20} /> },
            { name: 'Audit Logs', path: '/admin/audit-logs', icon: <List size={20} /> },
            { name: 'Permissions', path: '/admin/permissions', icon: <Shield size={20} /> }
          ]
        },
        {
          header: 'Analytics',
          items: [
            { name: 'Platform Analytics', path: '/admin/analytics', icon: <BarChart2 size={20} /> },
            { name: 'AI Model Performance', path: '/admin/model-performance', icon: <Cpu size={20} /> },
            { name: 'Population Insights', path: '/admin/population', icon: <TrendingUp size={20} /> }
          ]
        }
      ];
    } else if (role === 'researcher') {
      return [
        {
          header: 'Overview',
          items: [
            { name: 'Research Dashboard', path: '/researcher/dashboard', icon: <Home size={20} /> }
          ]
        },
        {
          header: 'Analytics',
          items: [
            { name: 'Population Risk Trends', path: '/researcher/population', icon: <TrendingUp size={20} /> },
            { name: 'Disease Correlations', path: '/researcher/correlations', icon: <LinkIcon size={20} /> },
            { name: 'Feature Importance', path: '/researcher/features', icon: <BarChart2 size={20} /> },
            { name: 'Cohort Analysis', path: '/researcher/cohorts', icon: <Users size={20} /> },
            { name: 'Research Predictions', path: '/researcher/predictions', icon: <Activity size={20} /> }
          ]
        },
        {
          header: 'Data',
          items: [
            { name: 'Anonymized Dataset', path: '/researcher/dataset', icon: <Database size={20} /> },
            { name: 'Research Reports', path: '/researcher/reports', icon: <FileText size={20} /> }
          ]
        }
      ];
    }
    
    return [{ header: 'Overview', items: [{ name: 'Dashboard', path: `/${role}/dashboard`, icon: <Home size={20} /> }] }];
  };

  const navSections = getNavSections();
  const sidebarWidth = isCollapsed ? 'w-[72px]' : 'w-[280px]';

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <motion.aside
        initial={false}
        animate={{ width: window.innerWidth >= 1024 ? (isCollapsed ? 72 : 280) : 280, x: sidebarOpen || window.innerWidth >= 1024 ? 0 : '-100%' }}
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col shrink-0 shadow-2xl lg:shadow-none transition-all duration-300 ${sidebarWidth}`}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 h-[72px] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.5)] bg-slate-900 border border-cyan-500/30">
              <img src="/favicon.png" alt="Logo" className="w-full h-full object-cover scale-[1.35]" />
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h1 className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 leading-tight drop-shadow-sm">SmartVital</h1>
                <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-400 tracking-widest opacity-80">Clinical AI</span>
              </div>
            )}
          </div>
          
          <button onClick={toggleSidebar} className="lg:hidden ml-auto text-slate-500 dark:text-slate-400 p-1">
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {navSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              {!isCollapsed && (
                <div className="px-5 text-[11px] font-bold uppercase text-[var(--text-muted)] tracking-[0.08em] mb-2 truncate">
                  {section.header}
                </div>
              )}
              {isCollapsed && <div className="h-4"></div>}
              <div className="space-y-1 px-3">
                {section.items.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    title={isCollapsed ? link.name : undefined}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-all duration-300 group relative overflow-hidden
                      ${isActive 
                        ? 'text-cyan-600 dark:text-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Indicator Background */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-bg"
                            className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 rounded-full"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        {/* Neon Dot */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-dot"
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        <span className={`shrink-0 transition-colors z-10 ${isCollapsed ? 'mx-auto' : 'ml-2'}`}>{link.icon}</span>
                        {!isCollapsed && <span className="truncate z-10">{link.name}</span>}
                        
                        {/* Tooltip for collapsed mode */}
                        {isCollapsed && (
                          <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            {link.name}
                          </div>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-slate-200 dark:border-slate-800 p-3 space-y-2 shrink-0">
          {!isCollapsed && (
             <button 
               type="button"
               onClick={(e) => {
                 e.preventDefault();
                 window.dispatchEvent(new CustomEvent('toggle-ai-chat'));
               }}
               className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[var(--radius-md)] bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 font-bold text-sm hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-colors"
             >
               <Zap size={16} /> AI Copilot
             </button>
          )}

          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'} pt-2`}>
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>

          <div className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-[var(--radius-md)] border border-slate-100 dark:border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg uppercase shrink-0">
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0" title={user?.full_name || user?.email}>
                <p className="text-base font-bold text-slate-900 dark:text-white leading-tight break-words">
                  {user?.full_name || (user?.email ? user.email.split('@')[0] : 'User')}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-500 mt-0.5">{role}</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleCollapse} 
            className="hidden lg:flex w-full items-center justify-center py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
