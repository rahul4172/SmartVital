import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { Link } from 'react-router-dom';
import { Stethoscope, Award, MapPin, Star, MessageSquare, Send, Phone, Video, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';

interface DoctorProfile {
  _id: string;
  user_id: string;
  full_name: string;
  specialty: string;
  experience_years: int;
  clinic_address: string;
  phone: string;
  bio: string;
  profile_photo?: string;
}

export function MyDoctor() {
  const [loading, setLoading] = useState(true);
  const [myDoctor, setMyDoctor] = useState<DoctorProfile | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<DoctorProfile[]>([]);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const fetchMyDoctor = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patient/my-doctor');
      setMyDoctor(res.data);
      fetchMessages(res.data.user_id);
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No doctor assigned, fetch the list
        fetchAvailableDoctors();
      } else {
        toast.error('Failed to load doctor profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDoctors = async () => {
    try {
      const res = await api.get('/doctor/list');
      setAvailableDoctors(res.data);
    } catch (error) {
      toast.error('Failed to load available doctors');
    }
  };

  const fetchMessages = async (doctorId: string) => {
    try {
      const res = await api.get(`/messages/${doctorId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchMyDoctor();
    // Poll messages every 10 seconds
    const interval = setInterval(() => {
      if (myDoctor) fetchMessages(myDoctor.user_id);
    }, 10000);
    return () => clearInterval(interval);
  }, [myDoctor?.user_id]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAssignDoctor = async (doctorId: string) => {
    try {
      setLoading(true);
      await api.post('/patient/assign-doctor', { doctor_id: doctorId });
      toast.success('Doctor assigned successfully!');
      fetchMyDoctor(); // Reload to show the assigned doctor UI
    } catch (error) {
      toast.error('Failed to assign doctor');
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !myDoctor) return;

    try {
      const payload = {
        receiver_id: myDoctor.user_id,
        text: message
      };
      
      const res = await api.post('/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  // --- SELECTION UI: If no doctor is assigned ---
  if (!myDoctor) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Select a Doctor</h1>
          <p className="text-[var(--text-secondary)] mt-1">Please select a primary care physician to proceed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableDoctors.map(doc => (
            <ClayCard key={doc._id} className="p-6 flex flex-col h-full">
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-md">
                {doc.profile_photo ? (
                  <img src={doc.profile_photo} alt={doc.full_name} className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${doc.full_name}`} alt={doc.full_name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="text-center flex-1">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{doc.full_name}</h3>
                <p className="text-[var(--primary)] font-semibold text-sm">{doc.specialty}</p>
                <div className="flex justify-center gap-2 mt-3 mb-4">
                  <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                    <Award size={12} /> {doc.experience_years} Yrs Exp
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3">{doc.bio}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <ClayButton onClick={() => handleAssignDoctor(doc._id)} className="w-full justify-center">
                  Select Doctor
                </ClayButton>
              </div>
            </ClayCard>
          ))}
          {availableDoctors.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No doctors available at the moment.
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- ASSIGNED UI: If a doctor is assigned ---
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Doctor</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage your relationship with your primary care physician.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Doctor Profile */}
        <div className="lg:col-span-1 space-y-6">
          <ClayCard className="p-6 text-center">
            <div className="w-32 h-32 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-white shadow-lg">
              {myDoctor.profile_photo ? (
                <img src={myDoctor.profile_photo} alt={myDoctor.full_name} className="w-full h-full object-cover" />
              ) : (
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${myDoctor.full_name}`} alt={myDoctor.full_name} className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{myDoctor.full_name}</h2>
            <p className="text-[var(--primary)] font-semibold mt-1">{myDoctor.specialty}</p>
            
            <div className="flex justify-center gap-2 mt-3">
              <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">
                <Star size={14} fill="currentColor" /> 4.9 (124)
              </span>
              <span className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                <Award size={14} /> {myDoctor.experience_years} Yrs Exp
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed">
              {myDoctor.bio}
            </p>

            <div className="mt-6 space-y-3">
              <Link to="/patient/appointments" className="block">
                <ClayButton className="w-full justify-center">Book Appointment</ClayButton>
              </Link>
              <div className="flex gap-2">
                <button onClick={() => toast('Initiating call...')} className="flex-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[var(--text-primary)] font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Phone size={18} /> Call
                </button>
                <Link to="/patient/teleconsult" className="flex-1">
                  <button className="w-full bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold py-2 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <Video size={18} /> Video
                  </button>
                </Link>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6 space-y-4">
            <h3 className="font-bold text-[var(--text-primary)] border-b border-gray-100 pb-2">Clinic Information</h3>
            <div className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
              <MapPin className="text-[var(--primary)] shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-bold text-[var(--text-primary)]">SmartVital Health Center</p>
                <p>{myDoctor.clinic_address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <Phone className="text-[var(--primary)] shrink-0" size={18} />
              <p>{myDoctor.phone}</p>
            </div>
          </ClayCard>
        </div>

        {/* Messaging Interface */}
        <div className="lg:col-span-2">
          <ClayCard className="h-full flex flex-col min-h-[600px]">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Direct Message - {myDoctor.full_name.split(' ')[1]}</h3>
                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 block"></span> Available
                </p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_role === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-4 ${
                    msg.sender_role === 'patient' 
                      ? 'bg-[var(--primary)] text-white rounded-tr-sm shadow-[0_4px_15px_-3px_var(--primary-soft)]' 
                      : 'bg-white text-[var(--text-primary)] border border-gray-100 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${msg.sender_role === 'patient' ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message securely..." 
                  className="flex-1 h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-12 h-12 bg-[var(--primary)] hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-md"
                >
                  <Send size={20} className={message.trim() ? "translate-x-0.5" : ""} />
                </button>
              </form>
              <p className="text-[10px] text-center text-gray-400 mt-2 font-medium uppercase tracking-widest">End-to-End Encrypted</p>
            </div>
          </ClayCard>
        </div>

      </div>
    </div>
  );
}
