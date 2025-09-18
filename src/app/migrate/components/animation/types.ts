export interface ParticleSimulationProps {
  jsonPath?: string;
  elizaPath?: string;
  squareSize?: number;
  color?: string;
  className?: string;
}

export interface PointsRendererProps {
  coordinates: [number, number][];
  targetCoordinates: [number, number][] | null;
  progress: number;
  squareSize: number;
  color: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface ViewportBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
