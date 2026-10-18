import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import DashboardPage from '@/features/dashboard/DashboardPage'
import HabitsPage from '@/features/habits/HabitsPage'
import ExpensesPage from '@/features/expenses/ExpensesPage'
import MoodPage from '@/features/mood/MoodPage'
import SettingsPage from '@/features/settings/SettingsPage'
import LoginPage from '@/features/auth/LoginPage' // បន្ថែម

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> }, // បន្ថែម Route នេះ
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'habits', element: <HabitsPage /> },
      { path: 'expenses', element: <ExpensesPage /> },
      { path: 'mood', element: <MoodPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}