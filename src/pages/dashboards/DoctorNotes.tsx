import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { FileText, Plus, Search, Edit3, Trash2, Loader2, X } from 'lucide-react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function DoctorNotes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ patient_id: '', patient_name: '', condition: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, patientsRes] = await Promise.all([
          api.get('/clinical/notes'),
          api.get('/doctor/my-patients')
        ]);
        setNotes(notesRes.data);
        setPatients(patientsRes.data);
      } catch (err) {
        toast.error('Failed to load clinical notes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.patient_id || !newNote.content) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/clinical/notes', newNote);
      toast.success('Note created successfully');
      setIsModalOpen(false);
      setNewNote({ patient_id: '', patient_name: '', condition: '', content: '' });
      // Refresh notes
      const res = await api.get('/clinical/notes');
      setNotes(res.data);
    } catch (err) {
      toast.error('Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredNotes = notes.filter(n => n.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Clinical Notes</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage consultation notes and clinical observations.</p>
        </div>
        <ClayButton className="flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Note
        </ClayButton>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search notes by patient name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note, idx) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ClayCard className="p-6 h-full flex flex-col hover:border-[var(--primary-soft)] transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                  <FileText size={20} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"><Edit3 size={16} /></button>
                  <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <h3 className="font-bold text-[var(--text-primary)] text-lg">{note.patient_name}</h3>
              <p className="text-xs font-bold text-gray-400 mb-3">{new Date(note.created_at).toLocaleDateString()}</p>
              
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                {note.content}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm font-bold text-[var(--primary)] hover:underline">Read Full Note</button>
              </div>
            </ClayCard>
          </motion.div>
        ))}
        {notes.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
            No clinical notes found.
          </div>
        )}
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
                <h2 className="text-xl font-bold text-[var(--text-primary)]">New Clinical Note</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateNote} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Select Patient *</label>
                  <select 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newNote.patient_id}
                    onChange={(e) => {
                      const p = patients.find(p => p._id === e.target.value);
                      setNewNote({ ...newNote, patient_id: e.target.value, patient_name: p ? p.full_name : '' });
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
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Condition/Topic</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)]"
                    value={newNote.condition}
                    onChange={(e) => setNewNote({ ...newNote, condition: e.target.value })}
                    placeholder="e.g. Hypertension Follow-up"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[var(--text-secondary)] mb-1">Note Content *</label>
                  <textarea 
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] h-32 resize-none"
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Enter clinical observations..."
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                  <ClayButton type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Note'}
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
