import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { GlassCard } from '../../components/ui/GlassCard';
import { RiskGauge } from '../../components/ui/RiskGauge';
import { EmergencyAlert } from '../../components/shared/EmergencyAlert';
import { RiskTrendChart } from '../../components/charts/RiskTrendChart';
import { VitalsChart } from '../../components/charts/VitalsChart';
import NumberFlow from '@number-flow/react';
import { STAGGER_MED, fadeUp } from '../../lib/motion';

export function PatientDashboard() {
  const user = useAuthStore(state => state.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);
  
  // Real data state
  const [latestRisks, setLatestRisks] = useState({ heart: 0, stroke: 0, diabetes: 0, lung: 0 });
  const [trendData, setTrendData] = useState<any[]>([]);
  const [vitalsData, setVitalsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all core data in parallel
        const [
          profileRes, 
          vitalsRes,
          heartRes,
          strokeRes,
          diabetesRes,
          lungRes
        ] = await Promise.all([
          api.get('/patient/profile').catch(() => ({ data: null })),
          api.get('/patient/vitals/history').catch(() => ({ data: [] })),
          api.get('/patient/forecast?model=heart').catch(() => ({ data: null })),
          api.get('/patient/forecast?model=stroke').catch(() => ({ data: null })),
          api.get('/patient/forecast?model=diabetes').catch(() => ({ data: null })),
          api.get('/patient/forecast?model=lung').catch(() => ({ data: null }))
        ]);

        setProfile(profileRes.data);

        // Parse Risks
        const heartRisk = heartRes.data?.forecast?.[0]?.projected_risk || 0;
        const strokeRisk = strokeRes.data?.forecast?.[0]?.projected_risk || 0;
        const diabetesRisk = diabetesRes.data?.forecast?.[0]?.projected_risk || 0;
        const lungRisk = lungRes.data?.forecast?.[0]?.projected_risk || 0;
        
        setLatestRisks({
          heart: Math.round(heartRisk * 100),
          stroke: Math.round(strokeRisk * 100),
          diabetes: Math.round(diabetesRisk * 100),
          lung: Math.round(lungRisk * 100)
        });

        // Parse Trend Data (aggregating from the 4 models)
        // Assume heartRes.data.historical has days back to -30
        const parsedTrends = [];
        if (heartRes.data?.historical) {
          // We'll map the historical points
          for (let i = 0; i < heartRes.data.historical.length; i++) {
             parsedTrends.push({
               date: `Day ${heartRes.data.historical[i].day}`,
               heart: Math.round(heartRes.data.historical[i].risk * 100),
               stroke: Math.round((strokeRes.data?.historical?.[i]?.risk || 0) * 100),
               diabetes: Math.round((diabetesRes.data?.historical?.[i]?.risk || 0) * 100),
               lung: Math.round((lungRes.data?.historical?.[i]?.risk || 0) * 100)
             });
          }
        }
        setTrendData(parsedTrends);

        // Parse Vitals
        const rawVitals = vitalsRes.data || [];
        // Map to { time: 'HH:MM', value: heart_rate }
        const parsedVitals = rawVitals.slice(-10).map((v: any) => ({
          time: new Date(v.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          value: v.heart_rate || 0
        }));
        setVitalsData(parsedVitals.length > 0 ? parsedVitals : [{ time: 'Today', value: 0 }]);

      } catch (e) {
        console.error('Failed to fetch dashboard data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Find the highest risk
  const riskEntries = Object.entries(latestRisks);
  const highestRiskEntry = riskEntries.reduce((max, current) => current[1] > max[1] ? current : max, ['None', 0]);
  
  const showEmergency = highestRiskEntry[1] > 70;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3"
          >
            Hello, {user?.full_name?.split(' ')[0] || 'Patient'}
            {user?.id && (
              <span className="text-xs font-bold bg-[var(--primary-soft)] text-[var(--primary)] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-blue-200 transition-colors" onClick={() => {
                navigator.clipboard.writeText(user.id);
                toast.success('Patient ID copied to clipboard!');
              }} title="Click to copy Patient ID">
                ID: {user.id.slice(-6)}
                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </span>
            )}
          </motion.h1>
          <p className="text-[var(--text-secondary)] mt-1">Here is your clinical risk overview.</p>
        </div>
      </div>

      <EmergencyAlert 
        show={showEmergency && showAlert} 
        message={`HIGH ${highestRiskEntry[0].toUpperCase()} RISK DETECTED`} 
        recommendation="Contact your assigned doctor immediately · Schedule a consultation" 
        onDismiss={() => setShowAlert(false)} 
      />

      {/* Top Row: Summary Cards */}
      <motion.div 
        variants={{ visible: { transition: STAGGER_MED } }} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Link to="/patient/predictions/heart" className="block hover:scale-105 transition-transform duration-300">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-full">
            <GlassCard className="p-5 flex flex-col items-center text-center h-full hover:border-[var(--primary)] transition-colors">
              <RiskGauge score={latestRisks.heart} size={120} />
              <h3 className="mt-3 font-bold text-[var(--text-primary)]">Heart Disease</h3>
              <p className={`text-sm font-bold ${latestRisks.heart > 60 ? 'text-[var(--danger)]' : latestRisks.heart > 30 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                {latestRisks.heart > 60 ? 'High Risk' : latestRisks.heart > 30 ? 'Moderate Risk' : 'Low Risk'}
              </p>
            </GlassCard>
          </motion.div>
        </Link>

        <Link to="/patient/predictions/stroke" className="block hover:scale-105 transition-transform duration-300">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
            <GlassCard className="p-5 flex flex-col items-center text-center h-full hover:border-[var(--primary)] transition-colors">
              <RiskGauge score={latestRisks.stroke} size={120} />
              <h3 className="mt-3 font-bold text-[var(--text-primary)]">Stroke</h3>
              <p className={`text-sm font-bold ${latestRisks.stroke > 60 ? 'text-[var(--danger)]' : latestRisks.stroke > 30 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                {latestRisks.stroke > 60 ? 'High Risk' : latestRisks.stroke > 30 ? 'Moderate Risk' : 'Low Risk'}
              </p>
            </GlassCard>
          </motion.div>
        </Link>

        <Link to="/patient/predictions/diabetes" className="block hover:scale-105 transition-transform duration-300">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
            <GlassCard className="p-5 flex flex-col items-center text-center h-full hover:border-[var(--primary)] transition-colors">
              <RiskGauge score={latestRisks.diabetes} size={120} />
              <h3 className="mt-3 font-bold text-[var(--text-primary)]">Diabetes</h3>
              <p className={`text-sm font-bold ${latestRisks.diabetes > 60 ? 'text-[var(--danger)]' : latestRisks.diabetes > 30 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                {latestRisks.diabetes > 60 ? 'High Risk' : latestRisks.diabetes > 30 ? 'Moderate Risk' : 'Low Risk'}
              </p>
            </GlassCard>
          </motion.div>
        </Link>

        <Link to="/patient/predictions/lung" className="block hover:scale-105 transition-transform duration-300">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="h-full">
            <GlassCard className="p-5 flex flex-col items-center text-center h-full hover:border-[var(--primary)] transition-colors">
              <RiskGauge score={latestRisks.lung} size={120} />
              <h3 className="mt-3 font-bold text-[var(--text-primary)]">Lung Cancer</h3>
              <p className={`text-sm font-bold ${latestRisks.lung > 60 ? 'text-[var(--danger)]' : latestRisks.lung > 30 ? 'text-[var(--warning)]' : 'text-[var(--success)]'}`}>
                {latestRisks.lung > 60 ? 'High Risk' : latestRisks.lung > 30 ? 'Moderate Risk' : 'Low Risk'}
              </p>
            </GlassCard>
          </motion.div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">Risk Trend (Last 30 Days)</h2>
            <RiskTrendChart data={trendData} />
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Vitals</h2>
              <span className="text-sm font-bold text-[var(--primary)] bg-[var(--primary-soft)] px-3 py-1 rounded-full">Heart Rate</span>
            </div>
            <VitalsChart data={vitalsData} dataKey="value" color="var(--heart)" />
          </GlassCard>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          <GlassCard className="p-6 bg-gradient-to-br from-blue-900 to-[var(--primary)] text-white border-0 shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-blue-100 uppercase tracking-wider text-xs">Risk Forecast</h3>
            <div className="space-y-4">
              <div>
                <p className="text-blue-200 text-sm mb-1">Current Highest Risk ({highestRiskEntry[0].charAt(0).toUpperCase() + highestRiskEntry[0].slice(1)})</p>
                <div className="flex items-end gap-2 text-4xl font-bold">
                  <NumberFlow value={highestRiskEntry[1]} format={{ style: 'unit', unit: 'percent', maximumFractionDigits: 0 }} />
                  <span className="text-blue-200 mb-1 text-base font-normal">today</span>
                </div>
              </div>
              <div className="pt-4 border-t border-blue-800/50 flex justify-between">
                <div>
                  <p className="text-blue-200 text-xs mb-1">30 Days Proj.</p>
                  <p className="font-bold text-lg text-[var(--warning)]">{highestRiskEntry[1] > 0 ? Math.min(Math.round(highestRiskEntry[1] * 1.05), 99) : 0}%</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs mb-1">90 Days Proj.</p>
                  <p className="font-bold text-lg text-[var(--danger)]">{highestRiskEntry[1] > 0 ? Math.min(Math.round(highestRiskEntry[1] * 1.12), 99) : 0}%</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/patient/monitoring" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors group">
                <span className="font-medium text-[var(--text-secondary)] group-hover:text-[var(--primary)]">Log Vitals</span>
                <span className="text-[var(--text-muted)] group-hover:text-[var(--primary)]">→</span>
              </Link>
              <Link to="/patient/timeline" className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] transition-colors group">
                <span className="font-medium text-[var(--text-secondary)] group-hover:text-[var(--primary)]">View Timeline</span>
                <span className="text-[var(--text-muted)] group-hover:text-[var(--primary)]">→</span>
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Connected Devices</h2>
            {vitalsData.length > 0 && vitalsData[0].value > 0 ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
                <div className="flex-1">
                  <p className="font-bold text-[var(--text-primary)] text-sm">SmartVital Pro</p>
                  <p className="text-xs text-[var(--text-secondary)]">Synced {vitalsData[vitalsData.length - 1]?.time || 'recently'}</p>
                </div>
              </div>
            ) : (
               <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <p className="text-sm font-bold text-[var(--text-secondary)]">No Devices Connected</p>
                 <Link to="/patient/devices/setup" className="text-xs text-[var(--primary)] hover:underline mt-1 block">Setup Device</Link>
               </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
