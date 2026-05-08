import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="overflow-hidden border-dashed border-cyan/20 bg-slate-950/70">
      <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
        <svg viewBox="0 0 320 160" className="mb-6 h-40 w-full max-w-sm">
          <defs>
            <linearGradient id="empty-grid" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(103,232,249,.75)" />
              <stop offset="100%" stopColor="rgba(139,92,246,.5)" />
            </linearGradient>
          </defs>
          <rect x="24" y="30" width="272" height="100" rx="24" fill="rgba(15,23,42,.8)" stroke="url(#empty-grid)" strokeDasharray="5 6" />
          <path d="M46 108 L102 84 L148 94 L210 58 L274 70" fill="none" stroke="url(#empty-grid)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="102" cy="84" r="6" fill="#67e8f9" />
          <circle cx="210" cy="58" r="6" fill="#8b5cf6" />
        </svg>
        <div className="text-xl font-semibold text-white">{title}</div>
        <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      </div>
    </Card>
  );
}
