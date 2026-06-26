import React, { useState, useEffect } from 'react';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayButton } from '../../components/ui/ClayButton';
import { useAuthStore } from '../../store/auth.store';
import { Loader2, User, Award, Phone, MapPin, Edit2, CheckCircle, Camera } from 'lucide-react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function DoctorProfile() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    specialty: '',
    experience_years: 0,
    clinic_address: '',
    phone: '',
    bio: '',
    profile_photo: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctor/profile');
      setFormData({
        full_name: res.data.full_name || '',
        specialty: res.data.specialty || '',
        experience_years: res.data.experience_years || 0,
        clinic_address: res.data.clinic_address || '',
        phone: res.data.phone || '',
        bio: res.data.bio || '',
        profile_photo: res.data.profile_photo || ''
      });
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch('/doctor/profile', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profile_photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Profile</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your public information and clinic details.</p>
        </div>
        {!isEditing ? (
          <ClayButton onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit2 size={18} /> Edit Profile
          </ClayButton>
        ) : (
          <div className="flex gap-3">
            <ClayButton variant="secondary" onClick={() => { setIsEditing(false); fetchProfile(); }}>
              Cancel
            </ClayButton>
            <ClayButton onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Save Changes
            </ClayButton>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: ID Card */}
        <div className="lg:col-span-1">
          <ClayCard className="p-6 text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            
            <div className="relative z-10 pt-16">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
                  {formData.profile_photo ? (
                    <img src={formData.profile_photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : formData.full_name ? (
                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${formData.full_name}`} alt={formData.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-gray-300" />
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors">
                    <Camera size={18} />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                    />
                  </label>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-4">{formData.full_name || 'Dr. Name'}</h2>
              <p className="text-[var(--primary)] font-semibold mb-4">{formData.specialty || 'Specialty'}</p>
              
              <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center justify-center gap-2">
                  <Award size={16} className="text-yellow-500" />
                  <span>{formData.experience_years} Years Experience</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={16} className="text-green-500" />
                  <span>{formData.phone || 'No phone added'}</span>
                </div>
                <div className="flex items-start justify-center gap-2 text-center">
                  <MapPin size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{formData.clinic_address || 'No clinic address added'}</span>
                </div>
              </div>
            </div>
          </ClayCard>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <ClayCard className="p-8">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 border-b border-gray-100 pb-4">Professional Details</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] disabled:opacity-70 disabled:bg-gray-100"
                    placeholder="e.g. Dr. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] disabled:opacity-70 disabled:bg-gray-100"
                    placeholder="e.g. Cardiologist"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value) || 0})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] disabled:opacity-70 disabled:bg-gray-100"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] disabled:opacity-70 disabled:bg-gray-100"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Clinic Address</label>
                <input
                  type="text"
                  value={formData.clinic_address}
                  onChange={(e) => setFormData({...formData, clinic_address: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] disabled:opacity-70 disabled:bg-gray-100"
                  placeholder="123 Health Ave, City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Professional Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--primary)] disabled:opacity-70 disabled:bg-gray-100 resize-none"
                  placeholder="Tell your patients a bit about your background and clinical focus..."
                ></textarea>
              </div>

            </div>
          </ClayCard>
        </div>
      </div>
    </div>
  );
}
