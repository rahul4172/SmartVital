import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, HeartPulse, Wind, Droplets, ArrowRight } from 'lucide-react';

export default function Home() {
  const modules = [
    { name: 'Heart Disease', icon: HeartPulse, path: '/heart', color: 'text-red-400', bg: 'bg-red-400/10' },
    { name: 'Stroke Risk', icon: Activity, path: '/stroke', color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Diabetes', icon: Droplets, path: '/diabetes', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Lung Cancer', icon: Wind, path: '/lung', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
              Welcome to <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-glow leading-tight">SmartVital</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg sm:text-xl md:text-2xl font-medium max-w-2xl leading-relaxed">
              Next-generation AI-Powered Multi-Disease Early Detection System. Experience clinical precision with a futuristic interface.
            </p>
          </motion.div>
        </div>
        <Link 
          to="/iot" 
          className="flex shrink-0 items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 font-semibold hover:bg-cyan-500/30 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] mt-4 md:mt-0"
        >
          <Activity size={20} className="animate-pulse" />
          Live IoT Stream
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((mod, i) => (
          <motion.div
            key={mod.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link to={mod.path} className="block group">
              <motion.div 
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-6 group relative overflow-hidden cursor-pointer h-full flex flex-col"
              >
                {/* Subtle outer glow on hover */}
                <div className={`absolute -inset-0.5 ${mod.bg} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />
                
                {/* Animated corner background */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${mod.bg} rounded-bl-full -z-10 group-hover:scale-[2] transition-transform duration-700 ease-out`} />
                
                <div className={`${mod.color} mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <mod.icon size={48} strokeWidth={1.5} className="drop-shadow-lg" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight z-10">{mod.name}</h3>
                
                <div className="mt-auto pt-6 flex items-center text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors text-sm font-bold uppercase tracking-wider z-10">
                  Run Assessment <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] pointer-events-none transform rotate-12">
             <Activity size={200} />
           </div>
           <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">How it works</h3>
           <ul className="space-y-6 text-slate-600 dark:text-slate-300 text-lg">
             <li className="flex gap-4 group">
               <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-[inset_0_0_10px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500/20 transition-colors">1</span>
               <p><strong className="text-slate-900 dark:text-white">Input Data:</strong> Manually enter patient vitals or connect our IoT simulator to stream data in real-time.</p>
             </li>
             <li className="flex gap-4 group">
               <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-[inset_0_0_10px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500/20 transition-colors">2</span>
               <p><strong className="text-slate-900 dark:text-white">AI Analysis:</strong> Our tuned Machine Learning & Deep Learning models evaluate the risk probability instantly.</p>
             </li>
             <li className="flex gap-4 group">
               <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-[inset_0_0_10px_rgba(6,182,212,0.2)] group-hover:bg-cyan-500/20 transition-colors">3</span>
               <p><strong className="text-slate-900 dark:text-white">Explainability:</strong> SHAP and LIME algorithms highlight the exact features driving the prediction, ensuring clinical transparency.</p>
             </li>
           </ul>
        </div>
        <div className="glass-card bg-gradient-to-br from-indigo-500/5 to-purple-500/10 border-indigo-500/20 p-8 flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[50px] -z-10 group-hover:bg-purple-500/20 transition-colors duration-700" />
          
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Comorbidity Analysis</h3>
            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 leading-relaxed">Analyze cross-disease risk factors using our correlation engine. See how diabetes impacts heart risk and more.</p>
          </div>
          <Link to="/comorbidity" className="w-full py-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-center font-bold transition-all flex items-center justify-center gap-2 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-1">
            View Analytics <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
