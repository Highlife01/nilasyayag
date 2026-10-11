import { redirect } from "next/navigation"
import Link from "next/link"
import { can, type Action } from "@/lib/domain"
import { logoutAction } from "@/server/admin-actions"
import { readSession } from "@/server/session"
import {
  LayoutDashboard,
  Inbox,
  Package,
  Ship,
  Globe,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building2,
} from "lucide-react"

type NavLinkItem = {
  label: string
  href: string
  action: Action
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const NAV_ITEMS: NavLinkItem[] = [
  { label: "Genel Bakış", href: "/admin", action: "analytics", icon: LayoutDashboard },
  { label: "Talepler & CRM", href: "/admin/leads", action: "leads", icon: Inbox },
  { label: "Ürünler & Ambalaj", href: "/admin/products", action: "analytics", icon: Package },
  { label: "Lojistik & Radar", href: "/admin/logistics", action: "analytics", icon: Ship },
  { label: "SEO & GEO Merkezi", href: "/admin/seo", action: "seo", icon: Globe },
  { label: "Sayfalar & Diller", href: "/admin/pages", action: "seo", icon: FileText },
  { label: "Ayarlar & Güvenlik", href: "/admin/settings", action: "settings", icon: SettingsIcon },
]

export default async function DeskLayout({ children }: { children: React.ReactNode }) {
  const user = await readSession()
  if (!user) redirect("/admin/login")

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 md:grid md:grid-cols-[17.5rem_1fr]">
      {/* Sidebar */}
      <aside className="flex flex-col justify-between border-r border-slate-800 bg-[#0f1712] text-[#f6f1e6]">
        <div>
          {/* Brand header */}
          <div className="border-b border-slate-800/80 px-6 py-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8a6820] text-slate-950 font-black shadow-md">
                AO
              </span>
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-white leading-none">
                  ASIA OIL
                </p>
                <p className="text-[11px] font-medium tracking-[0.16em] text-[#e4c98a] uppercase mt-1">
                  Global Control Center
                </p>
              </div>
            </div>

            {/* User status pill */}
            <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  {user.role === "superadmin" ? "Süper Yönetici" : user.role}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 truncate font-mono">
                {user.email}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-3 py-4" aria-label="Admin Navigation">
            {NAV_ITEMS.filter((item) => can(user.role, item.action)).map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-[#e4c98a]" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800/80 p-4 space-y-3">
          {/* Storage policy note */}
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Sıfır LocalStorage: HttpOnly Güvenli Oturum</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href="/tr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#e4c98a] hover:underline"
            >
              <span>Siteyi Aç</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Çıkış</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Header */}
      <div className="flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">
              Asia Oil • B2B İhracat Yönetimi
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Mersin Limanı / TR (UTC+3)</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Cloud Firestore Aktif</span>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  )
}
