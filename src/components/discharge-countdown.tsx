"use client";

import { useEffect, useState } from "react";

interface DischargeCountdownProps {
  dischargeDate: Date | undefined;
}

function calcCountdown(discharge: Date) {
  const now = new Date();
  let diff = discharge.getTime() - now.getTime();
  if (diff <= 0) return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const seconds = Math.floor(diff / 1000) % 60;
  diff = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60) % 60;
  const totalHours = Math.floor(diff / 3600);
  const hours = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  return { months, days, hours, minutes, seconds };
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
    <p className={`text-sm tabular-nums text-muted-foreground${countdown === null ? " invisible" : ""}`}>
      距離退伍
      <span className="font-bold text-foreground"> {countdown?.months ?? 0} </span>月
      <span className="font-bold text-foreground"> {countdown?.days ?? 0} </span>日
      <span className="font-bold text-foreground"> {String(countdown?.hours ?? 0).padStart(2, "0")} </span>小時
      <span className="font-bold text-foreground"> {String(countdown?.minutes ?? 0).padStart(2, "0")} </span>分鐘
      <span className="font-bold text-foreground"> {String(countdown?.seconds ?? 0).padStart(2, "0")} </span>秒
    </p>
  );
}
