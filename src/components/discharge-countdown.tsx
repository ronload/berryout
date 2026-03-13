"use client";

import { useEffect, useState } from "react";

interface DischargeCountdownProps {
  dischargeDate: Date | undefined;
}

function calcCountdown(discharge: Date) {
  const now = new Date();
  let diff = discharge.getTime() - now.getTime();
  if (diff <= 0) return { totalDays: 0, hours: 0, minutes: 0, seconds: 0 };

  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const totalDays = Math.floor(totalSeconds / 86400);

  return { totalDays, hours, minutes, seconds };
}

export function DischargeCountdown({ dischargeDate }: DischargeCountdownProps) {
  const [countdown, setCountdown] = useState<ReturnType<typeof calcCountdown> | null>(null);

  useEffect(() => {
    if (!dischargeDate) return;

    setCountdown(calcCountdown(dischargeDate));
    const timer = setInterval(() => {
      setCountdown(calcCountdown(dischargeDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [dischargeDate]);

  return (
    <div className={`flex flex-col items-center${countdown === null ? " invisible" : ""}`}>
      <span className="text-5xl font-bold tabular-nums text-foreground">
        {countdown?.totalDays ?? 0}
      </span>
      <span className="mt-1 text-sm font-medium tracking-widest text-muted-foreground">
        天後退伍
      </span>
      <span className="mt-2 text-sm tabular-nums text-muted-foreground">
        {String(countdown?.hours ?? 0).padStart(2, "0")} 時{" "}
        {String(countdown?.minutes ?? 0).padStart(2, "0")} 分{" "}
        {String(countdown?.seconds ?? 0).padStart(2, "0")} 秒
      </span>
    </div>
  );
}
