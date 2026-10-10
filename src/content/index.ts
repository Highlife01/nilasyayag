import type { ArticleId } from "@/content/types"
import type { Locale } from "@/lib/i18n/config"
import ar from "@/content/ar"
import de from "@/content/de"
import en from "@/content/en"
import es from "@/content/es"
import fr from "@/content/fr"
import it from "@/content/it"
import ru from "@/content/ru"
import tr from "@/content/tr"

const ALL = { tr, en, ar, ru, de, fr, es, it }

export const ARTICLE_IDS: ArticleId[] = ["quotation", "packaging", "documents", "distributor"]

export function getDict(locale: Locale) {
  return ALL[locale]
}

export function articleIdBySlug(locale: Locale, slug: string): ArticleId | null {
  const dict = getDict(locale)
  return ARTICLE_IDS.find((id) => dict.articles[id].slug === slug) ?? null
}
