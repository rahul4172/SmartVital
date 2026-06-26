import React, { useState } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { Bluetooth, Search, Smartphone, Wifi, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function DeviceSetup() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const navigate = useNavigate();

  const handleNextStep = async () => {
    setIsProcessing(true);
    
    // Simulate realistic delays for each IoT setup step
    let delay = 2000;
    if (step === 1) delay = 3500; // Bluetooth searching takes longer
    if (step === 3) delay = 4000; // Wi-Fi handshake takes longer
    
    await new Promise(r => setTimeout(r, delay));
    
    setIsProcessing(false);
    
    if (step === 4) {
      try {
        await api.post('/patient/devices', {
          name: 'SmartVital Pro (SV-8942)',
          type: 'smartwatch',
          status: 'connected',
          last_sync: new Date().toISOString()
        });
        toast.success('SmartVital Pro is fully configured!');
        navigate('/patient/devices');
      } catch (e) {
        toast.error('Failed to register device. Please try again.');
      }
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Pair New Device</h1>
        <p className="text-[var(--text-secondary)] mt-2 max-w-lg mx-auto">
          Follow the steps below to connect your new SmartVital IoT wearable to your health dashboard.
        </p>
      </div>

      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--primary)] -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
            s < step ? 'bg-[var(--success)] text-white shadow-lg' :
            s === step ? 'bg-[var(--primary)] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' :
            'bg-white border-2 border-gray-300 text-gray-400'
          }`}>
            {s < step ? <CheckCircle size={20} /> : s}
          </div>
        ))}
      </div>

      <ClayCard className="p-8 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
        {step === 1 && (
          <div className="space-y-6 flex flex-col items-center w-full max-w-md animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl relative z-10">
                <Bluetooth size={40} className="text-blue-600" />
              </div>
              {isProcessing && (
                <>
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -inset-4 border-2 border-blue-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute -inset-8 border-2 border-blue-200 rounded-full animate-ping opacity-25" style={{ animationDelay: '0.4s' }}></div>
                </>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Turn on your device</h2>
              <p className="text-[var(--text-secondary)] mt-2">
                Press and hold the button on your SmartVital Pro for 3 seconds until the blue LED blinks.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 flex flex-col items-center w-full max-w-md animate-in slide-in-from-right duration-500">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-md">
                <Smartphone size={30} className="text-gray-600" />
              </div>
              <div className="flex gap-2">
                <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-[var(--primary)] animate-bounce' : 'bg-gray-300'}`}></div>
                <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-[var(--primary)] animate-bounce' : 'bg-gray-300'}`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-[var(--primary)] animate-bounce' : 'bg-gray-300'}`} style={{ animationDelay: '0.2s' }}></div>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shadow-md border-2 border-[var(--primary)]">
                <Watch size={30} className="text-[var(--primary)]" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Device Found</h2>
              <p className="text-[var(--text-secondary)] mt-2">
                Found <strong>SmartVital Pro (SV-8942)</strong>. Connecting via Bluetooth Low Energy...
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 flex flex-col items-center w-full max-w-md animate-in slide-in-from-right duration-500">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center shadow-md mb-2">
              <Wifi size={36} className="text-purple-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Configure Wi-Fi</h2>
              <p className="text-[var(--text-secondary)] mt-2 text-sm">
                Your device needs Wi-Fi to sync vitals automatically without your phone.
              </p>
            </div>

            <div className="w-full space-y-4 mt-4 text-left">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Network Name (SSID)</label>
                <input 
                  type="text" 
                  value={wifiSsid}
                  onChange={e => setWifiSsid(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--primary)]" 
                  placeholder="e.g. Home_Network_5G" 
                  disabled={isProcessing}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1">Password</label>
                <input 
                  type="password" 
                  value={wifiPass}
                  onChange={e => setWifiPass(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--primary)]" 
                  placeholder="••••••••"
                  disabled={isProcessing} 
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 flex flex-col items-center w-full max-w-md animate-in zoom-in duration-500">
            <div className="relative">
              <svg className="w-24 h-24 text-[var(--success)] animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="200" strokeDashoffset="100" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={32} className="text-[var(--success)] animate-pulse" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Calibrating Sensors</h2>
              <p className="text-[var(--text-secondary)] mt-2">
                Please wear the device securely on your wrist and remain still for a few seconds.
              </p>
            </div>

            {isProcessing && (
              <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                <div className="bg-[var(--success)] h-2 rounded-full animate-[progress_4s_ease-in-out_forwards]" style={{ width: '0%' }}></div>
              </div>
            )}
          </div>
        )}

      </ClayCard>

      <div className="flex justify-end gap-4 mt-8">
        <ClayButton variant="secondary" onClick={() => navigate('/patient/devices')} disabled={isProcessing}>
          Cancel
        </ClayButton>
        <ClayButton 
          onClick={handleNextStep} 
          disabled={isProcessing || (step === 3 && (!wifiSsid || !wifiPass))}
          className="min-w-[150px] flex justify-center items-center gap-2"
        >
          {isProcessing ? (
            <><Loader2 size={18} className="animate-spin" /> Processing...</>
          ) : step === 4 ? (
            <><CheckCircle size={18} /> Finish Setup</>
          ) : step === 3 ? (
            <>Connect & Next <ArrowRight size={18} /></>
          ) : (
            <>Continue <ArrowRight size={18} /></>
          )}
        </ClayButton>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
