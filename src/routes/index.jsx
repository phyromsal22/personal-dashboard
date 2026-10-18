import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import LandingPage from '@/features/landing/LandingPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import HabitsPage from '@/features/habits/HabitsPage'
import ExpensesPage from '@/features/expenses/ExpensesPage'
import MoodPage from '@/features/mood/MoodPage'
import SettingsPage from '@/features/settings/SettingsPage'
import LoginPage from '@/features/auth/LoginPage'
import UpdatePasswordPage from '@/features/auth/UpdatePasswordPage'
import SavingsPage from '@/features/savings/SavingsPage' // បន្ថែម

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/update-password', element: <UpdatePasswordPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'habits', element: <HabitsPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'savings', element: <SavingsPage /> }, // បន្ថែម Route
      { path: 'mood', element: <MoodPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}