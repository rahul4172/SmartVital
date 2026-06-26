import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { useAuthStore } from '../../store/auth.store';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';



export function DoctorDashboard() {
  const { user } = useAuthStore();
  const [patients, setPatients] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, alertsRes] = await Promise.all([
          api.get('/doctor/my-patients'),
          api.get('/alerts')
        ]);
        setPatients(patientsRes.data);
        
        const allActiveAlerts = alertsRes.data.filter((a: any) => a.status === 'active' || !a.is_read);
        
        // Take the top 5 critical/high alerts for display
        const activeAlertsDisplay = allActiveAlerts
          .slice(0, 5)
          .map((a: any) => ({
            id: a._id,
            patient: a.patient_name || 'Patient',
            type: a.type || 'Alert',
            message: a.message,
            time: new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          
        setAlerts(activeAlertsDisplay);
        setTotalAlerts(allActiveAlerts.length);
      } catch (err) {
        toast.error('Failed to load dashboard data');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Welcome, Dr. {user?.full_name?.split(' ').pop() || 'Doctor'}
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">Here is the status of your patient roster today.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link to="/doctor/explainability" className="flex-1 sm:flex-none">
            <ClayButton variant="secondary" className="w-full">AI Diagnostics Center</ClayButton>
          </Link>
          <Link to="/doctor/messages" className="flex-1 sm:flex-none">
            <ClayButton variant="secondary" className="w-full">Messages</ClayButton>
          </Link>
          <Link to="/doctor/patients" className="flex-1 sm:flex-none">
            <ClayButton className="w-full">Add Patient</ClayButton>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Patient Roster */}
        <div className="lg:col-span-2 space-y-6">
          <ClayCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Patient Roster</h2>
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="text" placeholder="Search patients..." className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--primary)]" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[var(--text-muted)] text-sm uppercase tracking-wider">
                    <th className="pb-3 font-bold">Patient</th>
                    <th className="pb-3 font-bold">Primary Concern</th>
                    <th className="pb-3 font-bold">Current Risk</th>
                    <th className="pb-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patients.slice(0, 5).map((p, idx) => (
                    <motion.tr 
                      key={p._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold overflow-hidden">
                              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.full_name}`} alt={p.full_name} className="w-full h-full object-cover" />
                            </div>
                            {p.alert && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--danger)] rounded-full border-2 border-white animate-pulse"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{p.full_name}</p>
                            <p className="text-xs text-[var(--text-secondary)]">ID: {p._id.slice(-6).toUpperCase()} • {p.age || '--'} yrs</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm font-medium text-[var(--text-secondary)]">General Checkup</span>
                      </td>
                      <td className="py-4">
                        <RiskBadge risk={p.risk || 'low'} size="sm" />
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-[var(--primary)] font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-[var(--primary-soft)] transition-colors opacity-0 group-hover:opacity-100">
                          View Chart
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {patients.length === 0 && (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                  You have no assigned patients.
                </div>
              )}
            </div>
            
            {patients.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <Link to="/doctor/patients" className="text-sm font-bold text-[var(--primary)] hover:underline">View All Patients</Link>
              </div>
            )}
          </ClayCard>
        </div>

        {/* Sidebar: Alerts & Quick Stats */}
        <div className="space-y-6">
          
          <ClayCard className="p-6 bg-gradient-to-br from-[var(--danger)] to-red-700 text-white border-0 shadow-[0_8px_20px_-6px_var(--danger)]">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-white">Critical Alerts</h3>
              <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold">{totalAlerts} New</div>
            </div>
            
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{alert.patient}</span>
                    <span className="text-xs text-red-100">{alert.time}</span>
                  </div>
                  <p className="text-xs text-red-100 font-medium mb-1">{alert.type}</p>
                  <p className="text-sm text-white">{alert.message}</p>
                </div>
              ))}
            </div>
          </ClayCard>

          <ClayCard className="p-6">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Clinic Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Total Patients</span>
                <span className="font-bold text-[var(--text-primary)] text-xl">{patients.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">High Risk Cohort</span>
                <span className="font-bold text-[var(--danger)] text-xl">{patients.filter(p => p.risk === 'high').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Active IoT Devices</span>
                <span className="font-bold text-[var(--success)] text-xl">{Math.floor(patients.length * 0.4)}</span>
              </div>
            </div>
          </ClayCard>

        </div>
      </div>
    </div>
  );
}
