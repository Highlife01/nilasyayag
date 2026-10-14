import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const sourcePath = process.argv[2]
if (!sourcePath) {
  console.error("Usage: node scripts/generate-favicon.mjs <source-image-path>")
  process.exit(1)
}

function buildIcoFromPngs(pngBuffersWithSizes) {
  const count = pngBuffersWithSizes.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // Reserved
  header.writeUInt16LE(1, 2) // Type: 1 = ICO
  header.writeUInt16LE(count, 4) // Image count

  const dirEntries = []
  let offset = 6 + count * 16

  for (const { size, buffer } of pngBuffersWithSizes) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(size >= 256 ? 0 : size, 0) // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1) // Height
    entry.writeUInt8(0, 2) // Color palette
    entry.writeUInt8(0, 3) // Reserved
    entry.writeUInt16LE(1, 4) // Color planes
    entry.writeUInt16LE(32, 6) // Bits per pixel
    entry.writeUInt32LE(buffer.length, 8) // Image byte size
    entry.writeUInt32LE(offset, 12) // Offset
    dirEntries.push(entry)
    offset += buffer.length
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffersWithSizes.map((item) => item.buffer)])
}

async function createCircularPng(inputBuffer, size) {
  const r = size / 2
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${r}" cy="${r}" r="${r - 0.5}" fill="white"/></svg>`,
  )
  return sharp(inputBuffer)
    .resize(size, size, { fit: "cover", position: "centre" })
    .ensureAlpha()
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  const rawBuffer = await fs.readFile(sourcePath)
  const trimmed = await sharp(rawBuffer).trim({ threshold: 18 }).toBuffer()

  const png16 = await createCircularPng(trimmed, 16)
  const png32 = await createCircularPng(trimmed, 32)
  const png48 = await createCircularPng(trimmed, 48)
  const png180 = await createCircularPng(trimmed, 180)
  const png192 = await createCircularPng(trimmed, 192)
  const png512 = await createCircularPng(trimmed, 512)

  const icoBuffer = buildIcoFromPngs([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ])

  const root = process.cwd()
  await fs.mkdir(path.join(root, "public", "media"), { recursive: true })

  await Promise.all([
    fs.writeFile(path.join(root, "src", "app", "favicon.ico"), icoBuffer),
    fs.writeFile(path.join(root, "src", "app", "icon.png"), png512),
    fs.writeFile(path.join(root, "src", "app", "apple-icon.png"), png180),
    fs.writeFile(path.join(root, "public", "favicon.ico"), icoBuffer),
    fs.writeFile(path.join(root, "public", "icon.png"), png192),
    fs.writeFile(path.join(root, "public", "apple-icon.png"), png180),
    fs.writeFile(path.join(root, "public", "media", "logo.png"), png512),
  ])

  for (const oldSvg of [path.join(root, "src", "app", "icon.svg"), path.join(root, "public", "icon.svg")]) {
    await fs.unlink(oldSvg).catch(() => undefined)
  }

  console.log("Favicon and brand icons generated successfully.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
