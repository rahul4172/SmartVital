import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../../components/ui/ClayCard';
import { ClayButton } from '../../../components/ui/ClayButton';
import { Database, Download, Search, Filter, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../../../api/axios';

const mockDataset = [
  { id: '109x8', age: 45, gender: 'M', bmi: 28.5, bp: '120/80', glucose: 95, target: 'Heart' },
  { id: '112y3', age: 62, gender: 'F', bmi: 31.2, bp: '145/90', glucose: 135, target: 'Diabetes' },
  { id: '204z1', age: 55, gender: 'M', bmi: 26.0, bp: '130/85', glucose: 105, target: 'None' },
  { id: '315a9', age: 71, gender: 'F', bmi: 24.5, bp: '150/95', glucose: 110, target: 'Stroke' },
  { id: '402b4', age: 38, gender: 'M', bmi: 29.8, bp: '115/75', glucose: 90, target: 'None' },
  { id: '551c7', age: 48, gender: 'F', bmi: 35.1, bp: '140/88', glucose: 145, target: 'Diabetes' },
  { id: '612d2', age: 66, gender: 'M', bmi: 27.4, bp: '135/85', glucose: 115, target: 'Heart' },
  { id: '789e5', age: 52, gender: 'F', bmi: 22.9, bp: '118/78', glucose: 88, target: 'None' },
];

export function AnonymizedDataset() {
  const [dataset, setDataset] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const res = await api.get('/researcher/dataset');
        setDataset(res.data);
      } catch (err) {
        console.error("Failed to fetch dataset", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataset();
  }, []);
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Anonymized Dataset</h1>
          <p className="text-[var(--text-secondary)] mt-1">Browse and export stripped clinical data for external research models.</p>
        </div>
        
        <ClayButton className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white">
          <Download size={18} />
          Export to CSV
        </ClayButton>
      </div>

      <ClayCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Database className="text-blue-500" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Clinical Records</h2>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{dataset.length} Rows</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search patient hash..." 
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-64 shadow-sm"
              />
            </div>
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 shadow-sm transition-colors flex items-center gap-2">
              <Filter size={18} />
              <span className="text-sm font-semibold">Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">Patient Hash</th>
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">Age</th>
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">Gender</th>
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">BMI</th>
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">BP (Sys/Dia)</th>
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">Glucose</th>
                <th className="py-4 px-6 text-sm font-bold tracking-wider text-gray-500 uppercase">Primary Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-500" />
                    Fetching anonymized records from database...
                  </td>
                </tr>
              ) : dataset.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-medium">
                    No clinical records found.
                  </td>
                </tr>
              ) : dataset.map((row, idx) => (
                <motion.tr 
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-blue-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      ***{row.id}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-700">{row.age}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.gender === 'M' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {row.gender}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">{row.bmi}</td>
                  <td className="py-4 px-6 font-medium text-slate-600">{row.bp}</td>
                  <td className="py-4 px-6 font-medium text-slate-600">{row.glucose} mg/dL</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      row.target === 'None' ? 'bg-green-100 text-green-700' :
                      row.target === 'Diabetes' ? 'bg-blue-100 text-blue-700' :
                      row.target === 'Heart' ? 'bg-red-100 text-red-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {row.target}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between text-sm text-gray-500 font-medium">
          <div>Showing 1 to {Math.min(8, dataset.length)} of {dataset.length} entries</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 bg-blue-50 text-blue-600 border-blue-200">1</button>
            <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">3</button>
            <span className="px-2 py-1">...</span>
            <button className="px-3 py-1 rounded border border-gray-200 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </ClayCard>
    </div>
  );
}
