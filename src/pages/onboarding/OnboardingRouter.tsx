import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { PatientOnboarding } from './PatientOnboarding';
import { DoctorOnboarding } from './DoctorOnboarding';
import { ClayButton } from '../../components/ui/ClayButton';

export function OnboardingRouter() {
  const role = useAuthStore(state => state.role);
  const setAuth = useAuthStore(state => state.setAuth);
  const navigate = useNavigate();

  const handleBypass = () => {
    const user = useAuthStore.getState().user;
    const token = useAuthStore.getState().accessToken;
    if (user && token) {
      setAuth({ ...user, is_onboarded: true }, token);
    }
    navigate(`/${role}/dashboard`);
  };

  switch (role) {
    case 'patient':
      return <PatientOnboarding />;
    case 'doctor':
      return <DoctorOnboarding />;
    case 'researcher':
    case 'admin':
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
          <div className="text-center p-8 bg-white rounded-[var(--radius-lg)] shadow-sm max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Welcome to SmartVital</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Your role <span className="font-bold capitalize text-[var(--primary)]">{role}</span> does not require any additional setup.
            </p>
            <ClayButton onClick={handleBypass} className="w-full">
              Proceed to Dashboard
            </ClayButton>
          </div>
        </div>
      );
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4">
          <div className="text-center p-8 bg-white rounded-[var(--radius-lg)] shadow-sm max-w-md">
            <h2 className="text-2xl font-bold mb-4">Setup Required</h2>
            <p className="text-[var(--text-secondary)]">
              Your role ({role}) currently requires manual setup by an administrator. Please contact support.
            </p>
          </div>
        </div>
      );
  }
}
