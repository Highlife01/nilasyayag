import { CONTACT_PHONE, WHATSAPP_URL } from "@/lib/site"

export function WhatsAppButton() {
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${CONTACT_PHONE}`} className="fixed bottom-6 end-6 z-50 flex min-h-14 items-center gap-3 rounded-full bg-[#25d366] px-5 py-3 font-semibold text-[#063c1b] shadow-lg shadow-black/20 transition hover:bg-[#20c05c] focus-visible:outline-emerald-800">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6 shrink-0" aria-hidden="true">
        <path d="M21 11.5a9 9 0 0 1-13.3 8L3 21l1.5-4.7A9 9 0 1 1 21 11.5Z" />
        <path d="m8.5 7.5 1.8 2-1 1.5a8 8 0 0 0 3.2 3.2l1.5-1 2 1.8c-.3 1.4-1.2 2-2.7 1.6-3.2-.9-5.7-3.4-6.6-6.6-.4-1.5.2-2.4 1.8-2.5Z" />
      </svg>
      <span>WhatsApp</span>
    </a>
  )
}