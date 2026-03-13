"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangeFormProps {
  enlistmentDate: Date | undefined;
  dischargeDate: Date | undefined;
  onEnlistmentChange: (date: Date | undefined) => void;
  onDischargeChange: (date: Date | undefined) => void;
}

function DatePicker({
  label,
  date,
  onSelect,
  disabledMatcher,
}: {
  label: string;
  date: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabledMatcher?: (date: Date) => boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline" }),
            " justify-start text-left tabular-nums",
            !date && "text-muted-foreground",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
          {date ? format(date, "yyyy/MM/dd") : "選擇日期"}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onSelect}
            locale={zhTW}
            disabled={disabledMatcher}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DateRangeForm({
  enlistmentDate,
  dischargeDate,
  onEnlistmentChange,
  onDischargeChange,
}: DateRangeFormProps) {
  return (
    <div className="flex flex-row justify-center gap-6">
      <DatePicker
        label="入伍日期"
        date={enlistmentDate}
        onSelect={onEnlistmentChange}
      />
      <DatePicker
        label="退伍日期"
        date={dischargeDate}
        onSelect={onDischargeChange}
        disabledMatcher={
          enlistmentDate ? (date: Date) => date <= enlistmentDate : undefined
        }
      />
    </div>
  );
}
