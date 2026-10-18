import { Toaster } from 'sonner'
import { AppRouter } from '@/routes'

export default function App() {
  return (
    <>
      <AppRouter />
      <Toaster theme="dark" position="bottom-right" richColors />
    </>
  )
}