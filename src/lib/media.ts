export type Frame = { src: string; file: string; index: number }

const HERO_COUNT = 5

export function heroFrames(): Frame[] {
  return Array.from({ length: HERO_COUNT }, (_, offset) => {
    const index = offset + 1
    return { src: `/media/hero/hero-${index}.webp`, file: `hero-${index}.webp`, index }
  })
}

export function still(name: "sunflower" | "olive" | "warehouse" | "port") {
  if (name === "port") return "/media/hero/hero-5.webp"
  return `/media/stills/${name}.webp`
}
