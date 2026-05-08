import { PlugZap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getExtensionStatus } from "@/lib/mock-service";

export function ExtensionStatusBadge() {
  const status = getExtensionStatus();
  return (
    <Badge className={status.connected ? "border-emerald/40 bg-emerald/10 text-emerald" : "border-amber-400/30 bg-amber-400/10 text-amber-200"}>
      <PlugZap className="mr-1 h-3.5 w-3.5" />
      {status.connected ? "Extension paired" : "Mock mode active"}
    </Badge>
  );
}
