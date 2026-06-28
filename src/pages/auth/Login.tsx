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
import { useAuthStore } from '../../store/auth.store';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { GoogleLogin } from '@react-oauth/google';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(['patient', 'doctor', 'admin', 'researcher'])
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'patient'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      if (!executeRecaptcha) {
        toast.error('CAPTCHA not initialized yet');
        setIsLoading(false);
        return;
      }

      const token = await executeRecaptcha("login");
      const payload = { ...data, captchaToken: token };

      const response = await api.post('/auth/login', payload);
      const { access_token, user } = response.data;
      
      if (user.role !== data.role) {
        toast.error(`Invalid role selected for this account.`);
        return;
      }
      
      setAuth(user, access_token);
      toast.success('Logged in successfully');
      
      if (!user.is_onboarded) {
        navigate('/onboarding');
      } else {
        navigate(`/${user.role}/dashboard`);
      }
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Account not verified. Check your email for OTP.');
        navigate('/verify-otp', { state: { email: data.email } });
      } else {
        toast.error(error.response?.data?.detail || 'Login failed');
      }
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
      toast.success('Logged in with Google successfully');
      
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
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
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">SmartVital</h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-md">
            Clinical intelligence and multi-disease risk prediction, powered by advanced AI and IoT.
          </p>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ClayCard className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Welcome Back</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Role Selector */}
              <div className="flex bg-[var(--bg-primary)] p-1 rounded-full mb-4 overflow-hidden">
                {['patient', 'doctor', 'admin', 'researcher'].map(role => (
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
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                error={errors.email?.message}
              />
              
              <div className="relative">
                <ClayInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-9 text-xs text-[var(--text-muted)] hover:text-[var(--primary)]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
              <ClayButton type="submit" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </ClayButton>

            </form>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm">
              <Link to="/forgot-password" className="text-[var(--primary)] hover:underline mb-2 sm:mb-0">
                Forgot Password?
              </Link>
              <span className="text-[var(--text-secondary)]">
                New to SmartVital? <Link to="/signup" className="text-[var(--primary)] font-medium hover:underline">Create account</Link>
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
                  onError={() => toast.error('Google Login failed')}
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
