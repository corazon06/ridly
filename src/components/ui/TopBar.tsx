"use client";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  eyebrow,
  onBack,
  back = true,
  trailing,
  className,
}: {
  title?: string;
  eyebrow?: string;
  onBack?: () => void;
  back?: boolean;
  trailing?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <div
      className={cn(
        "sticky top-0 z-30 bg-bg-primary safe-top px-[22px] pt-1 pb-2",
        "flex items-center justify-between gap-3",
        className
      )}
    >
      {back ? (
        <button
          onClick={onBack ?? (() => router.back())}
          aria-label="Retour"
          className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink shrink-0"
        >
          <ArrowLeft size={16} strokeWidth={2} />
        </button>
      ) : (
        <span className="h-9 w-9 shrink-0" />
      )}
      <div className="flex-1 min-w-0 text-center">
        {eyebrow ? (
          <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-muted font-bold">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h1 className="font-display font-bold text-[17px] tracking-[-0.01em] truncate">
            {title}
          </h1>
        ) : null}
      </div>
      <div className="h-9 w-9 flex items-center justify-end shrink-0">
        {trailing ?? null}
      </div>
    </div>
  );
}

export function MoreButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 w-9 rounded-full bg-bg-secondary flex items-center justify-center text-ink"
    >
      <MoreHorizontal size={16} strokeWidth={1.8} />
    </button>
  );
}
