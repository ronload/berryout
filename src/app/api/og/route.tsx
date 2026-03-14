import { ImageResponse } from "next/og";
import { differenceInHours } from "date-fns";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const e = searchParams.get("e");
  const d = searchParams.get("d");

  const now = new Date();
  const enlistment = e ? new Date(e) : new Date("2024-03-14");
  const discharge = d ? new Date(d) : new Date("2025-03-14");

  if (isNaN(enlistment.getTime()) || isNaN(discharge.getTime())) {
    return new Response("Invalid date parameters", { status: 400 });
  }

  const totalHours = differenceInHours(discharge, enlistment);
  const elapsedHours = differenceInHours(now, enlistment);
  const percentage =
    totalHours <= 0
      ? 0
      : Math.min(100, Math.max(0, (elapsedHours / totalHours) * 100));

  const elapsedDays = Math.max(0, Math.floor(elapsedHours / 24));

  const diffMs = discharge.getTime() - now.getTime();
  const remainingDays = Math.max(0, Math.floor(diffMs / 86400000));

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
        background: "radial-gradient(circle at 50% 45%, #1a1a1a 0%, #0a0a0a 70%)",
        fontFamily: "monospace, sans-serif",
        color: "#ffffff",
        position: "relative",
      }}
    >
      {/* Main content - ring + text centered */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
        }}
      >
        {/* Progress Ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
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
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${offset}`}
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
                color: "#ffffff",
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
              已入伍 {elapsedDays} 天
            </span>
          </div>
        </div>

        {/* Remaining days below ring */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1,
              letterSpacing: "-1px",
            }}
          >
            {remainingDays}
          </span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.45)",
            }}
          >
            天後退伍
          </span>
        </div>
      </div>

      {/* Watermark bottom-right */}
      <span
        style={{
          position: "absolute",
          bottom: "28px",
          right: "36px",
          fontSize: "16px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "1px",
        }}
      >
        berryout.com
      </span>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
