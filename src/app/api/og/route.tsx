import { ImageResponse } from "next/og";
import { differenceInHours } from "date-fns";

export const runtime = "edge";

// Dark theme colors matching globals.css .dark
const COLORS = {
  background: "#1c1c1c", // oklch(0.145 0 0)
  foreground: "#fafafa", // oklch(0.985 0 0)
  primary: "#e5e5e5", // oklch(0.922 0 0)
  muted: "#3a3a3a", // oklch(0.269 0 0)
  mutedForeground: "#a3a3a3", // oklch(0.708 0 0)
};

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

  const enlistmentStr = `${enlistment.getFullYear()}/${String(enlistment.getMonth() + 1).padStart(2, "0")}/${String(enlistment.getDate()).padStart(2, "0")}`;
  const dischargeStr = `${discharge.getFullYear()}/${String(discharge.getMonth() + 1).padStart(2, "0")}/${String(discharge.getDate()).padStart(2, "0")}`;

  const size = 360;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return new ImageResponse(
    <div
      style={{
        width: "1200",
        height: "630",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.background,
        fontFamily: "sans-serif",
        color: COLORS.foreground,
        padding: "40px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "80px",
          width: "100%",
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
            flexShrink: 0,
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
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={COLORS.muted}
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={COLORS.primary}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={`${offset}`}
            />
          </svg>
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
                fontSize: "52px",
                fontWeight: 700,
                color: COLORS.foreground,
              }}
            >
              {percentage.toFixed(2)}%
            </span>
            <span
              style={{
                fontSize: "20px",
                color: COLORS.mutedForeground,
                marginTop: "6px",
              }}
            >
              已入伍 {elapsedDays} 天
            </span>
            <span
              style={{
                fontSize: "16px",
                color: COLORS.mutedForeground,
                marginTop: "4px",
              }}
            >
              退伍 {dischargeStr}
            </span>
          </div>
        </div>

        {/* Right side info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              color: COLORS.mutedForeground,
            }}
          >
            {enlistmentStr} - {dischargeStr}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              marginTop: "16px",
              gap: "8px",
            }}
          >
            <span
              style={{
                fontSize: "120px",
                fontWeight: 700,
                color: COLORS.foreground,
                lineHeight: 1,
              }}
            >
              {remainingDays}
            </span>
            <span
              style={{
                fontSize: "32px",
                color: COLORS.mutedForeground,
              }}
            >
              天後退伍
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={COLORS.mutedForeground}
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
                fontSize: "30px",
                fontWeight: 600,
                color: COLORS.mutedForeground,
                letterSpacing: "2px",
              }}
            >
              berryout.com
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  );
}
