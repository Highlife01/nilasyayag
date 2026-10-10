import "server-only"
import { createFileRepo, runtimeFile } from "@/lib/file-repo"
import type { Repo } from "@/lib/model"

let repo: Repo | null = null

export function firestoreConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_USE_ADC === "1" || process.env.K_SERVICE)
}

export async function getRepo(): Promise<Repo> {
  if (repo) return repo
  if (firestoreConfigured()) {
    try {
      const { createFirestoreRepo } = await import("@/lib/firestore-repo")
      repo = createFirestoreRepo()
      return repo
    } catch (err) {
      console.warn("Firestore repo init failed, falling back to memory/file repo:", err)
    }
  }
  repo = createFileRepo(runtimeFile())
  return repo
}
