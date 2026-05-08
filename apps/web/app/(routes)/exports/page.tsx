import { DownloadCloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createExportJob, getExportJobs } from "@/lib/mock-service";

export default function ExportsPage() {
  if (getExportJobs().length === 0) {
    createExportJob("products");
    createExportJob("watchlist");
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.35em] text-cyan">Export Center</div>
        <h1 className="mt-2 text-3xl font-semibold">Riwayat export CSV untuk products, trending, competitor, dan watchlist</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["products", "trending", "competitors", "watchlist"].map((kind) => (
          <Card key={kind}>
            <div className="text-lg font-semibold capitalize text-white">{kind}</div>
            <div className="mt-2 text-sm text-slate-400">Generate instant CSV dari dataset mock atau Supabase fallback.</div>
            <a href={`/api/exports/csv?kind=${kind}`} className="mt-4 inline-flex">
              <Button>
                <DownloadCloud className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          </Card>
        ))}
      </div>
      <Card>
        <div className="mb-4 text-xl font-semibold">History export CSV</div>
        <div className="space-y-3">
          {getExportJobs().map((job) => (
            <div key={job.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3">
              <div>
                <div className="text-sm text-white">{job.kind}</div>
                <div className="text-xs text-slate-400">{job.createdAt}</div>
              </div>
              <div className="rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1 text-xs text-emerald">{job.status}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
