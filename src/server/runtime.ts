import "server-only"
import { createFileRepo, runtimeFile } from "@/lib/file-repo"
import type { Repo, Control } from "@/lib/model"
import { emptyControl } from "@/lib/model"

let repo: Repo | null = null
let settingsCache: { data: Control["settings"]; at: number } | null = null
const SETTINGS_CACHE_TTL = 10 * 60 * 1000 // 10 minutes in-memory cache

export function firestoreConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_USE_ADC === "1" || process.env.K_SERVICE)
}

export async function getRepo(): Promise<Repo> {
  if (repo) return repo
  if (firestoreConfigured()) {
    const { createFirestoreRepo } = await import("@/lib/firestore-repo")
    repo = createFirestoreRepo()
    return repo
  }
  if (process.env.NODE_ENV === "production" && process.env.NILASYA_ALLOW_FILE_STORE !== "1") {
    throw new Error("Üretim ortamında Firestore yapılandırması eksik (FIREBASE_SERVICE_ACCOUNT_JSON veya FIREBASE_USE_ADC=1 gerekli).")
  }
  repo = createFileRepo(runtimeFile())
  return repo
}

export async function getCorporateSettings(): Promise<Control["settings"]> {
  const now = Date.now()
  if (settingsCache && now - settingsCache.at < SETTINGS_CACHE_TTL) {
    return settingsCache.data
  }
  try {
    const r = await getRepo()
    const fetched = await Promise.race([
      r.getSettings(),
      new Promise<Control["settings"]>((_, reject) => setTimeout(() => reject(new Error("timeout")), 600)),
    ])
    settingsCache = { data: fetched, at: now }
    return fetched
  } catch {
    if (settingsCache) return settingsCache.data
    return emptyControl().settings
  }
}
