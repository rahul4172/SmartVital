import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { Activity, Heart, Brain, Droplets, Wind, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DoctorRiskOverview() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctor/my-patients');
        setPatients(res.data);
      } catch (err) {
        toast.error('Failed to load patient risk data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const highRiskPatients = patients.filter(p => p.risk === 'high');
  const mediumRiskPatients = patients.filter(p => p.risk === 'medium');
  const lowRiskPatients = patients.filter(p => p.risk === 'low' || !p.risk);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Patient Risk Overview</h1>
          <p className="text-[var(--text-secondary)] mt-1">Aggregate AI risk analysis across your entire patient cohort.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClayCard className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-900/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">High Risk Cohort</p>
              <h2 className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">{highRiskPatients.length}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-200 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-4">Requires immediate review</p>
        </ClayCard>

        <ClayCard className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-900/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">Medium Risk Cohort</p>
              <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">{mediumRiskPatients.length}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-200 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80 mt-4">Monitor closely</p>
        </ClayCard>

        <ClayCard className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-900/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">Low Risk Cohort</p>
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">{lowRiskPatients.length}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
              <Activity size={20} />
            </div>
          </div>
          <p className="text-xs text-green-600/80 dark:text-green-400/80 mt-4">Stable condition</p>
        </ClayCard>
      </div>

      <ClayCard className="p-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">High Priority Patients</h2>
        
        {highRiskPatients.length === 0 ? (
          <div className="text-center py-10 text-[var(--text-secondary)]">
            No high risk patients currently identified by the AI.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[var(--text-muted)] text-sm uppercase tracking-wider">
                  <th className="pb-3 font-bold">Patient</th>
                  <th className="pb-3 font-bold">Primary Risk Area</th>
                  <th className="pb-3 font-bold">Risk Level</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {highRiskPatients.map((p, idx) => (
                  <motion.tr 
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.full_name}`} alt={p.full_name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">{p.full_name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">ID: {p._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                        <Heart size={16} /> Cardiovascular
                      </div>
                    </td>
                    <td className="py-4">
                      <RiskBadge risk={p.risk || 'high'} size="sm" />
                    </td>
                    <td className="py-4 text-right">
                      <Link to="/doctor/explainability" className="inline-flex items-center gap-1 text-[var(--primary)] font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-[var(--primary-soft)] transition-colors">
                        View Details <ChevronRight size={16} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ClayCard>
    </div>
  );
}
