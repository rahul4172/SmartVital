import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { Activity, Heart, Droplets, Brain, AlertTriangle, CheckCircle, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function HealthSummary() {
  const [vitals, setVitals] = useState<any>(null);
  const [medications, setMedications] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vitalsRes, medsRes, timelineRes, comorbRes] = await Promise.all([
          api.get('/patient/vitals/history').catch(() => ({ data: [] })),
          api.get('/patient/medications').catch(() => ({ data: [] })),
          api.get('/patient/timeline').catch(() => ({ data: [] })),
          api.get('/predict/comorbidity').catch(() => ({ data: { shared_factors: [], visuals: { network: { nodes: [] } } } }))
        ]);

        if (vitalsRes.data && vitalsRes.data.length > 0) {
          setVitals(vitalsRes.data[vitalsRes.data.length - 1]);
        }
        setMedications(medsRes.data || []);
        setTimeline(timelineRes.data || []);

        const nodes = comorbRes.data?.visuals?.network?.nodes || [];
        const riskFlags = nodes.map((n: any) => ({
          disease: n.id,
          risk: n.risk,
          isHigh: n.risk > 0.4
        }));
        setRisks(riskFlags);

      } catch (err) {
        toast.error('Failed to load health summary');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Health Summary</h1>
          <p className="text-[var(--text-secondary)] mt-1">Your comprehensive medical chart overview.</p>
        </div>
        <Link to="/patient/reports">
          <ClayButton className="flex items-center gap-2">
            <Download size={18} /> Export Full Record
          </ClayButton>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core Vitals Snapshot */}
        <ClayCard className="lg:col-span-2 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <Activity className="text-[var(--primary)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Latest Vitals</h2>
            <span className="ml-auto text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
              {vitals?.date ? new Date(vitals.date).toLocaleDateString() : 'No Data'}
            </span>
          </div>

          {vitals ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-blue-500 mb-2"><Heart size={28} /></span>
                <p className="text-2xl font-bold text-gray-800">{vitals.heart_rate || '--'}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">BPM</p>
              </div>
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-orange-500 mb-2"><Activity size={28} /></span>
                <p className="text-2xl font-bold text-gray-800">{vitals.blood_pressure_sys || '--'}/{vitals.blood_pressure_dia || '--'}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">mmHg</p>
              </div>
              <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-purple-500 mb-2"><Droplets size={28} /></span>
                <p className="text-2xl font-bold text-gray-800">{vitals.spo2 || '--'}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">SpO2 %</p>
              </div>
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-green-500 mb-2"><FileText size={28} /></span>
                <p className="text-2xl font-bold text-gray-800">{vitals.temperature || '98.6'}</p>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">°F</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No vitals recorded yet.</div>
          )}
        </ClayCard>

        {/* AI Risk Flags */}
        <ClayCard className="p-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
            <Brain className="text-[var(--danger)]" size={24} />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">AI Risk Flags</h2>
          </div>
          <div className="space-y-4">
            {risks.length > 0 ? risks.map((r, idx) => (
              <div key={idx} className="flex items-start gap-3">
                {r.isHigh ? (
                  <AlertTriangle className="text-[var(--danger)] shrink-0 mt-0.5" size={20} />
                ) : (
                  <CheckCircle className="text-[var(--success)] shrink-0 mt-0.5" size={20} />
                )}
                <div>
                  <p className="font-bold text-gray-800">{r.disease}</p>
                  <p className="text-sm text-gray-500">
                    {r.isHigh ? `Elevated risk detected (${(r.risk * 100).toFixed(1)}%). ` : `Stable (${(r.risk * 100).toFixed(1)}%). `}
                    {r.isHigh && <Link to="/patient/predictions" className="text-[var(--primary)] hover:underline">View details</Link>}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-sm text-gray-500">No risk assessments available.</div>
            )}
          </div>
        </ClayCard>

        {/* Current Medications */}
        <ClayCard className="lg:col-span-2 p-6 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Current Medications</h2>
            <Link to="/patient/medications" className="text-sm font-bold text-[var(--primary)] hover:underline">Manage All</Link>
          </div>
          <div className="overflow-x-auto flex-1">
            {medications.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm">
                    <th className="p-3 font-semibold rounded-tl-xl">Medication</th>
                    <th className="p-3 font-semibold">Dosage</th>
                    <th className="p-3 font-semibold">Frequency</th>
                    <th className="p-3 font-semibold rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {medications.slice(0, 5).map(med => (
                    <tr key={med._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-3 font-bold text-gray-800">{med.name}</td>
                      <td className="p-3 text-gray-600">{med.dosage}</td>
                      <td className="p-3 text-gray-600">{med.frequency}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${med.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {med.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500 h-full flex items-center justify-center">No active medications tracking.</div>
            )}
          </div>
        </ClayCard>

        {/* Recent Events */}
        <ClayCard className="p-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Events</h2>
          </div>
          <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
            {timeline.length > 0 ? timeline.slice(0, 4).map((event, idx) => (
              <div key={event.id || idx} className="relative pl-6">
                <span className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${
                  event.type === 'iot_alert' ? 'bg-[var(--danger)]' :
                  event.type === 'prediction' ? 'bg-[var(--primary)]' :
                  'bg-green-500'
                }`}></span>
                <p className="font-bold text-gray-800 text-sm flex items-center gap-2">
                  <span>{event.icon}</span> {event.title}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
                <p className="text-xs text-gray-400 mt-1">{event.date}</p>
              </div>
            )) : (
              <div className="text-sm text-gray-500">No recent events.</div>
            )}
          </div>
        </ClayCard>

      </div>
    </div>
  );
}
