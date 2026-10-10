export type Frame = { src: string; file: string; index: number }

const HERO_COUNT = 4

export function heroFrames(): Frame[] {
  return Array.from({ length: HERO_COUNT }, (_, offset) => {
    const index = offset + 1
    return { src: `/media/hero/${index}.webp`, file: `${index}.webp`, index }
  })
}

export function still(name: "sunflower" | "olive" | "warehouse" | "port") {
  if (name === "port") return "/media/hero/05-port-dawn.webp"
  return `/media/stills/${name}.webp`
}
