'use client'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const supabase = createClient()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
  }

  // Don't render until client is mounted
  if (!mounted) return null

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">📚 Bookmark Manager</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Save and organize your favorite links</p>
      </div>
      
      <button 
        onClick={handleLogin}
        className="flex items-center gap-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-6 py-3 font-semibold text-gray-900 dark:text-white shadow-md hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
      >
        <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
        Sign in with Google
      </button>
    </div>
  )
}