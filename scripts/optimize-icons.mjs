import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const targets = [
  "public/icon-maskable-512.png",
  "public/icon-512.png",
  "public/icon.png",
  "public/icon-192.png",
  "public/icon-maskable-192.png",
  "public/apple-icon.png",
  "public/apple-touch-icon.png",
]

async function run() {
  let totalBefore = 0
  let totalAfter = 0

  for (const relPath of targets) {
    const fullPath = path.resolve(relPath)
    if (!fs.existsSync(fullPath)) continue

    const inputBuffer = fs.readFileSync(fullPath)
    const beforeSize = inputBuffer.length
    totalBefore += beforeSize

    const compressed = await sharp(inputBuffer)
      .png({
        compressionLevel: 9,
        effort: 10,
        palette: true,
        quality: 95,
      })
      .toBuffer()

    const afterSize = compressed.length
    totalAfter += afterSize

    if (afterSize < beforeSize) {
      fs.writeFileSync(fullPath, compressed)
      const savedPct = (((beforeSize - afterSize) / beforeSize) * 100).toFixed(1)
      console.log(`[OPTIMIZED] ${relPath}: ${(beforeSize / 1024).toFixed(1)} KB -> ${(afterSize / 1024).toFixed(1)} KB (-${savedPct}%)`)
    } else {
      console.log(`[SKIPPED] ${relPath}: already optimal`)
    }
  }

  const savedTotal = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
  console.log(`\nTOTAL: ${(totalBefore / 1024).toFixed(1)} KB -> ${(totalAfter / 1024).toFixed(1)} KB (-${savedTotal}% / saved ${((totalBefore - totalAfter) / 1024).toFixed(1)} KB)`)
}

run().catch((err) => {
  console.error("Optimization failed:", err)
  process.exit(1)
})
