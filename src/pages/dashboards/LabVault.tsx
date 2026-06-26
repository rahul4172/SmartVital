import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { ClayInput } from '../../components/ui/ClayInput';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { FlaskConical } from 'lucide-react';

interface LabResult {
  _id: string;
  test_name: string;
  date: string;
  result_value: string;
  unit: string;
  reference_range: string;
  is_abnormal: boolean;
  notes?: string;
}

export function LabVault() {
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const fetchLabs = async () => {
    try {
      const res = await api.get('/patient/labs');
      setLabs(res.data);
    } catch (e) {
      console.error('Failed to load lab results', e);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Basic check for abnormality
      const is_abnormal = data.is_abnormal === 'true' || data.is_abnormal === true;
      const payload = { ...data, is_abnormal };
      await api.post('/patient/labs', payload);
      toast.success('Lab result added successfully');
      setShowAddForm(false);
      reset();
      fetchLabs();
    } catch (e) {
      toast.error('Failed to add lab result');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLab = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lab result?')) return;
    try {
      await api.delete(`/patient/labs/${id}`);
      toast.success('Lab result deleted');
      fetchLabs();
    } catch (e) {
      toast.error('Failed to delete lab result');
    }
  };

  const hasAbnormalities = labs.some(l => l.is_abnormal);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Lab Results Vault</h1>
          <p className="text-[var(--text-secondary)] mt-1">Store and track your blood work, imaging, and test results.</p>
        </div>
        <ClayButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : '+ Add Record'}
        </ClayButton>
      </div>

      {hasAbnormalities && (
        <div className="bg-[var(--danger-soft)] border border-[var(--danger)] text-[var(--danger)] p-4 rounded-xl flex items-start gap-3">
          <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <h4 className="font-bold">Attention Needed</h4>
            <p className="text-sm mt-1">One or more of your recent lab results are out of the standard reference range. We recommend discussing these with your primary care provider.</p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <ClayCard className="p-6 mb-8 border-t-4 border-t-[var(--primary)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">New Lab Result</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ClayInput label="Test Name" {...register('test_name')} placeholder="e.g., Fasting Glucose" required />
                  <ClayInput label="Date" type="date" {...register('date')} required />
                  <ClayInput label="Result Value" {...register('result_value')} placeholder="e.g., 105" required />
                  <ClayInput label="Unit" {...register('unit')} placeholder="e.g., mg/dL" required />
                  <ClayInput label="Reference Range" {...register('reference_range')} placeholder="e.g., 70-99 mg/dL" required />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--text-secondary)]">Is Abnormal?</label>
                    <select {...register('is_abnormal')} className="w-full h-12 bg-white border border-gray-200 rounded-[var(--radius-md)] px-4">
                      <option value="false">No (Normal)</option>
                      <option value="true">Yes (Abnormal)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Notes (Optional)</label>
                  <textarea {...register('notes')} className="w-full bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 py-2 min-h-[80px]" />
                </div>
                <ClayButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Record'}
                </ClayButton>
              </form>
            </ClayCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.length === 0 ? (
          <div className="col-span-full">
            <ClayCard className="p-8 text-center bg-gray-50 border-dashed border-2 border-gray-200">
              <div className="flex justify-center mb-4 text-cyan-500">
                <FlaskConical size={48} />
              </div>
              <h3 className="font-bold text-[var(--text-primary)]">No Records Found</h3>
              <p className="text-[var(--text-secondary)] mt-1">Add your lab results to track historical trends.</p>
            </ClayCard>
          </div>
        ) : (
          labs.map(lab => (
            <motion.div key={lab._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <ClayCard className={`p-6 border-t-4 ${lab.is_abnormal ? 'border-t-[var(--danger)]' : 'border-t-[var(--success)]'} h-full flex flex-col`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">{lab.test_name}</h3>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mt-1">{new Date(lab.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => deleteLab(lab._id)} className="text-gray-400 hover:text-red-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-end gap-2 mb-2">
                    <span className={`text-4xl font-bold ${lab.is_abnormal ? 'text-[var(--danger)]' : 'text-[var(--text-primary)]'}`}>
                      {lab.result_value}
                    </span>
                    <span className="text-[var(--text-secondary)] font-bold mb-1">{lab.unit}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">Reference: {lab.reference_range}</p>
                  
                  {lab.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-[var(--text-secondary)]">
                      {lab.notes}
                    </div>
                  )}
                </div>
              </ClayCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
