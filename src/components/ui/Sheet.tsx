"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-w-mobile bg-bg-primary rounded-t-[24px] shadow-cta",
          "max-h-[90dvh] overflow-y-auto"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-bg-primary pt-2 pb-3 border-b border-line">
          <div className="mx-auto h-1 w-10 rounded-full bg-line mb-2" />
          {title ? (
            <h2 className="text-h2 text-center px-6">{title}</h2>
          ) : null}
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
