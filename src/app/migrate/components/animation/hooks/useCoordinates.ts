import { useState, useEffect } from "react";
import { generateFallbackCoordinates } from "../utils";

export function useCoordinates(jsonPath: string) {
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
          throw new Error(`Failed to load coordinates: ${response.status}`);
        }
        const data = await response.json();
        setCoordinates(data);
      } catch (err) {
        console.error("Error loading coordinates:", err);
        setError(
          err instanceof Error ? err.message : "Error loading coordinates"
        );
        setCoordinates(generateFallbackCoordinates());
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [jsonPath]);

  return { coordinates, loading, error };
}

export function useKeyPress(targetKey: string, onKeyDown: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === targetKey) {
        onKeyDown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [targetKey, onKeyDown]);
}
