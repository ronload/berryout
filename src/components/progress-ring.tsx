"use client";

import { useEffect, useRef, useState } from "react";

import type { ElapsedTime } from "@/lib/date-utils";

interface ProgressRingProps {
  percentage: number;
  elapsedTime: ElapsedTime | null;
  size?: number;
  strokeWidth?: number;
}

function useAnimatedValue(target: number, duration = 1000) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = 0;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (target - start) * eased);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return current;
}

export function ProgressRing({
  percentage,
  elapsedTime,
  size = 240,
  strokeWidth = 16,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedPercentage = useAnimatedValue(percentage, 1200);
  const offset = circumference - (animatedPercentage / 100) * circumference;

  const endAngle = (animatedPercentage / 100) * 2 * Math.PI;
  const endX = size / 2 + radius * Math.cos(endAngle);
  const endY = size / 2 + radius * Math.sin(endAngle);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop
              offset="0%"
              className="[stop-color:theme(colors.foreground)]"
            />
            <stop
              offset="100%"
              className="[stop-color:color-mix(in_oklch,theme(colors.foreground)_50%,theme(colors.muted-foreground)_50%)]"
            />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className="stroke-foreground/[0.06]"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ring-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {animatedPercentage > 0 && (
          <circle
            cx={endX}
            cy={endY}
            r={strokeWidth * 0.7}
            className="fill-[color-mix(in_oklch,var(--foreground)_75%,var(--muted-foreground)_25%)]"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tabular-nums">
          {animatedPercentage.toFixed(2)}%
        </span>
        <span
          className={`mt-1 text-sm tabular-nums text-muted-foreground${elapsedTime === null ? " invisible" : ""}`}
        >
          已入伍{" "}
          <span className="font-bold text-foreground">
            {elapsedTime?.days ?? 0}
          </span>{" "}
          天{" "}
          <span className="font-bold text-foreground">
            {elapsedTime?.hours ?? 0}
          </span>{" "}
          小時
        </span>
      </div>
    </div>
  );
}
