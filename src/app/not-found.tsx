import Link from "next/link"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-6">
      <p className="kicker text-[#6d6248]">404</p>
      <h1 className="font-display mt-3 text-5xl">This page is not on the site</h1>
      <p className="mt-4 text-[#5c574e]">Bu sayfa sitede yok.</p>
      <div className="mt-8 flex gap-4">
        <Link className="underline" href="/tr">Türkçe</Link>
        <Link className="underline" href="/en">English</Link>
      </div>
    </main>
  )
}
