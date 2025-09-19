import React, { useRef, useMemo, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PointsRendererProps } from "./types";
import { calculateBounds, lerp } from "./utils";

export function PointsRenderer({
  coordinates,
  targetCoordinates,
  progress,
  isHovering,
  squareSize,
  color,
}: PointsRendererProps) {
  const pointsRef = useRef<THREE.InstancedMesh>(null);
  const { viewport, scene, gl } = useThree();

  const animationRef = useRef({
    time: 0,
    originalPositions: [] as Array<{ x: number; y: number }>,
    hoverHeight: 0,
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

  useEffect(() => {
    if (scene) {
      scene.background = null;
    }
    if (gl) {
      gl.setClearColor(0x000000, 0); // Fully transparent
    }
  }, [scene, gl]);

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
      const cappedHeight = Math.min(normalizedHeight, 0.9);

      let scaledX = (x - (minX + maxX) / 2) * scale;
      let scaledY = -viewport.height / 2 + cappedHeight * viewport.height * 0.4;

      if (targetCoordinates && targetBounds && progress > 0) {
        const targetIndex = index % targetCoordinates.length;
        const targetX = targetCoordinates[targetIndex][0];
        const targetY = targetCoordinates[targetIndex][1];

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

  useFrame(() => {
    if (
      !pointsRef.current ||
      animationRef.current.originalPositions.length === 0
    )
      return;

    animationRef.current.time += 0.0015;
    const time = animationRef.current.time;

    if (isHovering) {
      animationRef.current.hoverHeight = Math.sin(time * 3) * 0.25;
    } else {
      animationRef.current.hoverHeight = 0;
    }

    const dummy = new THREE.Object3D();
    const { originalPositions } = animationRef.current;

    const waveSpeed = 0.5;
    const waveFrequency = 2;
    const waveAmplitude = 0.05;

    const currentWaveAmplitude =
      progress > 0 ? waveAmplitude * (1 - progress) : waveAmplitude;

    originalPositions.forEach((pos, i) => {
      let finalX = pos.x;
      let finalY = pos.y;

      dummy.rotation.set(0, 0, 0);

      if (progress < 1) {
        const wavePos = pos.x - time * waveSpeed;
        const yOffset =
          Math.sin(wavePos * waveFrequency) * currentWaveAmplitude;
        const uniqueOffset = (pos.x * 0.1 + pos.y * 0.13) % 10;
        const randomOffset =
          Math.sin(time * 0.5 + uniqueOffset) * 0.01 * (1 - progress);

        finalY += yOffset + randomOffset;
      }

      if (isHovering) {
        finalY += animationRef.current.hoverHeight;

        dummy.rotation.x = Math.sin(time * 0.7) * 0.05;
        dummy.rotation.z = Math.sin(time * 0.5) * 0.02;
      }

      dummy.position.set(finalX, finalY, 0);
      dummy.updateMatrix();
      pointsRef.current?.setMatrixAt(i, dummy.matrix);
    });

    pointsRef.current.instanceMatrix.needsUpdate = true;
  });

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
