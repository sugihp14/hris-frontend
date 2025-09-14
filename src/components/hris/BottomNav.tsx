'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import {
  LayoutDashboard, Users2, CalendarCheck2, Clock
} from 'lucide-react'

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ')
}

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const NAV_ITEMS: Item[] = [
  { href: '/user/attendance', label: 'Absen', icon: CalendarCheck2 },
  { href: '/user/history', label: 'History', icon: Clock },
  { href: '/user/profile', label: 'Profil', icon: Users2 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg md:hidden"
      aria-label="Bottom Navigation"
    >
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cx(
              'flex flex-col items-center justify-center text-xs font-medium w-full h-full transition-colors',
              pathname === item.href
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}