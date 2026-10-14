"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/server/admin-actions"

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, { error: "" })
  return (
    <form action={action} className="mt-8 grid gap-4">
      {state.error ? (
        <p className="border border-[#8c3a2f] bg-[#f8ece8] px-3 py-2 text-sm text-[#8c3a2f]" role="alert">
          {state.error === "rate"
            ? "Çok fazla başarısız giriş denemesi yapıldı. Lütfen biraz bekleyin."
            : state.error === "db"
              ? "Sunucu veritabanına bağlanılamadı. Lütfen tekrar deneyin."
              : "Kullanıcı adı (e-posta) veya şifre hatalı."}
        </p>
      ) : null}
      <div className="grid gap-2">
        <Label htmlFor="email">Kullanıcı Adı (E-posta)</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="cebrailkara@gmail.com"
          required
          autoComplete="username"
          className="h-11! rounded-none"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Şifre</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-11! rounded-none"
        />
      </div>
      <Button type="submit" disabled={isPending} className="h-11! rounded-none">
        {isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </Button>
    </form>
  )
}
