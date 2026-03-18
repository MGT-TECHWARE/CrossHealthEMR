import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import PTDashboard from '@/pages/pt/PTDashboard'
import SchedulePage from '@/pages/pt/SchedulePage'
import PatientsListPage from '@/pages/pt/PatientsListPage'
import AddPatientPage from '@/pages/pt/AddPatientPage'
import PatientChartPage from '@/pages/pt/PatientChartPage'
import StartSessionPage from '@/pages/pt/StartSessionPage'
import LiveSessionPage from '@/pages/pt/LiveSessionPage'
import ExerciseMatchPage from '@/pages/pt/ExerciseMatchPage'
import ExerciseLibraryPage from '@/pages/pt/ExerciseLibraryPage'
import TrackingPage from '@/pages/pt/TrackingPage'
import SettingsPage from '@/pages/pt/SettingsPage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRole="pt" />,
        children: [
          { path: '/pt/dashboard', element: <PTDashboard /> },
          { path: '/pt/schedule', element: <SchedulePage /> },
          { path: '/pt/live-session', element: <StartSessionPage /> },
          { path: '/pt/patients', element: <PatientsListPage /> },
          { path: '/pt/patients/new', element: <AddPatientPage /> },
          { path: '/pt/patients/:patientId', element: <PatientChartPage /> },
          { path: '/pt/session/:appointmentId', element: <LiveSessionPage /> },
          { path: '/pt/exercise-match/:appointmentId', element: <ExerciseMatchPage /> },
          { path: '/pt/exercises', element: <ExerciseLibraryPage /> },
          { path: '/pt/tracking', element: <TrackingPage /> },
          { path: '/pt/settings', element: <SettingsPage /> },
        ],
      },
      {
        element: <RoleRoute allowedRole="admin" />,
        children: [
          { path: '/admin/dashboard', element: <PTDashboard /> },
          { path: '/admin/schedule', element: <SchedulePage /> },
          { path: '/admin/live-session', element: <StartSessionPage /> },
          { path: '/admin/patients', element: <PatientsListPage /> },
          { path: '/admin/patients/new', element: <AddPatientPage /> },
          { path: '/admin/patients/:patientId', element: <PatientChartPage /> },
          { path: '/admin/session/:appointmentId', element: <LiveSessionPage /> },
          { path: '/admin/exercise-match/:appointmentId', element: <ExerciseMatchPage /> },
          { path: '/admin/exercises', element: <ExerciseLibraryPage /> },
          { path: '/admin/tracking', element: <TrackingPage /> },
          { path: '/admin/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <LandingPage /> },
])
