"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "berryout-discharged";

interface DischargeCounterProps {
  discharged: boolean;
}

export function DischargeCounter({ discharged }: DischargeCounterProps) {
  const [count, setCount] = useState<number | null>(null);
  const incrementedRef = useRef(false);

  useEffect(() => {
    void fetch("/api/counter")
      .then((res) => res.json() as Promise<{ count: number | null }>)
      .then((data) => {
        if (data.count !== null) {
          setCount(data.count);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!discharged) return;
    if (incrementedRef.current) return;

    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    incrementedRef.current = true;

    void fetch("/api/counter", { method: "POST" })
      .then((res) => res.json() as Promise<{ count: number }>)
      .then((data) => {
        setCount(data.count);
        try {
          window.localStorage.setItem(STORAGE_KEY, "1");
        } catch {}
      })
      .catch(() => {});
  }, [discharged]);

  if (count === null) return null;

  return (
    <p className="text-sm text-muted-foreground">
      已陪伴 <span className="font-bold tabular-nums">{count}</span> 人退伍
    </p>
  );
}
