import React, { useRef, useMemo, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PointsRendererProps } from "./types";
import { calculateBounds, lerp } from "./utils";

export function PointsRenderer({
  coordinates,
  targetCoordinates,
  progress,
  squareSize,
  color,
}: PointsRendererProps) {
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const animationRef = useRef({
    time: 0,
    originalPositions: [] as Array<{ x: number; y: number }>,
  });

  const squareGeometry = useMemo(() => {
    const size = squareSize / 60;
    return new THREE.PlaneGeometry(size, size);
  }, [squareSize]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.8,
    });
  }, [color]);

  const bounds = useMemo(() => calculateBounds(coordinates), [coordinates]);

  const targetBounds = useMemo(
    () => (targetCoordinates ? calculateBounds(targetCoordinates) : null),
    [targetCoordinates]
  );

  const scaledPositions = useMemo(() => {
    if (coordinates.length === 0) return [];

    const { minX, maxX, minY, maxY } = bounds;
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const scaleX = viewport.width / dataWidth;
    const minScale = 0.05;
    const scale = Math.max(scaleX, minScale);

    const positions = coordinates.map(([x, y], index) => {
      const normalizedHeight = dataHeight === 0 ? 0.5 : (maxY - y) / dataHeight;
      const cappedHeight = Math.min(normalizedHeight, 100);

      let scaledX = (x - (minX + maxX) / 2) * scale;
      let scaledY = -viewport.height / 2 + cappedHeight * viewport.height * 0.4;

      if (targetCoordinates && targetBounds && progress > 0) {
        const targetX = targetCoordinates[index % targetCoordinates.length][0];
        const targetY = targetCoordinates[index % targetCoordinates.length][1];

        const targetDataWidth = targetBounds.maxX - targetBounds.minX;
        const targetDataHeight = targetBounds.maxY - targetBounds.minY;

        const targetScaleX = (viewport.width * 0.6) / targetDataWidth;
        const targetScaleY = (viewport.height * 0.6) / targetDataHeight;
        const targetScale = Math.min(targetScaleX, targetScaleY);

        const targetNormalizedX =
          targetX - (targetBounds.minX + targetBounds.maxX) / 2;
        const targetNormalizedY =
          targetY - (targetBounds.minY + targetBounds.maxY) / 2;

        const targetScaledX = targetNormalizedX * targetScale;
        const targetScaledY = -targetNormalizedY * targetScale;

        // Interpolate between current and target position
        scaledX = lerp(scaledX, targetScaledX, progress);
        scaledY = lerp(scaledY, targetScaledY, progress);
      }

      return { x: scaledX, y: scaledY };
    });

    animationRef.current.originalPositions = [...positions];

    return positions;
  }, [
    coordinates,
    targetCoordinates,
    viewport,
    bounds,
    targetBounds,
    progress,
  ]);

  // Animation frame - wave effect
  useFrame(() => {
    if (
      !pointsRef.current ||
      animationRef.current.originalPositions.length === 0
    )
      return;

    // Update time
    animationRef.current.time += 0.0015;
    const time = animationRef.current.time;

    const dummy = new THREE.Object3D();
    const { originalPositions } = animationRef.current;

    // Wave parameters
    const waveSpeed = 0.5;
    const waveFrequency = 2;
    const waveAmplitude = 0.05;

    // Less wave effect during transition
    const currentWaveAmplitude =
      targetCoordinates && progress > 0
        ? waveAmplitude * (1 - progress)
        : waveAmplitude;

    // Update each instance with wave movement
    originalPositions.forEach((pos, i) => {
      // Create wave effect that moves from left to right
      const wavePos = pos.x - time * waveSpeed;

      // Calculate vertical offset using sine wave
      const yOffset = Math.sin(wavePos * waveFrequency) * currentWaveAmplitude;

      // Add slight random variation to make it more natural
      const uniqueOffset = (pos.x * 0.1 + pos.y * 0.13) % 10;
      const randomOffset =
        Math.sin(time * 0.5 + uniqueOffset) * 0.01 * (1 - progress);

      dummy.position.set(pos.x, pos.y + yOffset + randomOffset, 0);
      dummy.updateMatrix();
      pointsRef.current?.setMatrixAt(i, dummy.matrix);
    });

    pointsRef.current.instanceMatrix.needsUpdate = true;
  });

  // Initial positioning
  useEffect(() => {
    if (!pointsRef.current || scaledPositions.length === 0) return;

    const dummy = new THREE.Object3D();

    scaledPositions.forEach((pos, i) => {
      dummy.position.set(pos.x, pos.y, 0);
      dummy.updateMatrix();
      pointsRef.current?.setMatrixAt(i, dummy.matrix);
    });

    pointsRef.current.instanceMatrix.needsUpdate = true;
  }, [scaledPositions]);

  if (coordinates.length === 0) return null;

  return (
    <instancedMesh
      ref={pointsRef}
      args={[squareGeometry, material, scaledPositions.length]}
    />
  );
}
