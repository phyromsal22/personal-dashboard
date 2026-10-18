import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { AppRouter } from '@/routes'
import { useSettingsStore } from '@/store/settingsStore'

export default function App() {
  const accentColor = useSettingsStore((state) => state.accentColor)

  // ពេលពណ៌ផ្លាស់ប្តូរ ឱ្យវា Update ទៅ HTML ភ្លាមៗ
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor)
  }, [accentColor])

  return (
    <>
      <AppRouter />
      <Toaster theme="dark" position="bottom-right" richColors />
    </>
  )
}