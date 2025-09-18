"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleSimulationProps } from "./types";
import { PointsRenderer } from "./points-renderer";
import { useCoordinates, useKeyPress } from "./hooks/useCoordinates";
import { useAnimationState } from "./hooks/useAnimationState";

const SvgParticleSimulation: React.FC<ParticleSimulationProps> = ({
  jsonPath = "/migrate/svg-coordinates.json",
  elizaPath = "/migrate/eliza-head.json",
  squareSize = 4,
  color = "#FF5800",
  className = "",
}) => {
  const { coordinates, loading, error } = useCoordinates(jsonPath);
  const [elizaCoordinates, setElizaCoordinates] = useState<
    [number, number][] | null
  >(null);
  const { isElizaMode, transition, toggleElizaMode } = useAnimationState();

  useEffect(() => {
    const fetchElizaCoordinates = async () => {
      try {
        const response = await fetch(elizaPath);
        if (!response.ok) {
          throw new Error(
            `Failed to load Eliza coordinates: ${response.status}`
          );
        }
        const data = await response.json();
        setElizaCoordinates(data);
      } catch (err) {
        console.error("Error loading Eliza coordinates:", err);
      }
    };

    fetchElizaCoordinates();
  }, [elizaPath]);

  useKeyPress("Space", () => {
    if (elizaCoordinates) {
      toggleElizaMode();
    }
  });

  if (loading) {
    return <div className="w-full h-full bg-transparent" />;
  }

  if (error) {
    console.error(error);
  }

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        orthographic
        camera={{
          position: [0, 0, 100],
          zoom: 40,
          near: 0.1,
          far: 1000,
        }}
        frameloop="always"
        gl={{
          alpha: true,
          antialias: true,
        }}
      >
        <ambientLight intensity={1.0} />
        <PointsRenderer
          coordinates={coordinates}
          targetCoordinates={elizaCoordinates}
          progress={transition}
          squareSize={squareSize}
          color={color}
        />
      </Canvas>
      {/* just for dev */}
      {elizaCoordinates && (
        <div className="fixed bottom-5 left-5 z-10 text-sm text-white bg-black/50 px-2 py-1 rounded">
          Press <kbd className="px-2 py-1 bg-gray-700 rounded">Space</kbd> to
          transform
        </div>
      )}
    </div>
  );
};

export default SvgParticleSimulation;
