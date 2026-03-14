import { ImageResponse } from "next/og";
import { differenceInHours } from "date-fns";

export const runtime = "edge";

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${String(y)}/${m}/${d}`;
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const e = searchParams.get("e");
  const d = searchParams.get("d");

  const now = new Date();
  const enlistment = e ? new Date(e) : new Date("2024-03-14");
  const discharge = d ? new Date(d) : new Date("2025-03-14");

  if (isNaN(enlistment.getTime()) || isNaN(discharge.getTime())) {
    return new Response("Invalid date parameters", { status: 400 });
  }

  // Progress calculation
  const totalHours = differenceInHours(discharge, enlistment);
  const elapsedHours = differenceInHours(now, enlistment);
  const percentage =
    totalHours <= 0
      ? 0
      : Math.min(100, Math.max(0, (elapsedHours / totalHours) * 100));

  const elapsedDays = Math.max(0, Math.floor(elapsedHours / 24));
  const elapsedRemainingHours = Math.max(0, elapsedHours % 24);

  // Countdown calculation
  const diffMs = Math.max(0, discharge.getTime() - now.getTime());
  const remainingDays = Math.floor(diffMs / 86400000);

  // Progress ring geometry
  const size = 420;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const endAngle = (percentage / 100) * 2 * Math.PI;
  const endX = size / 2 + radius * Math.cos(endAngle);
  const endY = size / 2 + radius * Math.sin(endAngle);

  return new ImageResponse(
    <div
      style={{
        width: "1200",
        height: "630",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 50% 45%, #1a1a1a 0%, #0a0a0a 70%)",
        fontFamily: "monospace, sans-serif",
        color: "#fafafa",
        position: "relative",
        padding: "60px 80px",
      }}
    >
      {/* Left: Progress Ring */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: `${String(size)}px`,
          height: `${String(size)}px`,
          flexShrink: 0,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${String(size)} ${String(size)}`}
          style={{
            transform: "rotate(-90deg)",
            position: "absolute",
          }}
        >
          <defs>
            <linearGradient id="stroke-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#a2a2a2" />
            </linearGradient>
          </defs>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#stroke-grad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={String(circumference)}
            strokeDashoffset={String(offset)}
          />
          {percentage > 0 && (
            <circle cx={endX} cy={endY} r={strokeWidth * 0.7} fill="#d0d0d0" />
          )}
        </svg>

        {/* Ring inner text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#fafafa",
              letterSpacing: "-2px",
            }}
          >
            {percentage.toFixed(2)}%
          </span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
              marginTop: "8px",
            }}
          >
            已入伍 {elapsedDays} 天 {elapsedRemainingHours} 小時
          </span>
        </div>
      </div>

      {/* Right: Info panel */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          marginLeft: "64px",
          height: `${String(size)}px`,
        }}
      >
        {/* Date Range */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "22px",
            fontWeight: 400,
            color: "#a3a3a3",
          }}
        >
          {/* Calendar icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>
            {formatDate(enlistment)} - {formatDate(discharge)}
          </span>
        </div>

        {/* Discharge Countdown */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "96px",
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            {remainingDays}
          </span>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 300,
              color: "#a3a3a3",
            }}
          >
            天後退伍
          </span>
        </div>

        {/* Branding: favicon + berryout.com */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a3a3a3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m17 7 3.5-3.5" />
            <path d="M17 2v5h5" />
            <path d="M2.1 17.1a4 4 0 0 0 4.8 4.8l9-2.1a6.32 6.32 0 0 0 2.9-10.9L15 5.2A6.5 6.5 0 0 0 4.1 8.3Z" />
            <path d="M8.5 9.5h.01" />
            <path d="M12.5 8.5h.01" />
            <path d="M7.5 13.5h.01" />
            <path d="M11.5 12.5h.01" />
            <path d="M15.5 11.5h.01" />
            <path d="M6.5 17.5h.01" />
            <path d="M10.5 16.5h.01" />
            <path d="M14.5 15.5h.01" />
          </svg>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 400,
              color: "#a3a3a3",
              letterSpacing: "0.5px",
            }}
          >
            berryout.com
          </span>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
