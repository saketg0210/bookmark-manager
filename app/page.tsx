'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <button 
        disabled={isLoading}
        onClick={handleLogin}
        className="flex items-center gap-2 rounded-lg border bg-white px-6 py-3 font-medium shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-black"></div>
        ) : (
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" />
        )}
        {isLoading ? 'Redirecting...' : 'Sign in with Google'}
      </button>
    </div>
  )
}