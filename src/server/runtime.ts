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
    const { createFirestoreRepo } = await import("@/lib/firestore-repo")
    repo = createFirestoreRepo()
    return repo
  }
  if (process.env.NODE_ENV === "production" && process.env.NILASYA_ALLOW_FILE_STORE !== "1") {
    throw new Error(
      "Firestore is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_USE_ADC=1. The file store does not persist on Firebase and would lose inquiries.",
    )
  }
  repo = createFileRepo(runtimeFile())
  return repo
}
