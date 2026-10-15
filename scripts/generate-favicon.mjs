import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = process.cwd()
const sourcePath = process.argv[2] || path.join(root, "public", "media", "logo.png")

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

async function createCircularPng(inputBuffer, size, sharpenSmall = false) {
  const r = size / 2
  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${r}" cy="${r}" r="${r - 0.25}" fill="white"/></svg>`,
  )
  let pipeline = sharp(inputBuffer).resize(size, size, {
    fit: "cover",
    position: "centre",
    kernel: sharp.kernel.lanczos3,
  })
  if (sharpenSmall) {
    pipeline = pipeline.sharpen({ sigma: 0.85, m1: 1.0, m2: 2.0 })
  }
  return pipeline
    .ensureAlpha()
    .composite([{ input: circleSvg, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function createMaskablePng(circularLogoBuffer, size) {
  // Maskable icons require an opaque background and ~82% inner safe zone
  const innerSize = Math.round(size * 0.84)
  const resizedLogo = await sharp(circularLogoBuffer)
    .resize(innerSize, innerSize, { fit: "contain", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer()

  const bgSvg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bg" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#123c29"/>
          <stop offset="100%" stop-color="#092217"/>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#bg)"/>
    </svg>`,
  )

  return sharp(bgSvg)
    .composite([{ input: resizedLogo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  const rawBuffer = await fs.readFile(sourcePath)
  const trimmed = await sharp(rawBuffer).trim({ threshold: 18 }).toBuffer()

  const png16 = await createCircularPng(trimmed, 16, true)
  const png32 = await createCircularPng(trimmed, 32, true)
  const png48 = await createCircularPng(trimmed, 48, true)
  const png192 = await createCircularPng(trimmed, 192, false)
  const png512 = await createCircularPng(trimmed, 512, false)

  const appleTouchPng = await createMaskablePng(png512, 180)
  const maskable192 = await createMaskablePng(png512, 192)
  const maskable512 = await createMaskablePng(png512, 512)

  const icoBuffer = buildIcoFromPngs([
    { size: 16, buffer: png16 },
    { size: 32, buffer: png32 },
    { size: 48, buffer: png48 },
  ])

  const svgBase64 = png192.toString("base64")
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="192" height="192">
  <image width="192" height="192" href="data:image/png;base64,${svgBase64}"/>
</svg>
`

  await fs.mkdir(path.join(root, "public", "media"), { recursive: true })

  await Promise.all([
    fs.writeFile(path.join(root, "src", "app", "favicon.ico"), icoBuffer),
    fs.writeFile(path.join(root, "src", "app", "icon.png"), png512),
    fs.writeFile(path.join(root, "src", "app", "apple-icon.png"), appleTouchPng),
    fs.writeFile(path.join(root, "public", "favicon.ico"), icoBuffer),
    fs.writeFile(path.join(root, "public", "favicon-16x16.png"), png16),
    fs.writeFile(path.join(root, "public", "favicon-32x32.png"), png32),
    fs.writeFile(path.join(root, "public", "favicon-48x48.png"), png48),
    fs.writeFile(path.join(root, "public", "icon.png"), png512),
    fs.writeFile(path.join(root, "public", "icon-192.png"), png192),
    fs.writeFile(path.join(root, "public", "icon-512.png"), png512),
    fs.writeFile(path.join(root, "public", "icon-maskable-192.png"), maskable192),
    fs.writeFile(path.join(root, "public", "icon-maskable-512.png"), maskable512),
    fs.writeFile(path.join(root, "public", "apple-icon.png"), appleTouchPng),
    fs.writeFile(path.join(root, "public", "apple-touch-icon.png"), appleTouchPng),
    fs.writeFile(path.join(root, "public", "icon.svg"), iconSvg, "utf8"),
    fs.writeFile(path.join(root, "public", "media", "logo.png"), png512),
  ])

  console.log("Favicon ve PWA ikon seti başarıyla oluşturuldu.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
