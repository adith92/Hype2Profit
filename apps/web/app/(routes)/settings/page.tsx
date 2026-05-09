import { Card } from "@/components/ui/card";
import { ExtensionStatusBadge } from "@/components/layout/extension-status-badge";
import { getRuntimeModeStatus } from "@/lib/runtime-status";

export default function SettingsPage() {
  const runtime = getRuntimeModeStatus();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs uppercase tracking-[0.35em] text-cyan">Settings</div>
        <h1 className="mt-2 text-3xl font-semibold">Built safely for visible DOM research, not backend scraping farm</h1>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="text-lg font-semibold text-white">Supabase status</div>
          <div className="mt-3 text-sm text-slate-400">Gunakan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Prototype akan fallback ke mock data jika belum diisi.</div>
        </Card>
        <Card>
          <div className="text-lg font-semibold text-white">Extension pairing</div>
          <div className="mt-3">
            <ExtensionStatusBadge />
          </div>
          <div className="mt-3 text-sm text-slate-400">Pairing token menggunakan `EXTENSION_PAIRING_SECRET` dan ingest hanya menerima data visible DOM dari extension.</div>
        </Card>
        <Card>
          <div className="text-lg font-semibold text-white">Platform adapter config</div>
          <div className="mt-3 text-sm text-slate-400">Shopee menjadi platform utama V1. Tokopedia masuk jalur kedua. TikTok Shop hanya placeholder Phase 2 dan belum menjadi analytics track penuh.</div>
        </Card>
        <Card>
          <div className="text-lg font-semibold text-white">Data policy notice</div>
          <div className="mt-3 text-sm text-slate-400">Hype2Profit bukan scraper backend agresif dan bukan bot checkout. Extension hanya membaca visible DOM, tidak mengambil data personal pembeli, dan seluruh angka sales/revenue/views adalah estimasi.</div>
        </Card>
        <Card className="xl:col-span-2">
          <div className="text-lg font-semibold text-white">Runtime Diagnostics</div>
          <div className="mt-4 grid gap-3 md:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Mode</div>
              <div className="mt-2 text-sm text-white">{runtime.mode}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">hasSupabase</div>
              <div className="mt-2 text-sm text-white">{String(runtime.hasSupabase)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">mockDataEnabled</div>
              <div className="mt-2 text-sm text-white">{String(runtime.mockDataEnabled)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">extensionPaired</div>
              <div className="mt-2 text-sm text-white">{String(runtime.extensionPaired)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Missing Env</div>
              <div className="mt-2 text-sm text-white">{runtime.missing.length ? runtime.missing.join(", ") : "None"}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
