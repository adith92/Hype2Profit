import { Card } from "@/components/ui/card";
import { ExtensionStatusBadge } from "@/components/layout/extension-status-badge";

export default function SettingsPage() {
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
      </div>
    </div>
  );
}
