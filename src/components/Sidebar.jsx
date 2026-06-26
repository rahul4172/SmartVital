import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Activity, HeartPulse, Droplets, Wind, 
  Clock, GitMerge, Settings, X 
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ isOpen, closeMenu }) {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'IoT Stream', path: '/iot', icon: Activity },
    { name: 'Heart Disease', path: '/heart', icon: HeartPulse },
    { name: 'Stroke', path: '/stroke', icon: Activity },
    { name: 'Diabetes', path: '/diabetes', icon: Droplets },
    { name: 'Lung Cancer', path: '/lung', icon: Wind },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'Comorbidity', path: '/comorbidity', icon: GitMerge },
    { name: 'Simulator', path: '/simulator', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 z-50 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              SmartVital
            </h1>
            <button className="lg:hidden text-white" onClick={closeMenu}>
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if(window.innerWidth < 1024) closeMenu();
                }}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-emerald-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
