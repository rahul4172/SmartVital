import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Signup } from '../pages/auth/Signup';
import { OTPVerify } from '../pages/auth/OTPVerify';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Wrappers
import { ProtectedRoute, RoleRoute, OnboardingRoute } from './ProtectedRoute';

// Onboarding
import { OnboardingRouter } from '../pages/onboarding/OnboardingRouter';

// Layout
import { MainLayout } from '../components/Layout/MainLayout';

// Dashboards
import { PatientDashboard } from '../pages/dashboards/PatientDashboard';
import { LiveMonitoring } from '../pages/dashboards/LiveMonitoring';
import { Predictions } from '../pages/dashboards/Predictions';
import { Simulator } from '../pages/dashboards/Simulator';
import { Explainability } from '../pages/dashboards/Explainability';
import { Comorbidity } from '../pages/dashboards/Comorbidity';
import { Reports } from '../pages/dashboards/Reports';
import { Profile } from '../pages/dashboards/Profile';
import { Timeline } from '../pages/dashboards/Timeline';
import { DoctorDashboard } from '../pages/dashboards/DoctorDashboard';
// Admin Dashboards
import { AdminDashboard } from '../pages/dashboards/AdminDashboard';
import { AdminUsers } from '../pages/dashboards/admin/AdminUsers';
import { AdminDoctors } from '../pages/dashboards/admin/AdminDoctors';
import { AdminPatients } from '../pages/dashboards/admin/AdminPatients';
import { AdminResearchers } from '../pages/dashboards/admin/AdminResearchers';
import { AdminDevices } from '../pages/dashboards/admin/AdminDevices';
import { AdminSystemHealth } from '../pages/dashboards/admin/AdminSystemHealth';
import { AdminAuditLogs } from '../pages/dashboards/admin/AdminAuditLogs';
import { AdminPermissions } from '../pages/dashboards/admin/AdminPermissions';
import { AdminAnalytics } from '../pages/dashboards/admin/AdminAnalytics';
import { AdminModelPerformance } from '../pages/dashboards/admin/AdminModelPerformance';
import { AdminPopulation } from '../pages/dashboards/admin/AdminPopulation';
import { MedicationsTracker } from '../pages/dashboards/MedicationsTracker';
import { PatientAlerts } from '../pages/dashboards/PatientAlerts';
import { LabVault } from '../pages/dashboards/LabVault';
import { SymptomChecker } from '../pages/dashboards/SymptomChecker';
import { RiskForecasting } from '../pages/dashboards/RiskForecasting';
import { VitalsHistory } from '../pages/dashboards/VitalsHistory';
import { Appointments } from '../pages/dashboards/Appointments';
import { MyDoctor } from '../pages/dashboards/MyDoctor';
import { Teleconsult } from '../pages/dashboards/Teleconsult';
import { HealthSummary } from '../pages/dashboards/HealthSummary';
import { MyDevices } from '../pages/dashboards/MyDevices';
import { DeviceSetup } from '../pages/dashboards/DeviceSetup';

// Doctor Pages
import { DoctorPatients } from '../pages/dashboards/DoctorPatients';
import { DoctorAlerts } from '../pages/dashboards/DoctorAlerts';
import { DoctorNotes } from '../pages/dashboards/DoctorNotes';
import { DoctorPrescriptions } from '../pages/dashboards/DoctorPrescriptions';
import { DoctorAppointments } from '../pages/dashboards/DoctorAppointments';
import { DoctorRiskOverview } from '../pages/dashboards/DoctorRiskOverview';
import { DoctorComorbidity } from '../pages/dashboards/DoctorComorbidity';
import { DoctorReports } from '../pages/dashboards/DoctorReports';
import { DoctorAnalytics } from '../pages/dashboards/DoctorAnalytics';
import { DoctorMessages } from '../pages/dashboards/DoctorMessages';
import { DoctorProfile } from '../pages/dashboards/DoctorProfile';

// Researcher Pages
import { ResearcherDashboard } from '../pages/dashboards/researcher/ResearcherDashboard';
import { PopulationTrends } from '../pages/dashboards/researcher/PopulationTrends';
import { DiseaseCorrelations } from '../pages/dashboards/researcher/DiseaseCorrelations';
import { FeatureImportance } from '../pages/dashboards/researcher/FeatureImportance';
import { CohortAnalysis } from '../pages/dashboards/researcher/CohortAnalysis';
import { AnonymizedDataset } from '../pages/dashboards/researcher/AnonymizedDataset';
import { ResearchReports } from '../pages/dashboards/researcher/ResearchReports';
import { ResearchPredictions } from '../pages/dashboards/researcher/ResearchPredictions';

// Placeholders for future pages
const NotFound = () => <div>404 Not Found</div>;
const Forbidden = () => <div>403 Forbidden - Unauthorized Role</div>;

// Global Error Boundary
import { GlobalError } from '../components/shared/GlobalError';

export const router = createBrowserRouter([
  // Public Auth Routes
  { path: '/login', element: <Login />, errorElement: <GlobalError /> },
  { path: '/signup', element: <Signup />, errorElement: <GlobalError /> },
  { path: '/verify-otp', element: <OTPVerify />, errorElement: <GlobalError /> },
  { path: '/forgot-password', element: <ForgotPassword />, errorElement: <GlobalError /> },
  
  // Protected Routes
  {
    element: <ProtectedRoute />,
    errorElement: <GlobalError />,
    children: [
      {
        // Onboarding flow (Requires auth, but not onboarded yet)
        path: '/onboarding',
        element: <OnboardingRouter />
      },
      {
        // Fully onboarded users only -> Render inside MainLayout
        element: <OnboardingRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              // Patient Routes
              {
                element: <RoleRoute allowedRoles={['patient']} />,
                children: [
                  { path: '/patient/dashboard', element: <PatientDashboard /> },
                  { path: '/patient/monitoring', element: <LiveMonitoring /> },
                  { path: '/patient/vitals', element: <VitalsHistory /> },
                  { path: '/patient/symptoms', element: <SymptomChecker /> },
                  { path: '/patient/forecast', element: <RiskForecasting /> },
                  { path: '/patient/predict', element: <Predictions /> },
                  { path: '/patient/predictions/:model', element: <Predictions /> },
                  { path: '/patient/predictions', element: <Predictions /> },
                  { path: '/patient/explainability', element: <Explainability /> },
                  { path: '/patient/simulator', element: <Simulator /> },
                  { path: '/patient/comorbidity', element: <Comorbidity /> },
                  { path: '/patient/reports', element: <Reports /> },
                  { path: '/patient/profile', element: <Profile /> },
                  { path: '/patient/timeline', element: <Timeline /> },
                  { path: '/patient/alerts', element: <PatientAlerts /> },
                  { path: '/patient/medications', element: <MedicationsTracker /> },
                  { path: '/patient/labs', element: <LabVault /> },
                  { path: '/patient/appointments', element: <Appointments /> },
                  { path: '/patient/doctor', element: <MyDoctor /> },
                  { path: '/patient/teleconsult', element: <Teleconsult /> },
                  { path: '/patient/summary', element: <HealthSummary /> },
                  { path: '/patient/devices', element: <MyDevices /> },
                  { path: '/patient/devices/setup', element: <DeviceSetup /> }
                ]
              },
              // Doctor Routes
              {
                element: <RoleRoute allowedRoles={['doctor']} />,
                children: [
                  { path: '/doctor/dashboard', element: <DoctorDashboard /> },
                  { path: '/doctor/patients', element: <DoctorPatients /> },
                  { path: '/doctor/alerts', element: <DoctorAlerts /> },
                  { path: '/doctor/notes', element: <DoctorNotes /> },
                  { path: '/doctor/prescriptions', element: <DoctorPrescriptions /> },
                  { path: '/doctor/appointments', element: <DoctorAppointments /> },
                  { path: '/doctor/risk-overview', element: <DoctorRiskOverview /> },
                  { path: '/doctor/explainability', element: <Explainability /> },
                  { path: '/doctor/comorbidity', element: <DoctorComorbidity /> },
                  { path: '/doctor/reports', element: <DoctorReports /> },
                  { path: '/doctor/analytics', element: <DoctorAnalytics /> },
                  { path: '/doctor/messages', element: <DoctorMessages /> },
                  { path: '/doctor/profile', element: <DoctorProfile /> }
                ]
              },
              // Admin Routes
              {
                element: <RoleRoute allowedRoles={['admin']} />,
                children: [
                  { path: '/admin/dashboard', element: <AdminDashboard /> },
                  { path: '/admin/users', element: <AdminUsers /> },
                  { path: '/admin/doctors', element: <AdminDoctors /> },
                  { path: '/admin/patients', element: <AdminPatients /> },
                  { path: '/admin/researchers', element: <AdminResearchers /> },
                  { path: '/admin/devices', element: <AdminDevices /> },
                  { path: '/admin/system-health', element: <AdminSystemHealth /> },
                  { path: '/admin/audit-logs', element: <AdminAuditLogs /> },
                  { path: '/admin/permissions', element: <AdminPermissions /> },
                  { path: '/admin/analytics', element: <AdminAnalytics /> },
                  { path: '/admin/model-performance', element: <AdminModelPerformance /> },
                  { path: '/admin/population', element: <AdminPopulation /> }
                ]
              },
              // Researcher Routes
              {
                element: <RoleRoute allowedRoles={['researcher']} />,
                children: [
                  { path: '/researcher/dashboard', element: <ResearcherDashboard /> },
                  { path: '/researcher/population', element: <PopulationTrends /> },
                  { path: '/researcher/correlations', element: <DiseaseCorrelations /> },
                  { path: '/researcher/features', element: <FeatureImportance /> },
                  { path: '/researcher/cohorts', element: <CohortAnalysis /> },
                  { path: '/researcher/dataset', element: <AnonymizedDataset /> },
                  { path: '/researcher/reports', element: <ResearchReports /> },
                  { path: '/researcher/predictions', element: <ResearchPredictions /> }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  
  // Catch all
  { path: '/403', element: <Forbidden /> },
  { path: '*', element: <NotFound /> },
  
  // Root Redirect
  { 
    path: '/', 
    element: <Navigate to="/login" replace /> 
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
