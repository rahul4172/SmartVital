import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { Search, Filter, MoreVertical, Plus, Loader2, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatientId, setNewPatientId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/doctor/my-patients');
      setPatients(res.data);
    } catch (err) {
      toast.error('Failed to fetch patient roster');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientId.trim()) return;
    
    setIsAdding(true);
    try {
      await api.post('/doctor/add-patient', { patient_id: newPatientId.trim() });
      toast.success('Patient added to your roster successfully!');
      setIsAddModalOpen(false);
      setNewPatientId('');
      fetchPatients(); // Refresh roster
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to add patient');
    } finally {
      setIsAdding(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">All Patients</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage and monitor your complete patient roster.</p>
        </div>
        <ClayButton className="flex items-center gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add Patient
        </ClayButton>
      </div>

      <ClayCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by patient name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[var(--text-secondary)] hover:bg-gray-100 font-semibold transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[var(--text-muted)] text-sm uppercase tracking-wider">
                <th className="pb-3 px-4 font-bold">Patient</th>
                <th className="pb-3 px-4 font-bold">Age/Gender</th>
                <th className="pb-3 px-4 font-bold">Primary Condition</th>
                <th className="pb-3 px-4 font-bold">Risk Level</th>
                <th className="pb-3 px-4 font-bold">Status</th>
                <th className="pb-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((p, idx) => (
                <motion.tr 
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold overflow-hidden border-2 border-white shadow-sm">
                        {p.profile_photo ? (
                          <img src={p.profile_photo} alt={p.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${p.full_name}`} alt={p.full_name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">{p.full_name}</p>
                        <p className="text-xs text-[var(--text-secondary)]">ID: {p._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[var(--text-secondary)] font-medium">{p.age || '--'} yrs • {p.gender || 'Unknown'}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-[var(--text-primary)]">General Checkup</span>
                  </td>
                  <td className="py-4 px-4">
                    <RiskBadge risk={p.risk || 'low'} size="sm" />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link to="/doctor/messages">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Message Patient">
                          <MessageSquare size={18} />
                        </button>
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && !loading && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              You currently have no assigned patients in your roster.
            </div>
          )}
          {patients.length > 0 && filteredPatients.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              No patients found matching your search.
            </div>
          )}
        </div>
      </ClayCard>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Add Patient to Roster</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddPatient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Patient ID (MongoDB ObjectId)</label>
                <input 
                  type="text" 
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  placeholder="e.g. 64b7d1c... "
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                  required
                />
                <p className="text-xs text-[var(--text-secondary)] mt-2">Enter the unique 24-character Patient ID provided by the patient or administrator.</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isAdding || !newPatientId.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isAdding ? 'Adding...' : 'Add Patient'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
