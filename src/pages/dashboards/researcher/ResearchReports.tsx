import React from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayButton } from '../../../components/ui/ClayButton';
import { FileText, Download, Plus, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const mockReports = [
  { title: 'Q2 2024 Population Health Summary', date: 'June 30, 2024', type: 'Quarterly Review', size: '2.4 MB' },
  { title: 'Diabetes Cohort Efficacy Study', date: 'May 15, 2024', type: 'Clinical Study', size: '1.8 MB' },
  { title: 'AI Model Drift Analysis (Heart Disease)', date: 'April 02, 2024', type: 'Model Analytics', size: '3.1 MB' },
  { title: 'Annual Stroke Risk Demographic Shift', date: 'December 31, 2023', type: 'Annual Report', size: '4.5 MB' },
];

export function ResearchReports() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Research Reports</h1>
          <p className="text-[var(--text-secondary)] mt-1">Generate, save, and export comprehensive findings and analytics.</p>
        </div>
        
        <ClayButton className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white">
          <Plus size={18} />
          Generate New Report
        </ClayButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReports.map((report, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
            <ClayCard className="p-6 h-full flex flex-col group hover:border-purple-200 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              
              <h3 className="font-bold text-lg text-slate-800 mb-2">{report.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <span className="px-2 py-1 bg-slate-100 rounded-md font-semibold text-xs">{report.type}</span>
              </div>
              
              <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {report.date}</span>
                  <span className="font-mono text-xs">{report.size}</span>
                </div>
                
                <button className="w-full py-2.5 flex items-center justify-center gap-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg font-bold transition-colors mt-4 opacity-0 group-hover:opacity-100">
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </ClayCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
