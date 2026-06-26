import React, { useState, useEffect, useRef } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { MessageSquare, Send, Loader2, User as UserIcon, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../api/axios';
import { motion } from 'framer-motion';

interface PatientProfile {
  _id: string;
  user_id: string;
  full_name: string;
  age: number;
  gender: string;
  blood_group: string;
  profile_photo?: string;
}

export function DoctorMessages() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctor/my-patients');
      setPatients(res.data);
    } catch (error) {
      toast.error('Failed to load patient roster');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (patientId: string) => {
    try {
      const res = await api.get(`/messages/${patientId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (selectedPatient) {
      fetchMessages(selectedPatient.user_id);
      // Poll messages every 5 seconds
      interval = setInterval(() => {
        fetchMessages(selectedPatient.user_id);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedPatient?.user_id]);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedPatient) return;

    try {
      const payload = {
        receiver_id: selectedPatient.user_id,
        text: message
      };
      
      const res = await api.post('/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 h-[calc(100vh-140px)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Patient Messages</h1>
        <p className="text-[var(--text-secondary)] mt-1">Communicate directly and securely with your assigned patients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Pane: Patient List */}
        <div className="lg:col-span-1 h-full flex flex-col">
          <ClayCard className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search patients..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500">
                  {searchQuery ? 'No patients found.' : 'No patients assigned yet.'}
                </div>
              ) : (
                filteredPatients.map(patient => (
                  <button
                    key={patient._id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedPatient?._id === patient._id 
                        ? 'bg-[var(--primary-soft)] border border-[var(--primary)]/20 shadow-sm' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                       {patient.profile_photo ? (
                         <img src={patient.profile_photo} alt={patient.full_name} className="w-full h-full object-cover" />
                       ) : (
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.full_name}`} alt={patient.full_name} className="w-full h-full object-cover" />
                       )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${selectedPatient?._id === patient._id ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                        {patient.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ClayCard>
        </div>

        {/* Right Pane: Messaging Interface */}
        <div className="lg:col-span-3 h-full">
          <ClayCard className="h-full flex flex-col">
            {!selectedPatient ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                  <MessageSquare size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Select a Conversation</h3>
                <p className="text-sm">Choose a patient from the list to start messaging securely.</p>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-gray-100 flex items-center gap-4 bg-white/50 backdrop-blur-sm z-10 shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                    {selectedPatient.profile_photo ? (
                      <img src={selectedPatient.profile_photo} alt={selectedPatient.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedPatient.full_name}`} alt={selectedPatient.full_name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{selectedPatient.full_name}</h3>
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                      <span>Blood: {selectedPatient.blood_group}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>Patient ID: {selectedPatient.user_id.substring(0,8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <p className="text-sm">No messages yet. Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={`flex ${msg.sender_role === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl p-4 ${
                          msg.sender_role === 'doctor' 
                            ? 'bg-[var(--primary)] text-white rounded-tr-sm shadow-[0_4px_15px_-3px_var(--primary-soft)]' 
                            : 'bg-white text-[var(--text-primary)] border border-gray-100 rounded-tl-sm shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                          <p className={`text-[10px] mt-1.5 font-medium tracking-wide ${msg.sender_role === 'doctor' ? 'text-white/80 text-right' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a clinical message..." 
                      className="flex-1 h-12 bg-gray-50 border border-gray-200 rounded-xl px-5 text-sm focus:outline-none focus:border-[var(--primary)] focus:bg-white transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={!message.trim()}
                      className="w-12 h-12 bg-[var(--primary)] hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-md shrink-0"
                    >
                      <Send size={18} className={message.trim() ? "translate-x-0.5" : ""} />
                    </button>
                  </form>
                  <p className="text-[10px] text-center text-gray-400 mt-2 font-bold uppercase tracking-[0.15em]">HIPAA Compliant • End-to-End Encrypted</p>
                </div>
              </>
            )}
          </ClayCard>
        </div>

      </div>
    </div>
  );
}
