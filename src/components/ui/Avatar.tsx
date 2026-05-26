import * as React from "react";
import { cn, initials } from "@/lib/utils";

const sizes = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-[12px]",
  md: "h-12 w-12 text-[14px]",
  lg: "h-16 w-16 text-[18px]",
  xl: "h-24 w-24 text-[24px]",
};

export function Avatar({
  src,
  name,
  size = "md",
  online,
  ring,
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof sizes;
  online?: boolean;
  ring?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden bg-bg-secondary text-ink flex items-center justify-center font-medium",
          sizes[size],
          ring && "ring-2 ring-white"
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name ?? ""} className="h-full w-full object-cover" />
        ) : (
          <span>{initials(name)}</span>
        )}
      </div>
      {online ? (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-bg-primary" />
      ) : null}
    </div>
  );
}

export function AvatarStack({
  users,
  max = 3,
  more,
}: {
  users: { name?: string | null; src?: string | null }[];
  max?: number;
  more?: number;
}) {
  const visible = users.slice(0, max);
  const overflow = more ?? users.length - max;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={i} src={u.src} name={u.name} size="sm" ring />
      ))}
      {overflow > 0 ? (
        <div className="h-9 w-9 rounded-full bg-ink text-white text-[12px] font-medium flex items-center justify-center ring-2 ring-white">
          +{overflow}
        </div>
      ) : null}
    </div>
  );
}
