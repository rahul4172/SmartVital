import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';
import { User, FileText } from 'lucide-react';

export function DoctorReports() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedPatientData, setSelectedPatientData] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/doctor/my-patients');
        setPatients(res.data);
      } catch (err) {
        toast.error('Failed to load patient roster');
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    if (!selectedPatientId) {
      setSelectedPatientData(null);
      return;
    }
    const fetchPatientData = async () => {
      try {
        const res = await api.get(`/doctor/patient/${selectedPatientId}`);
        setSelectedPatientData(res.data);
      } catch (err) {
        toast.error('Failed to load patient data');
      }
    };
    fetchPatientData();
  }, [selectedPatientId]);

  const handleExport = async (type: 'summary' | 'full') => {
    if (!selectedPatientData) {
      toast.error('Please select a patient first');
      return;
    }
    setIsExporting(true);
    try {
      // Mocking the data preparation delay
      await new Promise(r => setTimeout(r, 800));
      window.print();
      toast.success(`${type === 'summary' ? 'Summary' : 'Full Clinical'} Report generated successfully!`);
    } catch (e) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Generate Reports</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Select a patient to generate and export official clinical summary reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Patient Selection */}
        <ClayCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
              <User size={20} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Patient Context</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>{p.full_name}</option>
                ))}
              </select>
            </div>

            {selectedPatientData && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-[var(--text-primary)] mb-2">Profile Overview</h3>
                <div className="text-sm text-[var(--text-secondary)] space-y-1">
                  <p><span className="font-medium text-gray-700">Name:</span> {selectedPatientData.full_name}</p>
                  <p><span className="font-medium text-gray-700">ID:</span> {selectedPatientData._id.slice(-6).toUpperCase()}</p>
                  <p><span className="font-medium text-gray-700">Age:</span> {selectedPatientData.age || '--'} yrs</p>
                  <p><span className="font-medium text-gray-700">Gender:</span> {selectedPatientData.gender || '--'}</p>
                </div>
              </div>
            )}
          </div>
        </ClayCard>

        {/* Export Options */}
        <ClayCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--info-soft)] text-[var(--info)] flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Data Export</h2>
          </div>
          
          <div className="space-y-4">
            <div className={`p-5 border ${!selectedPatientId ? 'opacity-50' : 'hover:border-[var(--primary)]'} border-gray-200 rounded-xl transition-colors flex justify-between items-center bg-white`}>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">Clinical Summary</h4>
                <p className="text-sm text-[var(--text-secondary)]">1-page overview of current vitals and risk scores.</p>
              </div>
              <button 
                onClick={() => handleExport('summary')} 
                disabled={isExporting || !selectedPatientId}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>

            <div className={`p-5 border ${!selectedPatientId ? 'opacity-50' : 'hover:border-[var(--primary)]'} border-gray-200 rounded-xl transition-colors flex justify-between items-center bg-white`}>
              <div>
                <h4 className="font-bold text-[var(--text-primary)]">Complete Medical Record</h4>
                <p className="text-sm text-[var(--text-secondary)]">Full historical timeline, clinical notes, and AI predictions.</p>
              </div>
              <button 
                onClick={() => handleExport('full')} 
                disabled={isExporting || !selectedPatientId}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              </button>
            </div>
            
            <div className="p-4 bg-[var(--warning-soft)] rounded-xl mt-4">
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                <span className="font-bold text-[var(--warning)]">HIPAA Notice:</span> Generated reports contain Protected Health Information (PHI). Ensure you are following proper institutional guidelines when downloading or printing these records.
              </p>
            </div>
          </div>
        </ClayCard>
        
      </div>
      
      {/* Hidden Printable Report */}
      {selectedPatientData && (
        <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8">
          <div className="border-b-2 border-gray-800 pb-6 mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">SmartVital</h1>
              <p className="text-gray-500">Intelligent Healthcare</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900">Clinical Summary Report</h2>
              <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p><span className="font-semibold">Name:</span> {selectedPatientData.full_name}</p>
              <p><span className="font-semibold">DOB:</span> {selectedPatientData.date_of_birth ? new Date(selectedPatientData.date_of_birth).toLocaleDateString() : '--'} ({selectedPatientData.age || '--'} yrs)</p>
              <p><span className="font-semibold">ID:</span> {selectedPatientData._id}</p>
              <p><span className="font-semibold">Gender:</span> {selectedPatientData.gender || 'Not specified'}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4">AI Risk Assessments</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-semibold text-gray-700">Disease Model</th>
                  <th className="p-3 font-semibold text-gray-700">Risk Score</th>
                  <th className="p-3 font-semibold text-gray-700">Assessment</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3">Cardiovascular Disease</td>
                  <td className="p-3 font-medium">{selectedPatientData.risk === 'high' ? 'High' : selectedPatientData.risk === 'medium' ? 'Moderate' : 'Low'}</td>
                  <td className="p-3 text-gray-600 font-medium">Pending Review</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500">
            <p>This report was generated automatically by the SmartVital platform.</p>
            <p>Not intended as a standalone diagnostic tool.</p>
            <p><strong>Generated By:</strong> Attending Physician</p>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
