"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function StepHeader({
  step,
  total = 5,
  eyebrow,
  title,
  subtitle,
  trailing,
}: {
  step: number;
  total?: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="safe-top">
      {/* Progress bar row — matches Batch 2/3 mockup */}
      <div className="px-[22px] pt-1 pb-3.5 flex items-center justify-between gap-2.5">
        <button
          onClick={() => router.back()}
          aria-label="Retour"
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
        <div className="flex-1 flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "flex-1 h-1 rounded-[2px]",
                i < step ? "bg-accent" : "bg-bg-tertiary"
              )}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] font-semibold text-ink-muted tracking-wider">
          {step} / {total}
        </span>
      </div>

      {/* Hero block */}
      <div className="px-6 pt-3 pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent font-bold mb-2">
          ★ Étape {step} — {eyebrow}
        </p>
        <h1 className="text-h1 leading-tight mb-2">{title}</h1>
        {subtitle ? <p className="text-bodyLg text-ink-soft">{subtitle}</p> : null}
        {trailing}
      </div>
    </div>
  );
}
