import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition duration-200",
        variant === "default" && "border-cyan/40 bg-cyan/15 text-cyan shadow-glow hover:bg-cyan/20",
        variant === "ghost" && "border-transparent bg-white/5 text-slate-200 hover:bg-white/10",
        variant === "outline" && "border-white/15 bg-white/5 text-white hover:border-cyan/30",
        className
      )}
      {...props}
    />
  );
}
