"use client"

import { useState } from "react"
import Link from "next/link"
import type { VisitorSession } from "@/lib/model"
import { formatDurationTr } from "@/lib/analytics"
import {
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Clock,
  CheckCircle2,
  Eye,
  X,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  FileText,
  MessageSquare,
} from "lucide-react"

function formatDateTimeTr(iso: string) {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Europe/Istanbul",
    }).format(new Date(iso))
  } catch {
    return iso.slice(0, 19).replace("T", " ")
  }
}

function DeviceIcon({ type }: { type: VisitorSession["deviceType"] }) {
  if (type === "telefon") return <Smartphone className="h-4 w-4 text-emerald-700" />
  if (type === "tablet") return <Tablet className="h-4 w-4 text-indigo-700" />
  if (type === "bilgisayar") return <Monitor className="h-4 w-4 text-slate-700" />
  return <HelpCircle className="h-4 w-4 text-slate-400" />
}

export function AnalyticsSessionTable({ sessions }: { sessions: VisitorSession[] }) {
  const [selectedSession, setSelectedSession] = useState<VisitorSession | null>(null)

  if (sessions.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <Globe className="mx-auto h-9 w-9 text-slate-300" />
        <p className="mt-3 text-sm font-bold text-slate-700">Seçilen filtrelere uygun ziyaret kaydı bulunmuyor</p>
        <p className="mt-1 text-xs text-slate-500">
          Siteye gerçek ziyaret gerçekleştiğinde oturum ve sayfa geçiş kayıtları burada listelenir. Sahte veya örnek kayıt üretilmez.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="border-b border-slate-200 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3.5">Ziyaret Tarihi & Saat Dilimi</th>
              <th className="px-4 py-3.5">Ülke & Bölge/Şehir</th>
              <th className="px-4 py-3.5">Cihaz / Marka & Model</th>
              <th className="px-4 py-3.5">İşletim Sistemi & Tarayıcı</th>
              <th className="px-4 py-3.5">İlk Giriş → Son Sayfa</th>
              <th className="px-4 py-3.5">Kaynak / UTM</th>
              <th className="px-4 py-3.5">Süre & Sayfa</th>
              <th className="px-4 py-3.5">Dönüşüm</th>
              <th className="px-4 py-3.5 text-right">Detay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions.map((session) => {
              const regionCity =
                [session.region, session.city].filter((x) => x && x !== "Bilinmiyor").join(" / ") || "Bilinmiyor"
              const osLabel =
                session.osVersion && session.osVersion !== "Bilinmiyor"
                  ? `${session.osName} ${session.osVersion}`
                  : session.osName
              const browserLabel =
                session.browserVersion && session.browserVersion !== "Bilinmiyor"
                  ? `${session.browserName} ${session.browserVersion}`
                  : session.browserName
              const utmSummary = [session.utmSource, session.utmMedium, session.utmCampaign]
                .filter(Boolean)
                .join(" · ")

              return (
                <tr
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="cursor-pointer transition hover:bg-emerald-50/40"
                >
                  {/* Timestamp & Timezone */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-mono font-semibold text-slate-900">{formatDateTimeTr(session.startedAt)}</div>
                    <div className="mt-0.5 text-[10px] text-slate-500">{session.timezone}</div>
                  </td>

                  {/* Country & Region/City */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">
                        {session.countryCode}
                      </span>
                      <span>{session.countryName}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{regionCity}</div>
                  </td>

                  {/* Device Type, Brand & Model */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 font-semibold capitalize text-slate-900">
                      <DeviceIcon type={session.deviceType} />
                      <span>{session.deviceType}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {session.deviceBrand !== "Bilinmiyor" ? `${session.deviceBrand} · ` : ""}
                      {session.deviceModel}
                    </div>
                  </td>

                  {/* OS & Browser + Lang/Screen */}
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900">
                      {osLabel} · {browserLabel}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      Dil: {session.language} · Ekran: {session.screenSize}
                    </div>
                  </td>

                  {/* Entry -> Last Page */}
                  <td className="px-4 py-3.5 max-w-[210px]">
                    <div className="truncate font-mono text-[11px] font-semibold text-slate-900" title={session.entryPage}>
                      Giriş: {session.entryPage}
                    </div>
                    <div className="mt-0.5 truncate font-mono text-[11px] text-slate-500" title={session.lastPage}>
                      Son: {session.lastPage}
                    </div>
                  </td>

                  {/* Referrer & UTM */}
                  <td className="px-4 py-3.5 max-w-[170px]">
                    <div className="truncate font-medium text-slate-800" title={session.referrer || "Doğrudan Giriş"}>
                      {session.referrer || "Doğrudan Giriş"}
                    </div>
                    {utmSummary ? (
                      <div className="mt-0.5 truncate text-[10px] font-mono text-amber-800" title={utmSummary}>
                        UTM: {utmSummary}
                      </div>
                    ) : (
                      <div className="mt-0.5 text-[10px] text-slate-400">UTM yok</div>
                    )}
                  </td>

                  {/* Duration & Pageviews */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1 font-mono font-semibold text-slate-900">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{formatDurationTr(session.durationSeconds)}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{session.pageViews} sayfa görüntülendi</div>
                  </td>

                  {/* Conversion & Bot Badge */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {session.converted ? (
                      <div className="space-y-1">
                        {session.conversionTypes.includes("contact") && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                            <MessageSquare className="h-3 w-3" />
                            <span>İletişim Formu</span>
                          </span>
                        )}
                        {session.conversionTypes.includes("rfq") && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900">
                            <FileText className="h-3 w-3" />
                            <span>Teklif Talebi</span>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Form gönderilmedi</span>
                    )}
                    {session.botStatus !== "human" && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200">
                          <ShieldAlert className="h-2.5 w-2.5" />
                          <span>{session.botStatus === "bot" ? "Bot" : "Belirsiz Bot"}</span>
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Action button */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedSession(session)
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-2xs hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-950"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Ayrıntılar</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Session Detail Modal */}
      {selectedSession && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Ziyaret Oturumu ve Zaman Sıralı Etkinlik Kaydı</span>
                </div>
                <h3 className="mt-0.5 font-mono text-sm font-bold text-slate-900">
                  Oturum ID: {selectedSession.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Top Metadata Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Zaman & Saat Dilimi
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-900">
                    Başlangıç: {formatDateTimeTr(selectedSession.startedAt)}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    Son Etkinlik: {formatDateTimeTr(selectedSession.lastActivityAt)}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-500">
                    Saat Dilimi: {selectedSession.timezone}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ülke ve Yaklaşık Bölge / Şehir
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-900">
                    {selectedSession.countryName} ({selectedSession.countryCode})
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    Bölge / Şehir: {selectedSession.region} / {selectedSession.city}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Kaynak: {selectedSession.geoSource} (Ham IP saklanmaz)
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Cihaz Türü, Marka & Model
                  </div>
                  <div className="mt-1 text-xs font-semibold capitalize text-slate-900">
                    Tür: {selectedSession.deviceType}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    Marka: {selectedSession.deviceBrand}
                  </div>
                  <div className="mt-0.5 text-xs font-medium text-slate-800">
                    Model: {selectedSession.deviceModel}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    İşletim Sistemi & Tarayıcı
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-900">
                    İS: {selectedSession.osName}{" "}
                    {selectedSession.osVersion !== "Bilinmiyor" ? selectedSession.osVersion : "(Sürüm bilgisi yok)"}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    Tarayıcı: {selectedSession.browserName}{" "}
                    {selectedSession.browserVersion !== "Bilinmiyor"
                      ? selectedSession.browserVersion
                      : "(Sürüm bilgisi yok)"}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Dil: {selectedSession.language} · Ekran: {selectedSession.screenSize}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Yönlendiren Site & UTM Kampanya
                  </div>
                  <div className="mt-1 truncate text-xs font-semibold text-slate-900" title={selectedSession.referrer}>
                    Yönlendiren: {selectedSession.referrer || "Doğrudan Giriş"}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    UTM Kaynak/Medya:{" "}
                    {[selectedSession.utmSource, selectedSession.utmMedium].filter(Boolean).join(" / ") || "Yok"}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    UTM Kampanya: {selectedSession.utmCampaign || "Yok"}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Ölçülen Süre, Sayfa & İzin Durumu
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-900">
                    Ölçülen Oturum Süresi: {formatDurationTr(selectedSession.durationSeconds)}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-700">
                    Görüntülenen Sayfa Sayısı: {selectedSession.pageViews}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Çerez İzni:{" "}
                    {selectedSession.consentGranted
                      ? "1. Taraf Analitik Çerez İzni Verildi"
                      : "İzin Verilmedi (Çerezsiz Oturum)"}
                  </div>
                </div>
              </div>

              {/* Navigation Path Summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-bold text-slate-900">Sayfa Geçiş Özeti</div>
                <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                  <div>
                    <span className="text-slate-500">İlk Giriş Sayfası: </span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-900">
                      {selectedSession.entryPage}
                    </code>
                  </div>
                  <div>
                    <span className="text-slate-500">Son Görülen Sayfa: </span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-900">
                      {selectedSession.lastPage}
                    </code>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-slate-500">Ziyaret Edilen Sayfalar:</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {selectedSession.visitedPages.map((p, idx) => (
                      <div key={`${p}-${idx}`} className="inline-flex items-center gap-1.5">
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-800">
                          {p}
                        </span>
                        {idx < selectedSession.visitedPages.length - 1 && (
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Conversion Status */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      İletişim Formu / Sipariş & Teklif Talebi Dönüşüm Durumu
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {selectedSession.converted
                        ? `Bu oturumda ${selectedSession.conversionTypes
                            .map((t) => (t === "contact" ? "İletişim Formu" : "Sipariş/Teklif Talebi (RFQ)"))
                            .join(" ve ")} gönderildi.`
                        : "Bu ziyaret oturumunda iletişim formu veya sipariş/teklif talebi gönderilmedi."}
                    </p>
                  </div>
                  {selectedSession.inquiryIds.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedSession.inquiryIds.map((inqId) => (
                        <Link
                          key={inqId}
                          href={`/admin/leads/${inqId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800"
                        >
                          <span>Kayıt Detayına Git ({inqId.slice(0, 8)})</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chronological Event Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Zaman Sıralı Oturum Etkinlikleri ({selectedSession.events.length} Etkinlik)
                </h4>
                <div className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                  {selectedSession.events.map((ev, index) => {
                    const isConversion = ev.type === "contact_submit" || ev.type === "rfq_submit"
                    return (
                      <div key={ev.id || index} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-[10px] font-bold text-slate-600">
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                                  isConversion
                                    ? "bg-emerald-100 text-emerald-900"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {ev.type === "pageview"
                                  ? "Sayfa Görüntüleme"
                                  : ev.type === "contact_submit"
                                    ? "İletişim Formu Gönderimi"
                                    : "Sipariş / Teklif Talebi Gönderimi"}
                              </span>
                              <code className="font-mono text-xs font-semibold text-slate-900">{ev.path}</code>
                              <span className="text-[11px] text-slate-400">({ev.locale.toUpperCase()})</span>
                            </div>
                            {ev.referrer && (
                              <div className="mt-0.5 text-[11px] text-slate-500">Yönlendiren: {ev.referrer}</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {isConversion && ev.detail && (
                            <Link
                              href={`/admin/leads/${ev.detail}`}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Mesajı Gör</span>
                            </Link>
                          )}
                          <span className="font-mono text-[11px] text-slate-500">{formatDateTimeTr(ev.at)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
