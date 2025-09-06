/* eslint-disable react/jsx-no-literals */
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

// Enhanced performance tracking interface
interface PerformanceMetrics {
  renderCount: number;
  totalRenderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  elementCount: number;
  fps: number;
  memoryUsage?: number;
}

interface StateChangeLog {
  timestamp: number;
  changedFields: string[];
  trigger: "positional" | "non-positional";
  elementCountChange: number;
  renderTime: number;
}

// Comprehensive performance dashboard component
interface LandPerformanceDashboardProps {
  metrics: PerformanceMetrics;
  changeLog: StateChangeLog[];
  isVisible: boolean;
  onToggle: () => void;
}

export const LandPerformanceDashboard: React.FC<
  LandPerformanceDashboardProps
> = ({ metrics, changeLog, onToggle }) => {
  const recentChanges = changeLog.slice(-5);
  const positionalChanges = changeLog.filter(
    (c) => c.trigger === "positional",
  ).length;
  const nonPositionalChanges = changeLog.filter(
    (c) => c.trigger === "non-positional",
  ).length;

  const getPerformanceColor = (time: number) => {
    if (time < 16) return "#4ade80"; // Green - good
    if (time < 33) return "#fbbf24"; // Yellow - acceptable
    return "#ef4444"; // Red - poor
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 60) return "#4ade80"; // Green
    if (fps >= 30) return "#fbbf24"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0,0,0,0.9)",
        color: "white",
        padding: "12px",
        borderRadius: "8px",
        fontSize: "11px",
        fontFamily: "monospace",
        zIndex: 10000,
        minWidth: "280px",
        maxHeight: "80vh",
        overflow: "auto",
        border: "1px solid #333",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "12px" }}>
          {`🏝️ Land Performance`}
        </div>
        <button
          onClick={onToggle}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {`✕`}
        </button>
      </div>

      {/* Core Metrics */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", color: "#60a5fa" }}
        >
          {`Core Metrics`}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
          }}
        >
          <div>
            {`Elements:`}
            <span style={{ color: "#fbbf24" }}>{metrics.elementCount}</span>
          </div>
          <div>
            Renders:{" "}
            <span style={{ color: "#60a5fa" }}>{metrics.renderCount}</span>
          </div>
          <div>
            FPS:{" "}
            <span style={{ color: getFPSColor(metrics.fps) }}>
              {metrics.fps.toFixed(1)}
            </span>
          </div>
          <div>
            Last:{" "}
            <span
              style={{ color: getPerformanceColor(metrics.lastRenderTime) }}
            >
              {metrics.lastRenderTime.toFixed(1)}ms
            </span>
          </div>
          <div>
            Avg:{" "}
            <span
              style={{ color: getPerformanceColor(metrics.averageRenderTime) }}
            >
              {metrics.averageRenderTime.toFixed(1)}ms
            </span>
          </div>
          <div>
            Total:{" "}
            <span style={{ color: "#a78bfa" }}>
              {metrics.totalRenderTime.toFixed(0)}ms
            </span>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", color: "#60a5fa" }}
        >
          Change Analysis
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
          }}
        >
          <div>
            Positional:{" "}
            <span style={{ color: "#4ade80" }}>{positionalChanges}</span>
          </div>
          <div>
            Non-Pos:{" "}
            <span style={{ color: "#fbbf24" }}>{nonPositionalChanges}</span>
          </div>
          <div>
            Ratio:{" "}
            <span style={{ color: "#a78bfa" }}>
              {(positionalChanges / Math.max(1, nonPositionalChanges)).toFixed(
                1,
              )}
              :1
            </span>
          </div>
          <div>
            Efficiency:{" "}
            <span
              style={{
                color:
                  nonPositionalChanges > positionalChanges
                    ? "#ef4444"
                    : "#4ade80",
              }}
            >
              {nonPositionalChanges > positionalChanges ? "Poor" : "Good"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Changes */}
      <div style={{ marginBottom: "12px" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "4px", color: "#60a5fa" }}
        >
          Recent Changes
        </div>
        <div style={{ maxHeight: "120px", overflow: "auto" }}>
          {recentChanges.length === 0 ? (
            <div style={{ color: "#6b7280", fontSize: "10px" }}>
              No recent changes
            </div>
          ) : (
            recentChanges.map((change, index) => (
              <div
                key={index}
                style={{ marginBottom: "2px", fontSize: "10px" }}
              >
                <span
                  style={{
                    color:
                      change.trigger === "positional" ? "#4ade80" : "#fbbf24",
                  }}
                >
                  {change.trigger === "positional" ? "📍" : "📊"}
                </span>
                <span style={{ marginLeft: "4px" }}>
                  {change.changedFields.slice(0, 2).join(", ")}
                  {change.changedFields.length > 2 && "..."}
                </span>
                <span style={{ color: "#6b7280", marginLeft: "4px" }}>
                  ({change.renderTime.toFixed(1)}ms)
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Tips */}
      <div style={{ fontSize: "10px", color: "#6b7280" }}>
        <div
          style={{ fontWeight: "bold", marginBottom: "2px", color: "#60a5fa" }}
        >
          Optimization Tips
        </div>
        <div>• High non-positional changes = unnecessary re-renders</div>
        <div>• Target: &lt;16ms render time (60fps)</div>
        <div>• Focus on memoizing positional changes</div>
      </div>
    </div>
  );
};

// Enhanced hook for comprehensive performance tracking
export const useLandPerformanceTracking = (elementCount: number) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    totalRenderTime: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    elementCount: 0,
    fps: 60,
  });

  const [changeLog, setChangeLog] = useState<StateChangeLog[]>([]);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true); // Changed to true by default

  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  const startTracking = () => {
    startTimeRef.current = performance.now();
  };

  const endTracking = (
    changedFields: string[] = [],
    trigger: "positional" | "non-positional" = "positional",
  ) => {
    const renderTime = performance.now() - startTimeRef.current;
    const currentTime = performance.now();

    // Calculate FPS
    frameCountRef.current++;
    if (currentTime - lastFrameTimeRef.current >= 1000) {
      const fps =
        (frameCountRef.current * 1000) /
        (currentTime - lastFrameTimeRef.current);
      lastFrameTimeRef.current = currentTime;
      frameCountRef.current = 0;

      setMetrics((prev) => ({ ...prev, fps }));
    }

    renderTimesRef.current.push(renderTime);
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current.shift();
    }

    const totalTime = renderTimesRef.current.reduce(
      (sum, time) => sum + time,
      0,
    );
    const averageTime = totalTime / renderTimesRef.current.length;

    const newMetrics: PerformanceMetrics = {
      renderCount: metrics.renderCount + 1,
      totalRenderTime: totalTime,
      averageRenderTime: averageTime,
      lastRenderTime: renderTime,
      elementCount,
      fps: metrics.fps,
    };

    setMetrics(newMetrics);

    // Add to change log
    if (changedFields.length > 0) {
      const newLogEntry: StateChangeLog = {
        timestamp: Date.now(),
        changedFields,
        trigger,
        elementCountChange: 0, // Could be enhanced to track actual element count changes
        renderTime,
      };

      setChangeLog((prev) => [...prev.slice(-19), newLogEntry]); // Keep last 20 entries
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🏝️ Land Render #${metrics.renderCount + 1}:`, {
        duration: `${renderTime.toFixed(2)}ms`,
        elementCount,
        averageTime: `${averageTime.toFixed(2)}ms`,
        fps: newMetrics.fps.toFixed(1),
        trigger,
        changedFields: changedFields.slice(0, 3),
      });
    }
  };

  return {
    metrics,
    changeLog,
    isDashboardVisible,
    setIsDashboardVisible,
    startTracking,
    endTracking,
  };
};
