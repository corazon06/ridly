import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "success" | "warning" | "trust" | "ink" | "roadtrip";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-bg-secondary text-ink",
  accent: "bg-accent-soft text-accent-dark",
  success: "bg-[rgba(94,124,90,0.15)] text-[#3F5E48]",
  warning: "bg-warning/15 text-[#9B7B26]",
  trust: "bg-trust/10 text-trust",
  ink: "bg-ink text-bg-primary",
  roadtrip: "bg-[#1A2E4A] text-[#A8C4E0]",
};

export function Tag({
  children,
  tone = "neutral",
  className,
  selected,
  ...props
}: {
  children: React.ReactNode;
  tone?: Tone;
  selected?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-chip text-[10px] font-display font-bold uppercase tracking-wider",
        toneClasses[tone],
        selected && "ring-2 ring-ink/10",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 h-10 rounded-chip text-[13px] font-semibold border-[1.5px] transition-colors whitespace-nowrap",
        active
          ? "bg-ink text-bg-primary border-ink"
          : "bg-white text-ink-soft border-line hover:border-ink/30",
        className
      )}
    >
      {children}
    </button>
  );
}
