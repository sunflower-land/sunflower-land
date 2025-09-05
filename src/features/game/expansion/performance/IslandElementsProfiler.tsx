/* eslint-disable no-console */
import React, { Profiler, useRef, useState, useEffect } from "react";
import { GameState } from "../../types/game";

interface ProfilerData {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  elementCount: number;
  timestamp: number;
}

interface IslandElementsProfilerProps {
  children: React.ReactNode;
  gameState: GameState;
  elementCount: number;
  onProfileData?: (data: ProfilerData) => void;
}

export const IslandElementsProfiler: React.FC<IslandElementsProfilerProps> = ({
  children,
  gameState,
  elementCount,
  onProfileData,
}) => {
  const [profileData, setProfileData] = useState<ProfilerData>({
    renderCount: 0,
    totalRenderTime: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    elementCount: 0,
    timestamp: 0,
  });

  const renderCountRef = useRef(0);
  const totalTimeRef = useRef(0);

  const onRenderCallback = (
    id: string,
    phase: "mount" | "update" | "nested-update",
    actualDuration: number,
    baseDuration: number,
  ) => {
    renderCountRef.current += 1;
    totalTimeRef.current += actualDuration;

    const newProfileData: ProfilerData = {
      renderCount: renderCountRef.current,
      totalRenderTime: totalTimeRef.current,
      averageRenderTime: totalTimeRef.current / renderCountRef.current,
      lastRenderTime: actualDuration,
      elementCount,
      timestamp: Date.now(),
    };

    setProfileData(newProfileData);
    onProfileData?.(newProfileData);

    // Log to console for development
    if (process.env.NODE_ENV === "development") {
      console.log(`🏝️ Island Elements Render #${renderCountRef.current}:`, {
        phase,
        duration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        elementCount,
        averageTime: `${(totalTimeRef.current / renderCountRef.current).toFixed(2)}ms`,
      });
    }
  };

  return (
    <Profiler id="IslandElements" onRender={onRenderCallback}>
      {children}
    </Profiler>
  );
};

// Hook to track game state changes that trigger re-renders
export const useGameStateChangeTracker = (gameState: GameState) => {
  const prevStateRef = useRef<Partial<GameState>>({});
  const [changeLog, setChangeLog] = useState<
    Array<{
      timestamp: number;
      changedFields: string[];
      trigger: string;
    }>
  >([]);

  useEffect(() => {
    const prevState = prevStateRef.current;
    const changedFields: string[] = [];

    // Track specific fields that could affect island elements
    const fieldsToTrack = [
      "buildings",
      "collectibles",
      "chickens",
      "trees",
      "stones",
      "iron",
      "gold",
      "crimstones",
      "sunstones",
      "crops",
      "fruitPatches",
      "flowers",
      "mushrooms",
      "buds",
      "airdrops",
      "beehives",
      "oilReserves",
      "lavaPits",
      "socialFarming",
      "inventory",
      "coins",
      "balance",
    ];

    fieldsToTrack.forEach((field) => {
      if (
        JSON.stringify(prevState[field as keyof GameState]) !==
        JSON.stringify(gameState[field as keyof GameState])
      ) {
        changedFields.push(field);
      }
    });

    if (changedFields.length > 0) {
      const newLogEntry = {
        timestamp: Date.now(),
        changedFields,
        trigger:
          changedFields.includes("inventory") || changedFields.includes("coins")
            ? "non-positional"
            : "positional",
      };

      setChangeLog((prev) => [...prev.slice(-9), newLogEntry]); // Keep last 10 entries

      if (process.env.NODE_ENV === "development") {
        console.log(`🔄 Game State Change:`, {
          fields: changedFields,
          trigger: newLogEntry.trigger,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    }

    prevStateRef.current = gameState;
  }, [gameState]);

  return changeLog;
};
