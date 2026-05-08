import { DashboardView } from "@/features/dashboard/components";
import { getDashboardPayload } from "@/lib/mock-service";

export default function DashboardPage() {
  return <DashboardView payload={getDashboardPayload("all")} />;
}
