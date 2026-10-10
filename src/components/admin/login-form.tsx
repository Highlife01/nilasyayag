"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/server/admin-actions"

export function LoginForm() {
  const [state, action] = useActionState(loginAction, { error: "" })
  return (
    <form action={action} className="mt-8 grid gap-4">
      {state.error ? (
        <p className="border border-[#8c3a2f] bg-[#f8ece8] px-3 py-2 text-sm" role="alert">
          {state.error === "otp" ? "Doğrulama kodu geçersiz." : state.error === "rate" ? "Çok fazla deneme." : "E-posta veya parola uygun değil."}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="email">E-posta</Label>
        <Input id="email" name="email" type="email" required autoComplete="username" className="h-11! rounded-none" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Parola</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" className="h-11! rounded-none" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="otp">Doğrulama kodu</Label>
        <Input id="otp" name="otp" inputMode="numeric" autoComplete="one-time-code" className="h-11! rounded-none" />
      </div>
      <Button type="submit" className="h-11! rounded-none">
        Giriş
      </Button>
    </form>
  )
}
