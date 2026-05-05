'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'

export default function RegistrationSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push('/auth/login')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Created Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for registering. Your account has been created successfully.
          You'll be redirected to the login page in a few seconds.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Login
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="w-full"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
