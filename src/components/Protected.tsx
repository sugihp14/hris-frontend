
'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Route } from 'next'
import { useAuthStore } from '@/libs/stores/auth'

export function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const token = useAuthStore((s) => s.token)
  const refreshAccessToken = useAuthStore((s) => s.refreshAccessToken)

  const [ready, setReady] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const hasHydrated = (useAuthStore as any).persist?.hasHydrated?.() ?? true
    setReady(hasHydrated)
    
    const unsub = (useAuthStore as any).persist?.onFinishHydration?.(() => setReady(true))
    return () => { unsub?.() }
  }, [])

  const returnTo = useMemo(() => {
    const qs = search?.toString()
    const raw = qs ? `${pathname}?${qs}` : pathname || '/'
    if (!raw.startsWith('/') || raw.startsWith('//')) return '/' as Route
    return raw as Route
  }, [pathname, search])

  useEffect(() => {
    if (!ready) return

    if (!token) {
      (async () => {
        setChecking(true)
        const ok = await refreshAccessToken()
        setChecking(false)
        if (!ok) {
          const target = (`/signin?redirect=${encodeURIComponent(returnTo)}`) as Route
          router.replace(target)
        }
      })()
    } else {
      setChecking(false)
    }
  }, [ready, token, returnTo, router, refreshAccessToken])

  if (!ready || checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Memuat...</p>
      </div>
    )
  }

  if (!token) {
    return null
  }

  return <>{children}</>
}