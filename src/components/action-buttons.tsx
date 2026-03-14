"use client";

import { useCallback, useRef, useState } from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas-pro";
import { Download, Share2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  captureRef: React.RefObject<HTMLDivElement | null>;
  enlistmentDate: Date | undefined;
  dischargeDate: Date | undefined;
}

export function ActionButtons({
  captureRef,
  enlistmentDate,
  dischargeDate,
}: ActionButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const handleSaveImage = useCallback(async () => {
    if (!captureRef.current || capturing) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `berryout-${format(new Date(), "yyyyMMdd-HHmmss")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setCapturing(false);
    }
  }, [captureRef, capturing]);

  const handleShare = useCallback(async () => {
    if (!enlistmentDate || !dischargeDate) return;
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("e", format(enlistmentDate, "yyyy-MM-dd"));
    url.searchParams.set("d", format(dischargeDate, "yyyy-MM-dd"));
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [enlistmentDate, dischargeDate]);

  return (
    <div ref={buttonsRef} className="flex w-full flex-row justify-center gap-4">
      {/* <button */}
      {/*   type="button" */}
      {/*   className={cn( */}
      {/*     buttonVariants({ variant: "outline" }), */}
      {/*     "rounded-full flex-1 gap-2 cursor-pointer h-12", */}
      {/*   )} */}
      {/*   onClick={handleSaveImage} */}
      {/*   disabled={capturing} */}
      {/* > */}
      {/*   <Download className="size-4" /> */}
      {/*   {capturing ? "截圖中..." : "加入主頁"} */}
      {/* </button> */}
      <button
        type="button"
        className={cn(
          buttonVariants({ variant: "default" }),
          "flex-1 gap-2 cursor-pointer rounded-full h-12",
        )}
        onClick={handleShare}
        disabled={!enlistmentDate || !dischargeDate}
      >
        <Share2 className="size-4" />
        {copied ? "已複製" : "分享倒數"}
      </button>
    </div>
  );
}
