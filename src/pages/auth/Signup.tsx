import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { ClayCard } from '../../components/ui/ClayCard';
import { ClayInput } from '../../components/ui/ClayInput';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../store/auth.store';

const signupSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  role: z.enum(['patient', 'doctor', 'researcher']),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the Terms & Medical Data Consent" })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export function Signup() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'patient'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      if (!executeRecaptcha) {
        toast.error('CAPTCHA not initialized yet');
        setIsLoading(false);
        return;
      }

      const token = await executeRecaptcha("signup");

      const payload = {
        email: data.email,
        password: data.password,
        role: data.role,
        full_name: data.full_name,
        phone: data.phone || null,
        captchaToken: token
      };
      
      await api.post('/auth/signup', payload);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-otp', { state: { email: data.email } });
      
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
        role: selectedRole
      });
      const { access_token, user } = response.data;
      
      setAuth(user, access_token);
      toast.success('Signed in with Google successfully');
      
      if (!user.is_onboarded) {
        navigate('/onboarding');
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Google Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Animated Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col items-center justify-center text-center p-8"
        >
          <div className="mb-6">
            <img src="/logo.png" alt="SmartVital Logo" width="220" height="220" className="object-contain drop-shadow-[0_0_35px_rgba(6,182,212,0.6)]" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Join SmartVital</h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-md">
            Secure, precise, and proactive health management.
          </p>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ClayCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Create Account</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Role Selector */}
              <div className="flex bg-[var(--bg-primary)] p-1 rounded-full mb-4 overflow-hidden">
                {['patient', 'doctor', 'researcher'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setValue('role', role as any)}
                    className={`flex-1 text-xs sm:text-sm py-2 px-1 rounded-full font-medium transition-all capitalize ${
                      selectedRole === role 
                        ? 'bg-[var(--primary)] text-white shadow-md' 
                        : 'text-[var(--text-secondary)] hover:bg-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <ClayInput
                label="Full Name"
                placeholder="John Doe"
                {...register('full_name')}
                error={errors.full_name?.message}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ClayInput
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <ClayInput
                  label="Phone (Optional)"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ClayInput
                  label="Password"
                  type="password"
                  placeholder="Min 8 characters"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <ClayInput
                  label="Confirm Password"
                  type="password"
                  placeholder="Retype password"
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                />
              </div>

              <div className="pt-2 pb-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-1">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 border-2 border-[var(--text-muted)] rounded transition-colors checked:bg-[var(--primary)] checked:border-[var(--primary)]"
                      {...register('consent')}
                    />
                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-sm text-[var(--text-secondary)] leading-tight">
                    I agree to the Terms of Service and consent to the processing of my medical data according to the Privacy Policy.
                  </span>
                </label>
                {errors.consent && (
                  <p className="text-[var(--danger)] text-xs font-medium ml-8 mt-1">{errors.consent.message}</p>
                )}
              </div>
              
              <ClayButton type="submit" fullWidth disabled={isLoading} className="mt-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </ClayButton>

            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-[var(--text-secondary)]">
                Already have an account? <Link to="/login" className="text-[var(--primary)] font-medium hover:underline">Sign In</Link>
              </span>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--border-color)]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[var(--bg-card)] text-[var(--text-muted)]">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Sign Up failed')}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                />
              </div>
            </div>
            
          </ClayCard>
        </motion.div>

      </div>
    </div>
  );
}
