import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "outline" | "glass";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-bg-primary shadow-cta hover:bg-ink/95 active:bg-ink disabled:bg-bg-tertiary disabled:text-ink-muted disabled:shadow-none",
  secondary:
    "bg-transparent text-ink border border-line hover:bg-bg-secondary",
  ghost: "bg-transparent text-ink hover:bg-bg-secondary",
  accent: "bg-accent text-bg-primary hover:bg-accent-dark shadow-accent",
  outline: "bg-transparent text-ink border border-ink/15 hover:border-ink/30",
  glass:
    "text-ink border border-white/55 glass-pill",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] rounded-card-sm",
  md: "h-12 px-5 text-[14px] rounded-card",
  lg: "h-14 px-6 text-[15px] rounded-card-lg",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-display font-bold tracking-tight transition-colors",
          "disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
