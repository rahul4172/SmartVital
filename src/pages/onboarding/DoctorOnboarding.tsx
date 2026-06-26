import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { StepperForm } from '../../components/ui/StepperForm';
import { ClayInput } from '../../components/ui/ClayInput';
import { ClayCard } from '../../components/ui/ClayCard';
import { api } from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

// Zod Schema
const doctorProfileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  license_number: z.string().min(5, "Valid medical license required"),
  years_of_experience: z.coerce.number().min(0).max(70),
  phone: z.string().min(10, "Valid phone number required"),
  
  clinic_name: z.string().min(2, "Clinic/Hospital name required"),
  clinic_address: z.string().min(5, "Clinic address required"),
  consultation_fee: z.coerce.number().min(0),
  
  education: z.string().min(2, "Education details required (e.g., MBBS, MD)"),
  languages_spoken: z.string().min(2, "Languages required"),
  
  available_days: z.array(z.string()).min(1, "Select at least one day"),
  shift_start: z.string(),
  shift_end: z.string(),
  
  bio: z.string().max(500).optional(),
});

type DoctorProfileForm = z.infer<typeof doctorProfileSchema>;

const STEPS = [
  "Professional Info", 
  "Clinic Details", 
  "Education & Lang", 
  "Availability", 
  "Biography", 
  "Review & Submit"
];

// --- Step 1 ---
const Step1 = () => {
  const { register, formState: { errors } } = useFormContext<DoctorProfileForm>();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Professional Information</h3>
      <ClayInput label="Full Name (with Title)" placeholder="Dr. Jane Doe" {...register('full_name')} error={errors.full_name?.message} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClayInput label="Specialization" placeholder="Cardiologist, General Physician" {...register('specialization')} error={errors.specialization?.message} />
        <ClayInput label="Medical License Number" {...register('license_number')} error={errors.license_number?.message} />
        <ClayInput label="Years of Experience" type="number" {...register('years_of_experience')} error={errors.years_of_experience?.message} />
        <ClayInput label="Contact Phone" {...register('phone')} error={errors.phone?.message} />
      </div>
    </div>
  );
};

// --- Step 2 ---
const Step2 = () => {
  const { register, formState: { errors } } = useFormContext<DoctorProfileForm>();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Clinic / Hospital Details</h3>
      <ClayInput label="Clinic/Hospital Name" {...register('clinic_name')} error={errors.clinic_name?.message} />
      <ClayInput label="Clinic Address" {...register('clinic_address')} error={errors.clinic_address?.message} />
      <ClayInput label="Consultation Fee (USD)" type="number" {...register('consultation_fee')} error={errors.consultation_fee?.message} />
    </div>
  );
};

// --- Step 3 ---
const Step3 = () => {
  const { register, formState: { errors } } = useFormContext<DoctorProfileForm>();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Education & Languages</h3>
      <ClayInput label="Education / Degrees" placeholder="e.g., MBBS (Harvard), MD Cardiology" {...register('education')} error={errors.education?.message} />
      <ClayInput label="Languages Spoken" placeholder="e.g., English, Spanish, Hindi" {...register('languages_spoken')} error={errors.languages_spoken?.message} />
    </div>
  );
};

// --- Step 4 ---
const Step4 = () => {
  const { register, formState: { errors } } = useFormContext<DoctorProfileForm>();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Availability & Schedule</h3>
      <div>
        <label className="text-[var(--text-secondary)] text-sm font-medium mb-2 block">Available Days</label>
        <div className="flex flex-wrap gap-3">
          {days.map(day => (
            <label key={day} className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[var(--primary)]">
              <input type="checkbox" value={day} {...register('available_days')} className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-medium text-[var(--text-secondary)]">{day}</span>
            </label>
          ))}
        </div>
        {errors.available_days && <p className="text-[var(--danger)] text-xs mt-1">{errors.available_days.message}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ClayInput label="Shift Start Time" type="time" {...register('shift_start')} error={errors.shift_start?.message} />
        <ClayInput label="Shift End Time" type="time" {...register('shift_end')} error={errors.shift_end?.message} />
      </div>
    </div>
  );
};

// --- Step 5 ---
const Step5 = () => {
  const { register, formState: { errors } } = useFormContext<DoctorProfileForm>();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Biography</h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-[var(--text-secondary)] text-sm font-medium ml-1">Professional Summary (Optional)</label>
        <textarea 
          {...register('bio')} 
          rows={5}
          placeholder="Briefly describe your experience and approach to patient care..."
          className="w-full p-4 bg-white border border-gray-200 rounded-[var(--radius-md)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary-soft)] transition-all resize-none shadow-[inset_0px_2px_4px_rgba(0,0,0,0.02)]"
        ></textarea>
        {errors.bio && <p className="text-[var(--danger)] text-xs mt-1">{errors.bio.message}</p>}
      </div>
    </div>
  );
};

// --- Step 6 ---
const Step6 = () => {
  const { getValues } = useFormContext<DoctorProfileForm>();
  const data = getValues();
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Review Your Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClayCard className="p-4 bg-gray-50 border-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Professional</h4>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Name:</dt><dd className="font-medium">{data.full_name}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Specialty:</dt><dd className="font-medium">{data.specialization}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">License:</dt><dd className="font-medium">{data.license_number}</dd></div>
          </dl>
        </ClayCard>
        
        <ClayCard className="p-4 bg-gray-50 border-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Clinic</h4>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Name:</dt><dd className="font-medium">{data.clinic_name}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Fee:</dt><dd className="font-medium">${data.consultation_fee}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Schedule:</dt><dd className="font-medium text-right">{data.shift_start} - {data.shift_end}</dd></div>
          </dl>
        </ClayCard>
      </div>
      
      <div className="mt-8 p-4 border-l-4 border-[var(--primary)] bg-[var(--primary-soft)] rounded-r-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 w-5 h-5 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded" />
          <span className="text-sm text-[var(--text-secondary)]">
            I confirm that my medical credentials are valid and I agree to the SmartVital terms of service for medical practitioners.
          </span>
        </label>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export function DoctorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const methods = useForm<DoctorProfileForm>({
    resolver: zodResolver(doctorProfileSchema),
    defaultValues: {
      available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      shift_start: '09:00',
      shift_end: '17:00'
    },
    mode: 'onChange'
  });

  const { trigger, getValues } = methods;

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    switch (currentStep) {
      case 0: fieldsToValidate = ['full_name', 'specialization', 'license_number', 'years_of_experience', 'phone']; break;
      case 1: fieldsToValidate = ['clinic_name', 'clinic_address', 'consultation_fee']; break;
      case 2: fieldsToValidate = ['education', 'languages_spoken']; break;
      case 3: fieldsToValidate = ['available_days', 'shift_start', 'shift_end']; break;
      default: break;
    }
    
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    } else {
      toast.error("Please fill required fields correctly.");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      const data = getValues();
      const payload = {
        ...data,
        languages_spoken: data.languages_spoken.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      // Assume a doctor profile endpoint is built
      await api.post('/doctor/profile', payload);
      
      const user = useAuthStore.getState().user;
      const token = useAuthStore.getState().accessToken;
      if (user && token) {
        setAuth({ ...user, is_onboarded: true, full_name: data.full_name }, token);
      }
      
      toast.success('Doctor Profile created successfully!');
      navigate('/doctor/dashboard');
      
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <Step1 />;
      case 1: return <Step2 />;
      case 2: return <Step3 />;
      case 3: return <Step4 />;
      case 4: return <Step5 />;
      case 5: return <Step6 />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-10">
      <FormProvider {...methods}>
        <form>
          <StepperForm
            steps={STEPS}
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          >
            {renderStep()}
          </StepperForm>
        </form>
      </FormProvider>
    </div>
  );
}
