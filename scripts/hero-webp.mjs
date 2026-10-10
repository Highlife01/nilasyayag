import { existsSync } from "node:fs"
import { mkdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(import.meta.dirname, "..")
const from = path.join(root, "görsel")
const to = path.join(root, "public", "media", "hero")
await mkdir(to, { recursive: true })

for (let index = 1; index <= 4; index += 1) {
  const source = path.join(from, `${index}.png`)
  if (!existsSync(source)) {
    console.log(`Yok: ${source}`)
    continue
  }
  const target = path.join(to, `${index}.webp`)
  const info = await sharp(source).resize({ width: 2400, withoutEnlargement: true }).webp({ quality: 80 }).toFile(target)
  console.log(`${index}.webp ${Math.round(info.size / 1024)} KB`)
}
