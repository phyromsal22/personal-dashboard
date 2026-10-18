import { Link, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="card w-full max-w-md p-8 text-center border-danger/30">
        <div className="h-16 w-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">មានបញ្ហាបន្តិចហើយ!</h1>
        <p className="text-text-secondary text-sm mb-6">
          សូមទោស យើងមិនអាចបង្ហាញទំព័រនេះបានទេ។ វាអាចបណ្តាលមកពី Link មិនត្រឹមត្រូវ។
        </p>
        <Link to="/dashboard">
          <Button className="w-full">ត្រឡប់ទៅ Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}