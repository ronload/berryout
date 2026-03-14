"use client";

import { useCallback, useState } from "react";
import { format } from "date-fns";
import { Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  enlistmentDate: Date | undefined;
  dischargeDate: Date | undefined;
}

export function ActionButtons({
  enlistmentDate,
  dischargeDate,
}: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    if (!enlistmentDate || !dischargeDate) return;
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("e", format(enlistmentDate, "yyyy-MM-dd"));
    url.searchParams.set("d", format(dischargeDate, "yyyy-MM-dd"));
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [enlistmentDate, dischargeDate]);

  return (
    <div className="flex w-full flex-row justify-center gap-4">
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "default" }),
          "flex-1 gap-2 cursor-pointer rounded-full h-12",
        )}
        onClick={() => {
          void handleShare();
        }}
        disabled={!enlistmentDate || !dischargeDate}
      >
        <Share2 className="size-4" />
        {copied ? "已複製" : "分享倒數"}
      </button>
    </div>
  );
}
