import { ViewportBounds } from "./types";

export function calculateBounds(
  coordinates: [number, number][]
): ViewportBounds {
  return coordinates.reduce(
    (acc, [x, y]) => ({
      minX: Math.min(acc.minX, x),
      maxX: Math.max(acc.maxX, x),
      minY: Math.min(acc.minY, y),
      maxY: Math.max(acc.maxY, y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  );
}

export function generateFallbackCoordinates(
  count: number = 100
): [number, number][] {
  const fallbackCoords: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    fallbackCoords.push([
      Math.floor(Math.random() * 800),
      Math.floor(Math.random() * 300 + 300),
    ]);
  }
  return fallbackCoords;
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}
