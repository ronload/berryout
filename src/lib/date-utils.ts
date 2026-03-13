import { differenceInHours } from "date-fns";

export function calculateProgress(
  enlistment: Date,
  discharge: Date,
): number {
  const now = new Date();
  const totalHours = differenceInHours(discharge, enlistment);
  if (totalHours <= 0) return 0;

  const elapsedHours = differenceInHours(now, enlistment);
  const percentage = (elapsedHours / totalHours) * 100;

  return Math.min(100, Math.max(0, percentage));
}

export interface ElapsedTime {
  days: number;
  hours: number;
}

export function getElapsedTime(enlistment: Date): ElapsedTime {
  const now = new Date();
  const totalHours = Math.max(0, differenceInHours(now, enlistment));
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
  };
}
