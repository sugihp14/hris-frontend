'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/libs/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Route } from 'next'
import Image from "next/image"

const REMEMBER_KEY = 'hris.rememberEmail'

export default function SignInSplit() {
  const router = useRouter()
   const search = useSearchParams()
   const redirect = search.get('redirect') || '/'
   const signIn = useAuthStore((s) => s.signIn)
 
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState<string | null>(null)
   const [loading, setLoading] = useState(false)
   const [showPassword, setShowPassword] = useState(false)
   const [remember, setRemember] = useState(true)
 
   const emailRef = useRef<HTMLInputElement>(null)
      const passRef = useRef<HTMLInputElement>(null)
 
   const redirectSafe = useMemo(() => {
     if (!redirect.startsWith('/')) return '/'
     if (redirect.startsWith('//')) return '/'
     return redirect
   }, [redirect])
 
   useEffect(() => {
     const remembered = localStorage.getItem(REMEMBER_KEY) || ''
     if (remembered) setEmail(remembered)
   
     emailRef.current?.focus()
   }, [])
 
   useEffect(() => {
     if (remember) localStorage.setItem(REMEMBER_KEY, email.trim())
     else localStorage.removeItem(REMEMBER_KEY)
   }, [remember, email])
 
   const emailInvalid =
     email.length > 0 &&
     !(/\S+@\S+\.\S+/.test(email) || email.endsWith('.local'))
 

 
   const isValid = !emailInvalid && !!email && password.length >= 6
 
   async function onSubmit(e: React.FormEvent) {
     e.preventDefault()
     if (!isValid || loading) {
       if (emailInvalid) emailRef.current?.focus()
       else if (password.length < 6) passRef.current?.focus()
       return
     }
     try {
       setError(null)
       setLoading(true)
       await signIn(email.trim(), password)
 
       router.replace(redirectSafe as Route)
 
      
     } catch (err: any) {
       const msg =
         typeof err === 'string'
           ? err
           : err?.message || 'Gagal masuk. Periksa kredensial Anda.'
       setError(msg)
       passRef.current?.focus()
       passRef.current?.select()
     } finally {
       setLoading(false)
     }
   }
 


  return (
    <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden">
        {/* Image with parallax effect */}
        <div className="absolute inset-0 overflow-hidden group">
          <Image 
            src="/login-page.png" 
            width={150}
            height={150}
            alt="Dashboard Preview"
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-indigo-900/30" />
        </div>
        
        {/* Branding Content */}
        <div className="relative z-10 text-center max-w-lg space-y-6">
          <div className="flex justify-center">
        
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Dexa HRIS System</span>
          </h1>
         
         
        </div>
      </div>

      {/* Right panel (form) */}
      <main className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-2xl border border-neutral-200/70 bg-white shadow-xl">
            {/* Accent top bar */}
            <div className="h-2 rounded-t-2xl bg-gradient-to-r from-sky-400 to-indigo-500" />

            <div className="p-8 sm:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral-800">Welcome back</h2>
                <p className="text-sm text-neutral-500 mt-1">Sign To Continue</p>
              </div>

              <form className="space-y-5" onSubmit={onSubmit}>
                {/* Email */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="h-12 pl-9"
                    autoComplete="username"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    className="h-12 pr-11"
                    autoComplete="current-password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 text-neutral-500 hover:text-neutral-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-600">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="h-4 w-4 accent-indigo-600"
                    />
                    Remember me
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? 'Processing…' : 'Sign in'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
