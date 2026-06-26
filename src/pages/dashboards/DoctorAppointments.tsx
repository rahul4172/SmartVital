import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { Calendar as CalendarIcon, Clock, Video, User, Check, X, Loader2 } from 'lucide-react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/auth.store';

export function DoctorAppointments() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState({ patient_id: '', date: '', time: '', type: 'Teleconsult', purpose: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [apptRes, patientsRes] = await Promise.all([
        api.get('/appointments/my-appointments'),
        api.get('/doctor/my-patients')
      ]);
      setAppointments(apptRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Appointment ${status.toLowerCase()}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.patient_id || !newAppt.date || !newAppt.time || !newAppt.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        doctor_id: user?.id,
        patient_id: newAppt.patient_id,
        date: newAppt.date,
        time: newAppt.time,
        type: newAppt.type,
        purpose: newAppt.purpose
      };
      await api.post('/appointments/book', payload);
      toast.success('Appointment scheduled successfully');
      setIsModalOpen(false);
      setNewAppt({ patient_id: '', date: '', time: '', type: 'Teleconsult', purpose: '' });
      fetchData();
    } catch (err) {
      toast.error('Failed to schedule appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  // Filter today's appointments and pending requests
  const todayAppointments = appointments.filter(a => a.status === 'Upcoming' || a.status === 'Completed');
  const pendingRequests = appointments.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Appointments</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your schedule, upcoming visits, and teleconsultation queue.</p>
        </div>
        <ClayButton className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <CalendarIcon size={18} /> Schedule Appointment
        </ClayButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <ClayCard className="p-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <CalendarIcon size={20} className="text-[var(--primary)]" /> Today's Schedule
            </h2>

            <div className="space-y-4">
              {todayAppointments.map((appt, idx) => (
                <motion.div 
                  key={appt._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white gap-4"
                >
                  <div className="w-full sm:w-32 flex-shrink-0 text-center sm:text-left">
                    <p className="font-bold text-[var(--primary)] text-lg">{appt.time}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{appt.date}</p>
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[var(--text-primary)] text-lg">{appt.patient_name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        appt.type === 'Teleconsult' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {appt.type}
                      </span>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm flex items-center gap-1">
                      <User size={14} /> {appt.purpose}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 mt-4 sm:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      appt.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {appt.status}
                    </span>
                    
                    {appt.status === 'Upcoming' && (
                      <div className="flex gap-2">
                        {appt.type === 'Teleconsult' && (
                          <ClayButton variant="primary" className="py-1.5 px-3 text-sm flex items-center gap-1">
                            <Video size={14} /> Join
                          </ClayButton>
                        )}
                        <ClayButton 
                          variant="secondary" 
                          className="py-1.5 px-3 text-sm flex items-center gap-1"
                          onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                        >
                          <Check size={14} /> Complete
                        </ClayButton>
                        <ClayButton 
                          variant="secondary" 
                          className="py-1.5 px-3 text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)] flex items-center gap-1"
                          onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                        >
                          <X size={14} /> Cancel
                        </ClayButton>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {todayAppointments.length === 0 && (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                  No upcoming appointments.
                </div>
              )}
            </div>
          </ClayCard>
        </div>

        {/* Sidebar Mini Calendar & Requests */}
        <div className="space-y-6">
          <ClayCard className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[var(--text-primary)]">Pending Requests</h3>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{pendingRequests.length} New</span>
            </div>
            
            <div className="space-y-3">
              {pendingRequests.map((req, idx) => (
                <div key={req._id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                  <p className="font-bold text-sm text-[var(--text-primary)]">{req.patient_name}</p>
                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-1">
                    <Clock size={12} /> {req.date} at {req.time}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button 
                      className="flex-1 bg-white border border-gray-200 text-xs font-bold text-gray-600 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={() => handleUpdateStatus(req._id, 'Cancelled')}
                    >
                      Decline
                    </button>
                    <button 
                      className="flex-1 bg-[var(--primary)] text-white text-xs font-bold py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                      onClick={() => handleUpdateStatus(req._id, 'Upcoming')}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingRequests.length === 0 && (
                <p className="text-sm text-center text-gray-500 py-4">No pending requests.</p>
              )}
            </div>
          </ClayCard>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Schedule Appointment</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Select Patient *</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newAppt.patient_id}
                    onChange={(e) => setNewAppt({ ...newAppt, patient_id: e.target.value })}
                    required
                  >
                    <option value="">Select a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.full_name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Date *</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                      value={newAppt.date}
                      onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Time *</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                      value={newAppt.time}
                      onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Type *</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newAppt.type}
                    onChange={(e) => setNewAppt({ ...newAppt, type: e.target.value })}
                    required
                  >
                    <option value="Teleconsult">Teleconsult</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Purpose/Reason *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newAppt.purpose}
                    onChange={(e) => setNewAppt({ ...newAppt, purpose: e.target.value })}
                    placeholder="e.g. Follow-up consultation"
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                  <ClayButton type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Booking'}
                  </ClayButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
