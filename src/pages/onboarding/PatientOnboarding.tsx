import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

import { StepperForm } from '../../components/ui/StepperForm';
import { ClayInput } from '../../components/ui/ClayInput';
import { ClayCard } from '../../components/ui/ClayCard';
import { InfoTooltip } from '../../components/ui/InfoTooltip';
import { api } from '../../api/axios';
import { useAuthStore } from '../../store/auth.store';

// Zod Schema
const patientProfileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  date_of_birth: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date format"),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(["Male", "Female", "Other"], { errorMap: () => ({ message: "Please select a gender" }) }),
  blood_group: z.string().min(1, "Blood group is required"),
  phone: z.string().min(10, "Phone number must be valid"),
  address: z.string().min(5, "Address is required"),
  
  emergency_contact: z.object({
    name: z.string().min(2, "Contact name required"),
    phone: z.string().min(10, "Contact phone required"),
    relation: z.string().min(2, "Relationship required"),
  }),
  
  height_cm: z.coerce.number().optional().nullable(),
  weight_kg: z.coerce.number().optional().nullable(),
  bmi: z.coerce.number().optional().nullable(),
  
  allergies: z.string().optional(),
  current_medications: z.string().optional(),
  past_surgeries: z.string().optional(),
  
  chronic_diseases: z.array(z.string()),
  
  smoking_status: z.enum(["never", "former", "current"]),
  pack_years: z.coerce.number().optional().nullable(),
  
  alcohol_consumption: z.string(),
  exercise_frequency: z.string(),
  sleep_hours: z.coerce.number().min(0).max(24),
  stress_level: z.coerce.number().min(1).max(10),
  diet_type: z.string(),
  
  family_history: z.object({
    heart_disease: z.enum(['yes', 'no', 'not_sure']),
    stroke: z.enum(['yes', 'no', 'not_sure']),
    diabetes: z.enum(['yes', 'no', 'not_sure']),
    cancer: z.enum(['yes', 'no', 'not_sure']),
    kidney_disease: z.enum(['yes', 'no', 'not_sure']),
  }),
  
  vitals: z.object({
    heart_rate: z.coerce.number().optional().nullable(),
    blood_pressure_sys: z.coerce.number().optional().nullable(),
    blood_pressure_dia: z.coerce.number().optional().nullable(),
    spo2: z.coerce.number().optional().nullable(),
    respiratory_rate: z.coerce.number().optional().nullable(),
    body_temperature: z.coerce.number().optional().nullable(),
    blood_sugar: z.coerce.number().optional().nullable(),
  }).optional(),
  
  insurance: z.object({
    provider: z.string().optional().nullable(),
    policy_number: z.string().optional().nullable(),
    coverage_type: z.string().optional().nullable(),
  }).optional()
});

type PatientProfileForm = z.infer<typeof patientProfileSchema>;

const STEPS = ["Personal Info", "Medical History", "Lifestyle", "Family History", "Vitals & Insurance", "Review & Submit"];

// --- Step 1 ---
const Step1 = () => {
  const { register, formState: { errors } } = useFormContext<PatientProfileForm>();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ClayInput label="Full Name" {...register('full_name')} error={errors.full_name?.message} />
        <ClayInput label="Date of Birth" type="date" {...register('date_of_birth')} error={errors.date_of_birth?.message} />
        <ClayInput label="Age" type="number" {...register('age')} error={errors.age?.message} />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[var(--text-secondary)] text-sm font-medium ml-1">Gender</label>
          <select {...register('gender')} className="w-full h-12 bg-white border border-gray-200 rounded-[var(--radius-md)] px-4">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <ClayInput label="Blood Group" placeholder="e.g., O+" {...register('blood_group')} />
        <ClayInput label="Phone" {...register('phone')} />
      </div>
      <ClayInput label="Address" {...register('address')} />
      
      <h4 className="font-semibold text-lg mt-6 mb-2">Emergency Contact</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClayInput label="Name" {...register('emergency_contact.name')} />
        <ClayInput label="Phone" {...register('emergency_contact.phone')} />
        <ClayInput label="Relation" {...register('emergency_contact.relation')} />
      </div>
    </div>
  );
};

// --- Step 2 ---
const Step2 = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext<PatientProfileForm>();
  const [estimateMode, setEstimateMode] = useState(false);
  
  const height = watch('height_cm');
  const weight = watch('weight_kg');
  
  React.useEffect(() => {
    if (!estimateMode && height && weight && height > 0 && weight > 0) {
      const hMeters = height / 100;
      setValue('bmi', parseFloat((weight / (hMeters * hMeters)).toFixed(2)));
    }
  }, [height, weight, estimateMode, setValue]);

  const handleEstimateSelection = (bmiValue: number) => {
    setValue('bmi', bmiValue);
    setValue('height_cm', null);
    setValue('weight_kg', null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Medical History</h3>
        <button type="button" onClick={() => setEstimateMode(!estimateMode)} className="text-sm font-bold text-[var(--primary)] hover:underline">
          {estimateMode ? "I know my exact metrics" : "I don't know my exact Height/Weight"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!estimateMode ? (
          <motion.div key="exact" initial={{ opacity: 0, h: 0 }} animate={{ opacity: 1, h: 'auto' }} exit={{ opacity: 0, h: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ClayInput label="Height (cm)" type="number" {...register('height_cm')} />
            <ClayInput label="Weight (kg)" type="number" {...register('weight_kg')} />
            <ClayInput label="BMI" type="number" step="0.01" readOnly {...register('bmi')} className="bg-gray-50" />
          </motion.div>
        ) : (
          <motion.div key="estimate" initial={{ opacity: 0, h: 0 }} animate={{ opacity: 1, h: 'auto' }} exit={{ opacity: 0, h: 0 }}>
            <label className="text-[var(--text-secondary)] text-sm font-medium mb-3 block">Please select the body type that best describes you:</label>
            <div className="grid grid-cols-3 gap-4">
              <div onClick={() => handleEstimateSelection(19.5)} className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-colors ${watch('bmi') === 19.5 ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-center mb-2 text-cyan-500"><User size={32} /></div>
                <div className="font-bold text-sm">Underweight / Slim</div>
              </div>
              <div onClick={() => handleEstimateSelection(23.5)} className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-colors ${watch('bmi') === 23.5 ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-center mb-2 text-cyan-500"><User size={32} /></div>
                <div className="font-bold text-sm">Average Build</div>
              </div>
              <div onClick={() => handleEstimateSelection(28.5)} className={`p-4 border-2 rounded-xl text-center cursor-pointer transition-colors ${watch('bmi') === 28.5 ? 'border-[var(--primary)] bg-[var(--primary-soft)]' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="flex justify-center mb-2 text-cyan-500"><User size={32} /></div>
                <div className="font-bold text-sm">Overweight / Stocky</div>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2 italic">We will use a statistical median to estimate your BMI for our AI models.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <ClayInput label="Allergies (comma separated)" placeholder="e.g., Peanuts" {...register('allergies')} />
        <ClayInput label="Current Medications" placeholder="e.g., Aspirin" {...register('current_medications')} />
        <ClayInput label="Past Surgeries" placeholder="e.g., Appendectomy 2015" {...register('past_surgeries')} />
      </div>
      
      <h4 className="font-semibold text-lg mt-6 mb-2">Chronic Diseases</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {['Diabetes', 'Hypertension', 'Asthma', 'Thyroid', 'Heart Disease', 'Other'].map(disease => (
          <label key={disease} className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[var(--primary)]">
            <input type="checkbox" value={disease} {...register('chronic_diseases')} className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">{disease}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// --- Step 3 ---
const Step3 = () => {
  const { register, watch, formState: { errors } } = useFormContext<PatientProfileForm>();
  const isSmoker = watch('smoking_status') === 'current' || watch('smoking_status') === 'former';

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Lifestyle Factors</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[var(--text-secondary)] text-sm font-medium mb-2 flex items-center">
            Smoking Status <InfoTooltip content="Helps predict cardiovascular and respiratory risks." />
          </label>
          <div className="flex gap-2">
            {['never', 'former', 'current'].map(status => (
              <label key={status} className="flex-1 text-center">
                <input type="radio" value={status} {...register('smoking_status')} className="peer sr-only" />
                <div className="p-2 border border-gray-200 bg-white rounded-lg cursor-pointer peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary-soft)] transition-all">
                  <span className="capitalize font-medium text-sm">{status}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {isSmoker && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <ClayInput 
              label={<>Pack Years <InfoTooltip content="Number of packs smoked per day × years smoked. (e.g. 1 pack/day for 10 years = 10)"/></>} 
              type="number" step="0.5" {...register('pack_years')} 
            />
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-secondary)] text-sm font-medium">Alcohol Consumption</label>
          <select {...register('alcohol_consumption')} className="w-full h-12 border border-gray-200 rounded-xl px-4">
            <option value="None">None</option>
            <option value="Occasional">Occasional</option>
            <option value="Regular">Regular</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[var(--text-secondary)] text-sm font-medium">Exercise Frequency</label>
          <select {...register('exercise_frequency')} className="w-full h-12 border border-gray-200 rounded-xl px-4">
            <option value="Sedentary">Sedentary</option>
            <option value="1-2x/week">1-2x/week</option>
            <option value="3-4x/week">3-4x/week</option>
            <option value="Daily">Daily</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">
            Sleep Hours: <span className="text-[var(--primary)] font-bold">{watch('sleep_hours')}h</span>
          </label>
          <input type="range" min="4" max="12" step="0.5" {...register('sleep_hours')} className="w-full accent-[var(--primary)]" />
        </div>
        
        <div>
          <label className="text-[var(--text-secondary)] text-sm font-medium block mb-2">
            Stress (1-10): <span className="text-[var(--primary)] font-bold">{watch('stress_level')}</span>
          </label>
          <input type="range" min="1" max="10" step="1" {...register('stress_level')} className="w-full accent-[var(--primary)]" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 md:w-1/2">
        <label className="text-[var(--text-secondary)] text-sm font-medium">Diet Type</label>
        <select {...register('diet_type')} className="w-full h-12 border border-gray-200 rounded-xl px-4">
          <option value="Non-Vegetarian">Non-Vegetarian</option><option value="Vegetarian">Vegetarian</option><option value="Vegan">Vegan</option><option value="Keto">Keto</option><option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};

// --- Step 4 ---
const Step4 = () => {
  const { register } = useFormContext<PatientProfileForm>();
  const historyItems = [
    { id: 'heart_disease', label: 'Heart Disease', color: 'var(--heart)' },
    { id: 'stroke', label: 'Stroke', color: 'var(--stroke)' },
    { id: 'diabetes', label: 'Diabetes', color: 'var(--diabetes)' },
    { id: 'cancer', label: 'Cancer', color: 'var(--info)' },
    { id: 'kidney_disease', label: 'Kidney Disease', color: '#6B7280' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center">
        Family Medical History <InfoTooltip content="Select 'Not Sure' if you are adopted or do not know your biological family's medical history." />
      </h3>
      <div className="p-4 bg-[var(--info-soft)] text-[var(--info)] rounded-xl text-sm mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>If you select "Not Sure", our AI models will automatically impute the missing data based on your personal lifestyle and demographic metrics.</p>
      </div>
      
      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2 mb-3 sm:mb-0">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` }}></div>
              <span className="font-bold text-[var(--text-primary)]">{item.label}</span>
            </div>
            
            <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-100">
              {['yes', 'no', 'not_sure'].map(opt => (
                <label key={opt} className="cursor-pointer">
                  <input type="radio" value={opt} {...register(`family_history.${item.id as keyof FamilyHistory}` as any)} className="peer sr-only" />
                  <div className="px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-colors peer-checked:bg-[var(--primary)] peer-checked:text-white text-gray-500 hover:bg-gray-100">
                    {opt.replace('_', ' ')}
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Step 5 ---
const Step5 = () => {
  const { register, setValue } = useFormContext<PatientProfileForm>();
  const [noLabs, setNoLabs] = useState(false);

  const handleToggleLabs = () => {
    const newState = !noLabs;
    setNoLabs(newState);
    if (newState) {
      // Clear all vitals
      setValue('vitals.heart_rate', null);
      setValue('vitals.blood_pressure_sys', null);
      setValue('vitals.blood_pressure_dia', null);
      setValue('vitals.spo2', null);
      setValue('vitals.respiratory_rate', null);
      setValue('vitals.body_temperature', null);
      setValue('vitals.blood_sugar', null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">Baseline Vitals & Labs</h3>
          <p className="text-sm text-[var(--text-secondary)]">Input recent lab results if available.</p>
        </div>
        <button type="button" onClick={handleToggleLabs} className="text-sm font-bold text-[var(--primary)] hover:underline border border-[var(--primary-soft)] bg-[var(--bg-card)] px-3 py-1.5 rounded-lg shadow-sm">
          {noLabs ? "I have recent lab results" : "I don't have recent labs"}
        </button>
      </div>
      
      <AnimatePresence>
        {!noLabs && (
          <motion.div initial={{ opacity: 0, h: 0 }} animate={{ opacity: 1, h: 'auto' }} exit={{ opacity: 0, h: 0, overflow: 'hidden' }} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <ClayInput label={<>Heart Rate <InfoTooltip content="Normal resting is 60-100 bpm."/></>} type="number" {...register('vitals.heart_rate')} />
            <ClayInput label={<>Sys BP <InfoTooltip content="Systolic. Normal is < 120."/></>} type="number" {...register('vitals.blood_pressure_sys')} />
            <ClayInput label={<>Dia BP <InfoTooltip content="Diastolic. Normal is < 80."/></>} type="number" {...register('vitals.blood_pressure_dia')} />
            <ClayInput label={<>SpO2 (%) <InfoTooltip content="Blood oxygen. Normal is 95-100%."/></>} type="number" {...register('vitals.spo2')} />
            <ClayInput label="Resp. Rate" type="number" {...register('vitals.respiratory_rate')} />
            <ClayInput label="Temp (°C)" type="number" step="0.1" {...register('vitals.body_temperature')} />
            <ClayInput label={<>Fasting Sugar <InfoTooltip content="Normal fasting is < 100 mg/dL."/></>} type="number" {...register('vitals.blood_sugar')} />
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 border-t pt-6 border-gray-100">Insurance Info (Optional)</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClayInput label="Provider" {...register('insurance.provider')} />
        <ClayInput label="Policy Number" {...register('insurance.policy_number')} />
        <ClayInput label="Coverage Type" {...register('insurance.coverage_type')} />
      </div>
    </div>
  );
};

// --- Step 6 ---
const Step6 = () => {
  const { getValues } = useFormContext<PatientProfileForm>();
  const data = getValues();
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Review Your Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClayCard className="p-4 bg-gray-50 border-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Personal</h4>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Name:</dt><dd className="font-medium text-[var(--text-primary)]">{data.full_name}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Age/Gender:</dt><dd className="font-medium text-[var(--text-primary)]">{data.age} / {data.gender}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Blood Group:</dt><dd className="font-medium text-[var(--text-primary)]">{data.blood_group}</dd></div>
          </dl>
        </ClayCard>
        
        <ClayCard className="p-4 bg-gray-50 border-0">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">Medical Summary</h4>
          <dl className="text-sm space-y-2">
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">BMI:</dt><dd className="font-medium text-[var(--text-primary)]">{data.bmi || 'Estimated'}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Smoking:</dt><dd className="font-medium text-[var(--text-primary)] capitalize">{data.smoking_status}</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--text-secondary)]">Chronic Diseases:</dt><dd className="font-medium text-[var(--text-primary)] text-right">{data.chronic_diseases?.join(', ') || 'None'}</dd></div>
          </dl>
        </ClayCard>
      </div>

      <div className="mt-8 p-4 border-l-4 border-[var(--primary)] bg-[var(--primary-soft)] rounded-r-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 w-5 h-5 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded" />
          <span className="text-sm text-[var(--text-secondary)]">
            I confirm that the provided medical information is accurate to the best of my knowledge. I understand that AI predictions are for informational purposes only.
          </span>
        </label>
      </div>
    </div>
  );
};

// --- Main Wrapper ---
export function PatientOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  
  const methods = useForm<PatientProfileForm>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      chronic_diseases: [],
      sleep_hours: 7,
      stress_level: 5,
      alcohol_consumption: 'None',
      exercise_frequency: 'Sedentary',
      diet_type: 'Non-Vegetarian',
      family_history: {
        heart_disease: 'no', stroke: 'no', diabetes: 'no', cancer: 'no', kidney_disease: 'no'
      }
    },
    mode: 'onChange'
  });

  const { trigger, getValues } = methods;

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    switch (currentStep) {
      case 0: fieldsToValidate = ['full_name', 'date_of_birth', 'age', 'gender', 'blood_group', 'phone', 'address', 'emergency_contact']; break;
      case 1: fieldsToValidate = ['height_cm', 'weight_kg', 'bmi']; break;
      case 2: fieldsToValidate = ['smoking_status']; break;
      default: fieldsToValidate = []; break;
    }
    
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate) : true;
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const onSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please review all steps. Some required data is missing.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const data = getValues();
      const payload = {
        ...data,
        allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        current_medications: data.current_medications ? data.current_medications.split(',').map(s => s.trim()).filter(Boolean) : [],
        past_surgeries: data.past_surgeries ? data.past_surgeries.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      
      await api.post('/patient/profile', payload);
      
      const user = useAuthStore.getState().user;
      const token = useAuthStore.getState().accessToken;
      if (user && token) {
        setAuth({ ...user, is_onboarded: true, full_name: data.full_name }, token);
      }
      toast.success('Onboarding complete! Welcome to SmartVital.');
      navigate('/patient/dashboard');
      
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      let errorMessage = 'Failed to save profile';
      if (Array.isArray(detail)) {
        errorMessage = detail.map((d: any) => `${d.loc?.slice(-1) || 'Field'}: ${d.msg}`).join(' | ');
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
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
            {(() => {
              switch (currentStep) {
                case 0: return <Step1 />;
                case 1: return <Step2 />;
                case 2: return <Step3 />;
                case 3: return <Step4 />;
                case 4: return <Step5 />;
                case 5: return <Step6 />;
                default: return null;
              }
            })()}
          </StepperForm>
        </form>
      </FormProvider>
    </div>
  );
}
