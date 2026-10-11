import { redirect } from "next/navigation"
import { LoginForm } from "@/components/admin/login-form"
import { readSession } from "@/server/session"

export const metadata = { title: "Giriş", robots: { index: false, follow: false } }

export default async function LoginPage() {
  if (await readSession()) redirect("/admin")
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="hidden bg-[#1a2416] p-12 text-[#f6f1e6] md:flex md:flex-col md:justify-between">
        <p className="font-display text-4xl">Asia Oil</p>
        <div>
          <p className="kicker text-[#e4c98a]">Global Control Center</p>
          <h1 className="font-display mt-3 text-5xl">Talepler, sayfalar, diller.</h1>
        </div>
      </section>
      <section className="flex items-center bg-[#f4f0e6] px-6 py-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-4xl">Yönetim girişi</h1>
          <p className="mt-2 text-sm text-[#5c574e]">Oturum yalnızca HttpOnly çerezde tutulur.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  )
}
