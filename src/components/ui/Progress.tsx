import { cn } from "@/lib/utils";

export function StepProgress({
  current,
  total,
  className,
}: {
  current: number;
  total: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            i < current ? "bg-accent-dark" : "bg-line"
          )}
        />
      ))}
    </div>
  );
}
