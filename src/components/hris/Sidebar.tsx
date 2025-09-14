'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'
import {
  Users2, CalendarCheck2,
  
 Clock
} from 'lucide-react'
import { BottomNav } from './BottomNav'

/** mini clsx tanpa dependency */
function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(' ')
}

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const PRIMARY: Item[] = [
  { href: '/user/attendance', label: 'Attendance', icon: CalendarCheck2 },
  { href: '/user/history', label: 'History', icon: Clock },
  { href: '/user/profile', label: 'Profile', icon: Users2 },
]

const LS_COLLAPSE = 'hris.sidebar.collapsed'
const LS_WIDTH = 'hris.sidebar.width'

export function Sidebar() {
  const pathname = usePathname()
  const railMin = 80
  const wideMin = 240
  const wideMax = 360

  const [collapsed, setCollapsed] = React.useState(false)
  const [width, setWidth] = React.useState<number>(288)
  const [hovering, setHovering] = React.useState(false)
  const [dark, setDark] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    const c = localStorage.getItem(LS_COLLAPSE)
    const w = localStorage.getItem(LS_WIDTH)
    if (c) setCollapsed(c === '1')
    if (w) {
      const num = parseInt(w, 10)
      if (!Number.isNaN(num)) setWidth(Math.min(wideMax, Math.max(wideMin, num)))
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true)
    }
  }, [])

  const saveCollapsed = (v: boolean) => localStorage.setItem(LS_COLLAPSE, v ? '1' : '0')
  const saveWidth = (n: number) => localStorage.setItem(LS_WIDTH, String(n))

  const draggingRef = React.useRef(false)
  const startX = React.useRef(0)
  const startW = React.useRef(0)
  const onMouseDown = (e: React.MouseEvent) => {
    if (collapsed) return
    draggingRef.current = true
    startX.current = e.clientX
    startW.current = width
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
  }

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return
      const delta = e.clientX - startX.current
      const next = Math.min(wideMax, Math.max(wideMin, startW.current + delta))
      setWidth(next)
    }
    const onUp = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      saveWidth(width)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [width])

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const handler = () => {
      setCollapsed(mq.matches)
      saveCollapsed(mq.matches)
    }
    handler()
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.style.colorScheme = 'light'
    }
  }, [dark])

  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const effectiveCollapsed = collapsed && !hovering

  const isActive = React.useCallback(
    (href: string) => pathname === href || pathname.startsWith(href + '/'),
    [pathname]
  )

  const DesktopSidebar = () => (
    <aside
      className={cx(
        'hidden md:flex flex-col',
        'bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-800',
        'border-r border-neutral-200/70 dark:border-neutral-700/50',
        'backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-900/80',
        'shadow-sm dark:shadow-neutral-900/30',
        'relative select-none transition-[width] duration-300 ease-out'
      )}
      style={{ width: effectiveCollapsed ? railMin : width }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label="Navigasi utama"
    >
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex items-center gap-2 px-4 py-4">
          <div className="flex items-center gap-3">
            {!effectiveCollapsed && (
              <div className="mr-auto leading-tight">
                <div className="font-bold text-neutral-800 dark:text-white">Dexa</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">HRIS SYSTEM</div>
              </div>
            )}
          </div>
       
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200/70 dark:via-neutral-700/50 to-transparent mx-4" />
        <div className="flex-1 overflow-y-auto py-4" role="navigation" aria-label="Menu">
          <Section title="Menu" collapsed={effectiveCollapsed}>
            {PRIMARY.map((it) => (
              <NavItem key={it.href} item={it} active={isActive(it.href)} collapsed={effectiveCollapsed} />
            ))}
          </Section>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200/70 dark:via-neutral-700/50 to-transparent my-3 mx-4" />
        </div>
      </div>
      {!effectiveCollapsed && (
        <div
          role="separator"
          aria-orientation="vertical"
          onMouseDown={onMouseDown}
          className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none bg-transparent hover:bg-indigo-400/20 active:bg-indigo-400/30 transition-colors"
          title="Seret untuk mengubah lebar"
        />
      )}
    </aside>
  )


  return (
    <>
      <DesktopSidebar />
      <BottomNav />
    </>
  )
}

function Section({
  title, collapsed, children,
}: { title: string; collapsed: boolean; children: React.ReactNode }) {
  return (
    <div className="px-3 py-2">
      {!collapsed && (
        <div className="sticky top-0 z-10 mb-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {title}
        </div>
      )}
      <div role="list" className="space-y-1">
        {children}
      </div>
    </div>
  )
}

function NavItem({
  item, active, collapsed,
}: { item: Item; active: boolean; collapsed: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cx(
        'group relative flex items-center gap-3 px-3 py-3 text-sm outline-none transition-all duration-200',
        'hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:shadow-sm',
        'focus:bg-neutral-100 dark:focus:bg-neutral-700/50',
        active
          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm [&>svg]:text-indigo-600 dark:[&>svg]:text-indigo-400'
          : 'text-neutral-600 dark:text-neutral-300'
      )}
      title={collapsed ? item.label : undefined}
      aria-current={active ? 'page' : undefined}
    >
      <span
        className={cx(
          'absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-all',
          active
            ? 'bg-indigo-500 dark:bg-indigo-400 opacity-100'
            : 'bg-neutral-300 dark:bg-neutral-600 opacity-0 group-hover:opacity-100'
        )}
      />
      <Icon className={cx('h-5 w-5 transition-colors', collapsed ? 'mx-auto' : '')} />
      {!collapsed && (
        <>
          <span className="truncate flex-1">{item.label}</span>
          <span className={cx(
            'ml-auto rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-all',
            active
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 opacity-0 group-hover:opacity-100'
          )}>
            •
          </span>
        </>
      )}
    </Link>
  )
}