import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/[0.05] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2.4s_infinite] before:bg-gradient-to-r before:from-transparent before:via-cyan/10 before:to-transparent",
        className
      )}
    />
  );
}
