import { Card } from "@/components/ui/card";

export function CompetitorRadarCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-emerald/20 bg-emerald/5">
      <div className="text-xs uppercase tracking-[0.3em] text-emerald">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </Card>
  );
}
