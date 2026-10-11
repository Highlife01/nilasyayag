import { existsSync, readdirSync, readFileSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import crypto from "node:crypto"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(import.meta.dirname, "..")
const from = path.join(root, "görsel")
const toHero = path.join(root, "public", "media", "hero")
const toStills = path.join(root, "public", "media", "stills")

await mkdir(toHero, { recursive: true })
await mkdir(toStills, { recursive: true })

if (!existsSync(from)) {
  console.error("Görsel klasörü bulunamadı:", from)
  process.exit(1)
}

const allFiles = readdirSync(from)
const imageExtensions = [".png", ".jpg", ".jpeg", ".webp"]
const rawImageFiles = allFiles.filter((file) => {
  const ext = path.extname(file).toLowerCase()
  return imageExtensions.includes(ext)
})

// Deduplicate by MD5 hash
const seenHashes = new Map()
const uniqueFiles = []

for (const file of rawImageFiles) {
  const fullPath = path.join(from, file)
  const buf = readFileSync(fullPath)
  const hash = crypto.createHash("md5").update(buf).digest("hex")
  if (!seenHashes.has(hash)) {
    seenHashes.set(hash, file)
    uniqueFiles.push(file)
  }
}

console.log("Benzersiz fotoğraflar:", uniqueFiles)

// Sort so the new Anatolia banner (with 6 badges) is Slide 1, and Signature banner is Slide 2
uniqueFiles.sort((a, b) => {
  const aIsAnatolia = a.includes("affaf") || a === "1.png"
  const bIsAnatolia = b.includes("affaf") || b === "1.png"
  if (aIsAnatolia && !bIsAnatolia) return -1
  if (!aIsAnatolia && bIsAnatolia) return 1
  return a.localeCompare(b)
})

console.log("Hero yerleşim sırası:", uniqueFiles)

for (let i = 0; i < uniqueFiles.length; i++) {
  const filename = uniqueFiles[i]
  const source = path.join(from, filename)
  const index = i + 1

  const targetWebp = path.join(toHero, `${index}.webp`)
  const info = await sharp(source)
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(targetWebp)
  console.log(`[${index}] ${filename} -> hero/${index}.webp (${Math.round(info.size / 1024)} KB)`)

  if (index === 1) {
    await sharp(source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(toHero, "master-banner.webp"))
    await sharp(source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(toHero, "banner-anatolia.webp"))
    await sharp(source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(toStills, "master-banner.webp"))
    await sharp(source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(toStills, "banner-anatolia.webp"))
  } else if (index === 2) {
    await sharp(source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(toHero, "banner-signature.webp"))
    await sharp(source)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(path.join(toStills, "banner-signature.webp"))
  }
}

console.log("Hero fotoğrafları başarıyla optimize edildi.")
