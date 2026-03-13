"use client";

import { useEffect, useMemo, useRef } from "react";
import { parseISO, startOfDay } from "date-fns";
import { ProgressRing } from "@/components/progress-ring";
import { DischargeCountdown } from "@/components/discharge-countdown";
import { DateRangeForm } from "@/components/date-range-form";
import { ActionButtons } from "@/components/action-buttons";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { calculateProgress, getElapsedTime } from "@/lib/date-utils";

interface StoredDates {
  enlistment: string | null;
  discharge: string | null;
}

const EMPTY_DATES: StoredDates = { enlistment: null, discharge: null };

export function CountdownDisplay() {
  const captureRef = useRef<HTMLDivElement>(null);
  const [storedDates, setStoredDates] = useLocalStorage<StoredDates>(
    "berryout-dates",
    EMPTY_DATES,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("e");
    const d = params.get("d");
    if (e && d) {
      const enlistment = startOfDay(new Date(e));
      const discharge = startOfDay(new Date(d));
      if (!isNaN(enlistment.getTime()) && !isNaN(discharge.getTime())) {
        setStoredDates({
          enlistment: enlistment.toISOString(),
          discharge: discharge.toISOString(),
        });
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }
    }
  }, [setStoredDates]);

  const enlistmentDate = storedDates.enlistment
    ? parseISO(storedDates.enlistment)
    : undefined;
  const dischargeDate = storedDates.discharge
    ? parseISO(storedDates.discharge)
    : undefined;

  const percentage = useMemo(() => {
    if (!enlistmentDate || !dischargeDate) return 0;
    return calculateProgress(enlistmentDate, dischargeDate);
  }, [enlistmentDate, dischargeDate]);

  const elapsedTime = useMemo(() => {
    if (!enlistmentDate) return null;
    return getElapsedTime(enlistmentDate);
  }, [enlistmentDate]);

  const handleEnlistmentChange = (date: Date | undefined) => {
    setStoredDates((prev) => ({
      ...prev,
      enlistment: date ? date.toISOString() : null,
    }));
  };

  const handleDischargeChange = (date: Date | undefined) => {
    setStoredDates((prev) => ({
      ...prev,
      discharge: date ? date.toISOString() : null,
    }));
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm">
      <div ref={captureRef} className="flex flex-col items-center gap-8 w-full">
        <DateRangeForm
          enlistmentDate={enlistmentDate}
          dischargeDate={dischargeDate}
          onEnlistmentChange={handleEnlistmentChange}
          onDischargeChange={handleDischargeChange}
        />
        <ProgressRing
          percentage={percentage}
          elapsedTime={elapsedTime}
          dischargeDate={dischargeDate}
          size={288}
        />
        <DischargeCountdown dischargeDate={dischargeDate} />
      </div>

      <ActionButtons
        captureRef={captureRef}
        enlistmentDate={enlistmentDate}
        dischargeDate={dischargeDate}
      />
    </div>
  );
}
