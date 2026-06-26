import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import { ClayCard } from '../../components/ui/ClayCard';
import { ClayInput } from '../../components/ui/ClayInput';
import { ClayButton } from '../../components/ui/ClayButton';
import { api } from '../../api/axios';

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 characters").max(6),
  new_password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.new_password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');

  const { register: registerForgot, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const { register: registerReset, handleSubmit: handleResetSubmit, formState: { errors: resetErrors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onForgotSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setEmail(data.email);
      setIsSent(true);
      toast.success('OTP sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { 
        email: email, 
        otp: data.otp, 
        new_password: data.new_password 
      });
      toast.success('Password reset successfully. Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <ClayCard className="p-8">
          <div className="mb-6">
            <Link to="/login" className="text-[var(--text-secondary)] hover:text-[var(--primary)] flex items-center text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">Reset Password</h2>
          
          {!isSent ? (
            <>
              <p className="text-[var(--text-secondary)] mb-6">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-5">
                <ClayInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  {...registerForgot('email')}
                  error={forgotErrors.email?.message}
                />
                
                <ClayButton type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </ClayButton>
              </form>
            </>
          ) : (
            <>
              <p className="text-[var(--text-secondary)] mb-6">
                Please enter the 6-digit OTP sent to <strong className="text-blue-500">{email}</strong> along with your new password.
              </p>
              <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-5">
                <ClayInput
                  label="6-Digit OTP"
                  type="text"
                  placeholder="e.g. 123456"
                  maxLength={6}
                  {...registerReset('otp')}
                  error={resetErrors.otp?.message}
                />
                <ClayInput
                  label="New Password"
                  type="password"
                  placeholder="Min 8 characters"
                  {...registerReset('new_password')}
                  error={resetErrors.new_password?.message}
                />
                <ClayInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="Retype password"
                  {...registerReset('confirmPassword')}
                  error={resetErrors.confirmPassword?.message}
                />
                
                <ClayButton type="submit" fullWidth disabled={isLoading}>
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </ClayButton>
              </form>
            </>
          )}
          
        </ClayCard>
      </motion.div>
    </div>
  );
}
