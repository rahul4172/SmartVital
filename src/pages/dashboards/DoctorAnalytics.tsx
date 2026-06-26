import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function DoctorAnalytics() {
  const [patients, setPatients] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, alertsRes] = await Promise.all([
          api.get('/doctor/my-patients'),
          api.get('/alerts')
        ]);
        setPatients(patientsRes.data);
        setAlerts(alertsRes.data);
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Analytics logic
  const totalPatients = patients.length;
  const highRiskCount = patients.filter(p => p.risk === 'high').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Patient Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Visualize clinic performance and population health metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ClayCard className="p-6 text-center">
          <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Total Patients</p>
          <p className="text-4xl font-bold text-[var(--text-primary)] mt-2">{totalPatients}</p>
        </ClayCard>
        
        <ClayCard className="p-6 text-center">
          <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">High Risk Cohort</p>
          <p className="text-4xl font-bold text-[var(--danger)] mt-2">{highRiskCount}</p>
        </ClayCard>

        <ClayCard className="p-6 text-center">
          <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Active Alerts</p>
          <p className="text-4xl font-bold text-[var(--warning)] mt-2">{activeAlerts}</p>
        </ClayCard>

        <ClayCard className="p-6 text-center">
          <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">IoT Adoption</p>
          <p className="text-4xl font-bold text-[var(--success)] mt-2">
            {totalPatients > 0 ? Math.round((Math.min(totalPatients, 12) / totalPatients) * 100) : 0}%
          </p>
        </ClayCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClayCard className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">Risk Distribution</h2>
          <div className="flex h-48 items-end gap-2 px-4 border-b border-gray-200 pb-2">
            {/* Simple bar chart mock */}
            <div className="flex-1 flex flex-col justify-end items-center group">
              <span className="text-xs font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {patients.filter(p => p.risk === 'low' || !p.risk).length}
              </span>
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: `${Math.max(10, (patients.filter(p => p.risk === 'low' || !p.risk).length / (totalPatients || 1)) * 100)}%` }} 
                className="w-full bg-[var(--success)] rounded-t-sm" 
              />
              <span className="text-xs font-bold text-[var(--text-secondary)] mt-2">Low</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center group">
              <span className="text-xs font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {patients.filter(p => p.risk === 'medium').length}
              </span>
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: `${Math.max(10, (patients.filter(p => p.risk === 'medium').length / (totalPatients || 1)) * 100)}%` }} 
                className="w-full bg-[var(--warning)] rounded-t-sm" 
              />
              <span className="text-xs font-bold text-[var(--text-secondary)] mt-2">Medium</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center group">
              <span className="text-xs font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {highRiskCount}
              </span>
              <motion.div 
                initial={{ height: 0 }} 
                animate={{ height: `${Math.max(10, (highRiskCount / (totalPatients || 1)) * 100)}%` }} 
                className="w-full bg-[var(--danger)] rounded-t-sm" 
              />
              <span className="text-xs font-bold text-[var(--text-secondary)] mt-2">High</span>
            </div>
          </div>
        </ClayCard>

        <ClayCard className="p-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6">Patient Onboarding Trend</h2>
          <div className="flex h-48 items-end gap-2 px-4 border-b border-gray-200 pb-2">
            {/* Simple bar chart mock showing timeline */}
            {[12, 19, 15, 25, 22, 30].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
                <span className="text-xs font-bold text-gray-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{val}</span>
                <motion.div 
                  initial={{ height: 0 }} 
                  animate={{ height: `${(val / 30) * 100}%` }} 
                  className="w-full bg-[var(--primary)] rounded-t-sm" 
                />
                <span className="text-[10px] text-[var(--text-secondary)] mt-2">M{idx+1}</span>
              </div>
            ))}
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
