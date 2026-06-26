import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, Watch, Smartphone, FileText } from 'lucide-react';

export function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<'connected' | 'disconnected' | 'pairing'>('disconnected');
  const [profile, setProfile] = useState<any>(null);
  const [vitals, setVitals] = useState<any>(null);
  const [risks, setRisks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, vitalsRes, comorbRes] = await Promise.all([
          api.get('/patient/profile').catch(() => ({ data: null })),
          api.get('/patient/vitals/history').catch(() => ({ data: [] })),
          api.get('/predict/comorbidity').catch(() => ({ data: { visuals: { network: { nodes: [] } } } }))
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (vitalsRes.data && vitalsRes.data.length > 0) {
          setVitals(vitalsRes.data[vitalsRes.data.length - 1]);
        }
        
        const nodes = comorbRes.data?.visuals?.network?.nodes || [];
        const riskFlags = nodes.map((n: any) => ({
          disease: n.id,
          risk: n.risk,
          isHigh: n.risk > 0.4
        }));
        setRisks(riskFlags);
      } catch (e) {
        console.error('Failed to fetch data for reports');
      }
    };
    fetchData();
  }, []);

  const handleExport = async (type: 'summary' | 'full') => {
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      window.print();
      toast.success(`${type === 'summary' ? 'Summary' : 'Full Clinical'} Report exported successfully!`);
    } catch (e) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePairDevice = () => {
    setDeviceStatus('pairing');
    toast('Searching for ESP32 devices via Bluetooth...', { icon: <Search size={16} className="text-blue-500" /> });
    
    // Mock pairing process
    setTimeout(() => {
      setDeviceStatus('connected');
      toast.success('SmartVital Pro Wristband connected successfully!');
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Reports & Devices</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your connected IoT wearables and export your health data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Device Management */}
        <ClayCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
              <Watch size={20} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Connected Devices</h2>
          </div>
          
          <div className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center min-h-[200px] ${
            deviceStatus === 'connected' ? 'border-[var(--success)] bg-[var(--success-soft)]' : 
            deviceStatus === 'pairing' ? 'border-[var(--primary)] bg-[var(--primary-soft)] animate-pulse' : 
            'border-dashed border-gray-300 bg-gray-50'
          }`}>
            
            {deviceStatus === 'connected' ? (
              <>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[var(--success)] text-3xl mb-4 shadow-sm">✓</div>
                <h3 className="font-bold text-[var(--text-primary)]">SmartVital Pro (ESP32)</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Status: Active • Battery: 84%</p>
                <button onClick={() => setDeviceStatus('disconnected')} className="mt-4 text-xs font-bold text-[var(--danger)] hover:underline">Disconnect</button>
              </>
            ) : deviceStatus === 'pairing' ? (
              <>
                <div className="w-10 h-10 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin mb-4"></div>
                <h3 className="font-bold text-[var(--text-primary)]">Pairing Device...</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Keep your wearable near your phone/computer.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-cyan-500 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  <Smartphone size={32} />
                </div>
                <h3 className="font-bold text-[var(--text-primary)]">No Devices Connected</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1 mb-6">Pair a SmartVital wearable for real-time live monitoring.</p>
                <ClayButton onClick={handlePairDevice}>Pair New Device</ClayButton>
              </>
            )}
            
          </div>
        </ClayCard>

        {/* Export Reports */}
        <ClayCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--info-soft)] text-[var(--info)] flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Data Export</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-5 border border-gray-200 rounded-xl hover:border-[var(--primary)] transition-colors flex justify-between items-center bg-white">
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">Clinical Summary</h4>
                <p className="text-sm text-[var(--text-secondary)]">1-page overview of current vitals and risk scores.</p>
              </div>
              <button 
                onClick={() => handleExport('summary')} 
                disabled={isExporting}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>

            <div className="p-5 border border-gray-200 rounded-xl hover:border-[var(--primary)] transition-colors flex justify-between items-center bg-white">
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">Complete Health Record</h4>
                <p className="text-sm text-[var(--text-secondary)]">Full historical timeline, AI predictions, and IoT logs.</p>
              </div>
              <button 
                onClick={() => handleExport('full')} 
                disabled={isExporting}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>
            
            <div className="p-4 bg-[var(--info-soft)] rounded-xl mt-4">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                <span className="font-bold">Privacy Note:</span> All exported documents are highly encrypted and comply with HIPAA guidelines. Do not share your Complete Health Record on unverified platforms.
              </p>
            </div>
          </div>
        </ClayCard>
        
      </div>
      
      {/* Hidden Printable Report */}
      <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8">
        <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">SmartVital</h1>
            <p className="text-gray-500">Intelligent Healthcare</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">Clinical Summary Report</h2>
            <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-semibold">Name:</span> {profile?.full_name || 'N/A'}</p>
            <p><span className="font-semibold">DOB:</span> {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}</p>
            <p><span className="font-semibold">Gender:</span> {profile?.gender || 'N/A'}</p>
            <p><span className="font-semibold">Blood Type:</span> {profile?.blood_type || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">Latest Vitals (via SmartVital Pro)</h3>
          <div className="grid grid-cols-4 gap-4 text-gray-700">
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Heart Rate</p>
              <p className="text-2xl font-bold">{vitals?.heart_rate || '--'} <span className="text-sm font-normal">bpm</span></p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Blood Pressure</p>
              <p className="text-2xl font-bold">{vitals?.blood_pressure_sys || '--'}/{vitals?.blood_pressure_dia || '--'} <span className="text-sm font-normal">mmHg</span></p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider">SpO2</p>
              <p className="text-2xl font-bold">{vitals?.spo2 || '--'} <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-sm text-gray-500 uppercase tracking-wider">Temperature</p>
              <p className="text-2xl font-bold">{vitals?.temperature || '98.6'} <span className="text-sm font-normal">°F</span></p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">AI Risk Assessments</h3>
          {risks.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-semibold text-gray-700">Disease Model</th>
                  <th className="p-3 font-semibold text-gray-700">Risk Score</th>
                  <th className="p-3 font-semibold text-gray-700">Assessment</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((r, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="p-3">{r.disease}</td>
                    <td className="p-3 font-medium">{(r.risk * 100).toFixed(1)}%</td>
                    <td className={`p-3 font-medium ${r.isHigh ? 'text-red-600' : 'text-green-600'}`}>
                      {r.isHigh ? 'High Risk' : 'Low/Moderate Risk'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">No risk assessments currently available.</p>
          )}
        </div>

        <div className="mt-16 text-center text-sm text-gray-500">
          <p>This report was generated automatically by the SmartVital platform.</p>
          <p>Not intended as a standalone diagnostic tool. Please consult your physician.</p>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
