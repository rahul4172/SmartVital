import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { Pill, Plus, Search, FileSignature, Loader2, X } from 'lucide-react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function DoctorPrescriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRx, setNewRx] = useState({ patient_id: '', patient_name: '', medication: '', dosage: '', frequency: '', duration: '', refills: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rxRes, patientsRes] = await Promise.all([
          api.get('/clinical/prescriptions'),
          api.get('/doctor/my-patients')
        ]);
        setPrescriptions(rxRes.data);
        setPatients(patientsRes.data);
      } catch (err) {
        toast.error('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApproveRefill = async (id: string) => {
    try {
      await api.patch(`/clinical/prescriptions/${id}/status`, { status: 'Active' });
      setPrescriptions(prev => prev.map(p => p._id === id ? { ...p, status: 'Active' } : p));
      toast.success('Refill approved');
    } catch (err) {
      toast.error('Failed to approve refill');
    }
  };

  const handleCreateRx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRx.patient_id || !newRx.medication || !newRx.dosage) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/clinical/prescriptions', newRx);
      toast.success('Prescription created successfully');
      setIsModalOpen(false);
      setNewRx({ patient_id: '', patient_name: '', medication: '', dosage: '', frequency: '', duration: '', refills: 0 });
      // Refresh
      const res = await api.get('/clinical/prescriptions');
      setPrescriptions(res.data);
    } catch (err) {
      toast.error('Failed to create prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => 
    p.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.medication?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Prescriptions</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage active medications, authorize refills, and write new prescriptions.</p>
        </div>
        <ClayButton className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <FileSignature size={18} /> New e-Prescription
        </ClayButton>
      </div>

      <ClayCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search prescriptions by patient or medication..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[var(--text-muted)] text-sm uppercase tracking-wider">
                <th className="pb-3 px-4 font-bold">Patient</th>
                <th className="pb-3 px-4 font-bold">Medication</th>
                <th className="pb-3 px-4 font-bold">Dosage</th>
                <th className="pb-3 px-4 font-bold">Date Issued</th>
                <th className="pb-3 px-4 font-bold">Status</th>
                <th className="pb-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrescriptions.map((rx, idx) => (
                <motion.tr 
                  key={rx._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-4 px-4">
                    <p className="font-bold text-[var(--text-primary)]">{rx.patient_name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">ID: {rx._id.slice(-6).toUpperCase()}</p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                        <Pill size={16} />
                      </div>
                      <span className="font-semibold text-[var(--text-primary)]">{rx.medication}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[var(--text-secondary)] text-sm">{rx.dosage}</td>
                  <td className="py-4 px-4 text-[var(--text-secondary)] text-sm">{new Date(rx.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      rx.status === 'Pending Refill' ? 'bg-orange-100 text-orange-700' :
                      rx.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {rx.status === 'Pending Refill' ? (
                      <button 
                        onClick={() => handleApproveRefill(rx._id)}
                        className="text-sm font-bold bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Approve Refill
                      </button>
                    ) : (
                      <button className="text-[var(--primary)] font-bold text-sm px-3 py-1.5 rounded-lg hover:bg-[var(--primary-soft)] transition-colors opacity-0 group-hover:opacity-100">
                        View Details
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {prescriptions.length === 0 && !loading && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No prescriptions found.
            </div>
          )}
        </div>
      </ClayCard>

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
                <h2 className="text-xl font-bold text-[var(--text-primary)]">New e-Prescription</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateRx} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Select Patient *</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newRx.patient_id}
                    onChange={(e) => {
                      const p = patients.find(p => p._id === e.target.value);
                      setNewRx({ ...newRx, patient_id: e.target.value, patient_name: p ? p.full_name : '' });
                    }}
                    required
                  >
                    <option value="">Select a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.full_name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Medication Name *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newRx.medication}
                    onChange={(e) => setNewRx({ ...newRx, medication: e.target.value })}
                    placeholder="e.g. Lisinopril"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Dosage *</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                      value={newRx.dosage}
                      onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                      placeholder="e.g. 10mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Frequency</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                      value={newRx.frequency}
                      onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })}
                      placeholder="e.g. Once daily"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Duration</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                      value={newRx.duration}
                      onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })}
                      placeholder="e.g. 30 Days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Refills</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                      value={newRx.refills}
                      onChange={(e) => setNewRx({ ...newRx, refills: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                  <ClayButton type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Authorize Prescription'}
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
