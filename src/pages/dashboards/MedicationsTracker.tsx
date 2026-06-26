import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { ClayInput } from '../../components/ui/ClayInput';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { Pill } from 'lucide-react';

interface Medication {
  _id: string;
  name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  prescribed_by?: string;
  start_date: string;
  end_date?: string;
  notes?: string;
  is_active: boolean;
}

export function MedicationsTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchMedications = async () => {
    try {
      const res = await api.get('/patient/medications');
      setMedications(res.data);
    } catch (e) {
      console.error('Failed to load medications', e);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        time_of_day: typeof data.time_of_day === 'string' ? data.time_of_day.split(',').map((t: string) => t.trim()) : data.time_of_day,
      };
      await api.post('/patient/medications', payload);
      toast.success('Medication added successfully');
      setShowAddForm(false);
      reset();
      fetchMedications();
    } catch (e) {
      toast.error('Failed to add medication');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/patient/medications/${id}`, { is_active: !currentStatus });
      fetchMedications();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const deleteMedication = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this medication?')) return;
    try {
      await api.delete(`/patient/medications/${id}`);
      toast.success('Medication deleted');
      fetchMedications();
    } catch (e) {
      toast.error('Failed to delete medication');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Medication Tracker</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your prescriptions and track adherence.</p>
        </div>
        <ClayButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Medication'}
        </ClayButton>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <ClayCard className="p-6 mb-8 border-t-4 border-t-[var(--primary)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">New Medication</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ClayInput label="Medication Name" {...register('name')} required />
                  <ClayInput label="Dosage (e.g., 50mg)" {...register('dosage')} required />
                  <ClayInput label="Frequency (e.g., Daily)" {...register('frequency')} required />
                  <ClayInput label="Times (comma separated, e.g., 08:00, 20:00)" {...register('time_of_day')} />
                  <ClayInput label="Prescribing Doctor" {...register('prescribed_by')} />
                  <ClayInput label="Start Date" type="date" {...register('start_date')} required />
                  <ClayInput label="End Date (Optional)" type="date" {...register('end_date')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Notes</label>
                  <textarea {...register('notes')} className="w-full bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 py-2 min-h-[80px]" />
                </div>
                <ClayButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Medication'}
                </ClayButton>
              </form>
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {medications.length === 0 ? (
          <ClayCard className="p-8 text-center bg-gray-50 border-dashed border-2 border-gray-200">
            <div className="flex justify-center mb-4 text-cyan-500">
              <Pill size={48} />
            </div>
            <h3 className="font-bold text-[var(--text-primary)]">No Medications Added</h3>
            <p className="text-[var(--text-secondary)] mt-1">Keep track of your daily prescriptions here.</p>
          </ClayCard>
        ) : (
          medications.map(med => (
            <motion.div key={med._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ClayCard className={`p-6 flex flex-col md:flex-row justify-between items-center gap-4 ${!med.is_active ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${med.is_active ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : 'bg-gray-200 text-gray-500'}`}>
                    <Pill size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)] flex items-center gap-2">
                      {med.name}
                      {!med.is_active && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Inactive</span>}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm">
                      {med.dosage} • {med.frequency} 
                      {med.time_of_day?.length > 0 && ` • at ${med.time_of_day.join(', ')}`}
                    </p>
                    {med.prescribed_by && <p className="text-xs text-gray-400 mt-1">Prescribed by {med.prescribed_by}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <ClayButton variant="secondary" onClick={() => toggleActive(med._id, med.is_active)}>
                    {med.is_active ? 'Pause' : 'Resume'}
                  </ClayButton>
                  <button onClick={() => deleteMedication(med._id)} className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </ClayCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
