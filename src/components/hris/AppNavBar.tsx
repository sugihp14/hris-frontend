'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, ArrowLeft, CalendarDays, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/libs/stores/auth'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

type AppNavbarProps = {
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export default function AppNavbar({
  title,
  showBack = false,
  onBack,
}: AppNavbarProps) {
  const router = useRouter()
  const signOut = useAuthStore((s) => s.signOut)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const Brand = useMemo(
    () => (
      <button
        className="flex items-center gap-2 select-none"
        onClick={() => router.push('/')}
        aria-label="Beranda"
      >
        <div className="w-8 h-8 rounded-xl bg-primary/10 grid place-content-center font-bold">D</div>
        <span className="font-bold">
          DEXA HRIS SYSTEM
        </span>
      </button>
    ),
    [router],
  )

  const handleSignOut = async () => {
    try {
      await signOut()
      if (typeof window !== 'undefined') {
        window.location.href = '/signin'
      }
    } catch (error) {
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className=" px-3 sm:px-4  h-14">
          <div className="h-full flex items-center gap-3">
            <div className="min-w-[40px] flex items-center">
              {showBack ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={onBack ?? (() => router.back())}
                  aria-label="Kembali"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              ) : (
                <div className="md:hidden">{Brand}</div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center md:justify-start">
              {title ? (
                <div className="text-base sm:text-lg font-semibold truncate">{title}</div>
              ) : (
                <div className="hidden md:block">{Brand}</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={openModal}
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleSignOut}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmText="Logout"
        cancelText="Batal"
      />
    </>
  )
}
