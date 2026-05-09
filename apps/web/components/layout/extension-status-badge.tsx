import { PlugZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getRuntimeModeStatus } from "@/lib/runtime-status";

const badgeClass = {
  live: "border-emerald/40 bg-emerald/10 text-emerald",
  demo: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  setup_required: "border-rose-400/30 bg-rose-400/10 text-rose-200"
} as const;

export function ExtensionStatusBadge() {
  const status = getRuntimeModeStatus();
  return (
    <Badge className={badgeClass[status.mode]} title={status.detail}>
      <PlugZap className="mr-1 h-3.5 w-3.5" />
      {status.label}
    </Badge>
  );
}
