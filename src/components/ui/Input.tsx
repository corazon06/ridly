import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Visual focus state (used to mirror mockup "focused" pill style). */
  forceFocused?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, trailing, forceFocused, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2.5 px-3.5 py-3 rounded-card-sm border-[1.5px] bg-white text-ink",
          "transition-shadow",
          forceFocused
            ? "border-ink shadow-[0_0_0_3px_rgba(42,38,36,0.06)]"
            : "border-line focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgba(42,38,36,0.06)]",
          className
        )}
      >
        {icon ? <span className="shrink-0 text-ink-muted">{icon}</span> : null}
        <input
          ref={ref}
          className="flex-1 min-w-0 bg-transparent outline-none text-[14px] font-medium text-ink placeholder:text-ink-muted placeholder:font-medium"
          {...props}
        />
        {trailing}
      </div>
    );
  }
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { forceFocused?: boolean }
>(({ className, forceFocused, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full p-4 rounded-card border-[1.5px] bg-white outline-none resize-none text-[14px] leading-snug text-ink placeholder:text-ink-muted",
        "transition-shadow",
        forceFocused
          ? "border-ink shadow-[0_0_0_3px_rgba(42,38,36,0.06)]"
          : "border-line focus:border-ink focus:shadow-[0_0_0_3px_rgba(42,38,36,0.06)]",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export function Label({
  children,
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-label font-display text-ink mb-2", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldHint({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "warning" | "danger";
}) {
  const tones = {
    muted: "text-ink-muted",
    warning: "text-warning",
    danger: "text-accent-dark",
  };
  return <p className={cn("text-caption mt-1", tones[tone])}>{children}</p>;
}
