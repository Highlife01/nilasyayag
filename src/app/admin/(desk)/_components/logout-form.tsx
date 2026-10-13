"use client"

import { useActionState } from "react"
import { LogOut } from "lucide-react"
import { logoutAction } from "@/server/admin-actions"

export function LogoutForm() {
  const [state, action, pending] = useActionState(logoutAction, { error: "" })
  return (
    <form action={action} className="max-w-40">
      <button type="submit" disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-400 transition hover:bg-rose-950/40 hover:text-rose-300 disabled:opacity-60">
        <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{pending ? "Kapatılıyor…" : "Çıkış"}</span>
      </button>
      {state.error ? <p role="alert" className="mt-2 text-xs text-rose-300">{state.error}</p> : null}
    </form>
  )
}
