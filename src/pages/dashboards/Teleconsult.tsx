import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { motion } from 'framer-motion';
import { Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, Maximize, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/axios';

export function Teleconsult() {
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [myDoctor, setMyDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get('/patient/my-doctor');
        setMyDoctor(res.data);
      } catch (err) {
        console.error('No doctor assigned');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDoctor();
  }, []);

  const handleEndCall = () => {
    toast('Call ended', { icon: <PhoneOff size={16} className="text-red-500" /> });
    setInCall(false);
    navigate('/patient/dashboard');
  };

  if (inCall && myDoctor) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        {/* Main Video Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Doctor Video (Mock Avatar) */}
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${myDoctor.full_name}`} alt="Doctor" className="w-full h-full object-cover opacity-80" />
          
          <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span>04:22</span>
            <span className="mx-2 text-white/50">|</span>
            <span>{myDoctor.full_name}</span>
          </div>

          {/* Self Video PIP */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-28 right-6 w-48 h-64 bg-gray-900 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-10"
          >
            {videoOn ? (
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500" alt="Self" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-800">
                <VideoOff size={40} className="mb-2" />
                <span className="text-sm font-semibold">Camera Off</span>
              </div>
            )}
            {!micOn && (
              <div className="absolute bottom-3 right-3 bg-red-500 rounded-full p-1.5 shadow-md">
                <MicOff size={14} className="text-white" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Controls Bar */}
        <div className="h-24 bg-gray-900 flex items-center justify-center gap-6 px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
          <button 
            onClick={() => setMicOn(!micOn)} 
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
          >
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <button 
            onClick={() => setVideoOn(!videoOn)} 
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
          >
            {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button onClick={handleEndCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
            <PhoneOff size={28} />
          </button>

          <button className="w-14 h-14 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center transition-all relative">
            <MessageSquare size={24} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border-2 border-gray-900 rounded-full"></span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Teleconsult Waiting Room</h1>
        <p className="text-[var(--text-secondary)] mt-1">Please test your audio and video before joining the call.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Device Test */}
        <ClayCard className="p-6">
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative mb-6">
             {videoOn ? (
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000" alt="Self Test" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-800">
                <VideoOff size={48} className="mb-4" />
                <span className="font-semibold">Camera is disabled</span>
              </div>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-900/80 backdrop-blur-sm px-6 py-3 rounded-full">
              <button 
                onClick={() => setMicOn(!micOn)} 
                className={`p-3 rounded-full transition-colors ${micOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 text-white'}`}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              
              <button 
                onClick={() => setVideoOn(!videoOn)} 
                className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-red-500 text-white'}`}
              >
                {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-[var(--text-secondary)] block mb-2">Microphone</label>
              <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-[var(--primary)]">
                <option>Default - MacBook Pro Microphone</option>
                <option>External USB Mic</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-[var(--text-secondary)] block mb-2">Camera</label>
              <select className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:border-[var(--primary)]">
                <option>FaceTime HD Camera</option>
              </select>
            </div>
          </div>
        </ClayCard>

        {/* Appointment Details */}
        <div className="space-y-6">
          <ClayCard className="p-8 h-full">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 border-b border-gray-100 pb-4">Upcoming Session</h2>
            
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading doctor details...</div>
            ) : myDoctor ? (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${myDoctor.full_name}`} alt="Doctor" className="w-16 h-16 rounded-full shadow-sm" />
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{myDoctor.full_name}</h3>
                    <p className="text-sm text-[var(--primary)] font-semibold">{myDoctor.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[var(--text-secondary)] font-medium">Time</span>
                    <span className="font-bold text-[var(--text-primary)]">Today, 10:30 AM</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-[var(--text-secondary)] font-medium">Duration</span>
                    <span className="font-bold text-[var(--text-primary)]">30 Minutes</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-[var(--text-secondary)] font-medium">Reason</span>
                    <span className="font-bold text-[var(--text-primary)]">Routine Follow-up</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 animate-pulse shrink-0"></div>
                  <p className="text-sm text-blue-800">
                    {myDoctor.full_name.split(' ')[1]} is currently in another consultation and will let you in shortly. You can wait here.
                  </p>
                </div>

                <ClayButton onClick={() => setInCall(true)} className="w-full mt-6 justify-center bg-[var(--success)] shadow-[0_8px_20px_-6px_var(--success)]">
                  Join Call Now
                </ClayButton>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You do not have a doctor assigned to you yet.</p>
                <ClayButton onClick={() => navigate('/patient/doctor')} className="justify-center">
                  Select a Doctor
                </ClayButton>
              </div>
            )}
          </ClayCard>
        </div>

      </div>
    </div>
  );
}
