import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { Calendar, Clock, Video, User, Check, X, MapPin } from 'lucide-react';

interface Appointment {
  _id: string;
  doctor_name: string;
  doctor_id: string;
  date: string;
  time: string;
  reason: string;
  type: string;
  status: string;
}

export function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [myDoctor, setMyDoctor] = useState<any>(null);

  const { register, handleSubmit, reset } = useForm();

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my-appointments');
      setAppointments(res.data);
    } catch (e) {
      console.error('Failed to load appointments', e);
    }
  };

  const fetchMyDoctor = async () => {
    try {
      const res = await api.get('/patient/my-doctor');
      setMyDoctor(res.data);
    } catch (e) {
      console.log('No assigned doctor');
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchMyDoctor();
  }, []);

  const onSubmit = async (data: any) => {
    if (!myDoctor) {
      toast.error('Please assign a doctor from the "My Doctor" tab first.');
      return;
    }
    setIsLoading(true);
    try {
      const payload = { 
        doctor_id: myDoctor.user_id,
        date: data.date,
        time: data.time,
        type: data.type,
        purpose: data.reason
      };
      await api.post('/appointments/book', payload);
      toast.success('Appointment booked successfully');
      setShowForm(false);
      reset();
      fetchAppointments();
    } catch (e) {
      toast.error('Failed to book appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.patch(`/appointments/${id}/status`, { status: 'Cancelled' });
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch (e) {
      toast.error('Failed to cancel appointment');
    }
  };

  // Separate upcoming and past/cancelled
  const now = new Date();
  const upcoming = appointments.filter(a => a.status === 'Upcoming');
  const past = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Appointments</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your teleconsults and in-person visits.</p>
        </div>
        <ClayButton onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel Booking' : 'Book New Appointment'}
        </ClayButton>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <ClayCard className="p-6 mb-8 border-l-4 border-l-[var(--primary)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Book an Appointment</h2>
              
              {!myDoctor ? (
                <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl flex items-center gap-3">
                  <User size={24} className="text-orange-600" />
                  <div>
                    <p className="font-bold">No Assigned Doctor</p>
                    <p className="text-sm">You need to select a primary care doctor before booking an appointment. Please visit the "My Doctor" tab to select one.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-[var(--text-secondary)] mb-1 block">Booking with</label>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm">
                        <img src={myDoctor.profile_image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${myDoctor.full_name}`} alt="Doctor" />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{myDoctor.full_name}</p>
                        <p className="text-xs text-[var(--primary)] font-semibold">{myDoctor.specialty}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-[var(--text-secondary)] mb-1 block">Consultation Type</label>
                    <select required {...register('type')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4">
                      <option value="Teleconsult">Teleconsult (Video)</option>
                      <option value="In-Person">In-Person (Clinic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[var(--text-secondary)] mb-1 block">Date</label>
                    <input required type="date" min={new Date().toISOString().split('T')[0]} {...register('date')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4" />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[var(--text-secondary)] mb-1 block">Time</label>
                    <input required type="time" {...register('time')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-sm font-bold text-[var(--text-secondary)] mb-1 block">Reason for Visit</label>
                    <input required {...register('reason')} placeholder="Briefly describe your symptoms or reason for visit" className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4" />
                  </div>

                  <div className="md:col-span-2 flex justify-end">
                    <ClayButton type="submit" disabled={isLoading}>
                      {isLoading ? 'Booking...' : 'Confirm Booking'}
                    </ClayButton>
                  </div>
                </form>
              )}
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Upcoming</h2>
          {upcoming.length === 0 ? (
            <ClayCard className="p-8 text-center bg-gray-50 border-dashed border-2 border-gray-200">
              <p className="text-[var(--text-secondary)] font-medium">No upcoming appointments.</p>
            </ClayCard>
          ) : (
            upcoming.map(appt => (
              <ClayCard key={appt._id} className="p-5 flex flex-col md:flex-row gap-4 justify-between group">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${appt.type === 'Teleconsult' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {appt.type === 'Teleconsult' ? <Video size={24} /> : <MapPin size={24} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{appt.doctor_name}</h3>
                    <p className="text-sm font-medium text-[var(--primary)] flex items-center gap-1 mt-1">
                      <Calendar size={14} /> {new Date(appt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      <span className="mx-1">•</span>
                      <Clock size={14} /> {appt.time}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">"{appt.reason}"</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {appt.type === 'Teleconsult' && (
                    <Link to="/patient/teleconsult">
                      <ClayButton size="sm">
                        Join Call
                      </ClayButton>
                    </Link>
                  )}
                  <button onClick={() => handleCancel(appt._id)} className="p-2 text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-lg transition-colors" title="Cancel">
                    <X size={20} />
                  </button>
                </div>
              </ClayCard>
            ))
          )}
        </div>

        {/* Past */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Past & Cancelled</h2>
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
            {past.length === 0 ? (
              <ClayCard className="p-8 text-center bg-gray-50 border-dashed border-2 border-gray-200">
                <p className="text-[var(--text-secondary)] font-medium">No past history.</p>
              </ClayCard>
            ) : (
              past.map(appt => (
                <ClayCard key={appt._id} className="p-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-bold text-gray-700">{appt.doctor_name}</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${appt.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'}`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {appt.date}</span>
                    <span className="flex items-center gap-1">{appt.type === 'Teleconsult' ? <Video size={14}/> : <MapPin size={14}/>} {appt.type}</span>
                  </div>
                </ClayCard>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
