import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ClayCard } from '../../components/ui/ClayCard';
import { ClayInput } from '../../components/ui/ClayInput';
import { ClayButton } from '../../components/ui/ClayButton';
import { useAuthStore } from '../../store/auth.store';
import { Camera } from 'lucide-react';
import { api } from '../../api/axios';
import toast from 'react-hot-toast';

export function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/patient/profile');
        setProfile(res.data);
        reset(res.data);
      } catch (e) {
        console.error('Failed to fetch profile', e);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      await api.patch('/patient/profile', data);
      setProfile({ ...profile, ...data });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Failed to update profile');
      console.error(e);
    } finally {
      setIsSaving(false);
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
        setProfile({ ...profile, profile_photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--primary-soft)] border-t-[var(--primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--info)] flex items-center justify-center text-white text-4xl shadow-lg border-4 border-white font-bold overflow-hidden">
              {profile.profile_photo ? (
                <img src={profile.profile_photo} alt={user?.full_name} className="w-full h-full object-cover" />
              ) : (
                user?.full_name?.charAt(0) || 'P'
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors z-10">
                <Camera size={16} />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                />
              </label>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">{user?.full_name}</h1>
            <p className="text-[var(--text-secondary)] mt-1">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--primary-soft)] text-[var(--primary)] rounded-full text-xs font-bold uppercase tracking-wider">
              {user?.role} Account
            </div>
          </div>
        </div>
        
        {!isEditing && (
          <ClayButton variant="secondary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </ClayButton>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Personal Details */}
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClayInput 
              label="Age" 
              type="number" 
              disabled={!isEditing} 
              {...register('age')} 
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Gender</label>
              <select disabled={!isEditing} {...register('gender')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 disabled:opacity-70">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Blood Group</label>
              <select disabled={!isEditing} {...register('blood_group')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 disabled:opacity-70">
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
        </ClayCard>

        {/* Clinical Baseline */}
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            Clinical Baseline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClayInput 
              label="Height (cm)" 
              type="number" 
              disabled={!isEditing} 
              {...register('height_cm')} 
            />
            <ClayInput 
              label="Weight (kg)" 
              type="number" 
              disabled={!isEditing} 
              {...register('weight_kg')} 
            />
            <ClayInput 
              label="Calculated BMI" 
              type="number" 
              disabled 
              value={profile.height_cm && profile.weight_kg ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1) : ''}
            />
          </div>
        </ClayCard>

        {/* Lifestyle Factors */}
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--warning)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Lifestyle & Habits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Smoking Status</label>
              <select disabled={!isEditing} {...register('smoking_status')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 disabled:opacity-70">
                <option value="never">Never Smoked</option>
                <option value="former">Former Smoker</option>
                <option value="current">Current Smoker</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Alcohol Consumption</label>
              <select disabled={!isEditing} {...register('alcohol_consumption')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 disabled:opacity-70">
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="frequent">Frequent</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Activity Level</label>
              <select disabled={!isEditing} {...register('activity_level')} className="w-full h-12 bg-gray-50 border border-gray-200 rounded-[var(--radius-md)] px-4 disabled:opacity-70">
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Very Active</option>
              </select>
            </div>
            <ClayInput 
              label="Avg Sleep (Hours)" 
              type="number" 
              step="0.5"
              disabled={!isEditing} 
              {...register('sleep_hours')} 
            />
          </div>
        </ClayCard>

        {isEditing && (
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
            <ClayButton type="button" variant="secondary" onClick={() => { setIsEditing(false); reset(profile); }}>
              Cancel
            </ClayButton>
            <ClayButton type="button" onClick={handleSubmit((data) => onSubmit({ ...data, profile_photo: profile.profile_photo }))} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </ClayButton>
          </div>
        )}

      </form>
    </div>
  );
}
