import React from "react";
import ReactDOM from "react-dom/client";
import { detectMarketplace } from "../shared/detect";
import { DEFAULT_APP_URL } from "../shared/normalize";
import type { ExtensionStorageState, ScanPayload } from "../shared/types";

function Popup() {
  const [status, setStatus] = React.useState("Ready");
  const [marketplace, setMarketplace] = React.useState("unknown");
  const [productCount, setProductCount] = React.useState(0);
  const [connectionStatus, setConnectionStatus] = React.useState<ExtensionStorageState["lastSendStatus"]>("idle");
  const [appUrl, setAppUrl] = React.useState(DEFAULT_APP_URL);

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "H2P_GET_LAST_SCAN" }, (state: ExtensionStorageState) => {
      if (!state) return;
      setConnectionStatus(state.lastSendStatus);
      setAppUrl(state.appUrl);
      setProductCount(state.lastScan?.products.length ?? 0);
      setStatus(state.lastSendMessage || "Ready");
    });
  }, []);

  async function scanPage() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    setMarketplace(detectMarketplace(new URL(tab.url ?? "https://example.com").hostname));
    const response = (await chrome.tabs.sendMessage(tab.id, { type: "H2P_SCAN_PAGE" })) as ScanPayload;
    await chrome.runtime.sendMessage({ type: "H2P_SCAN_RESULT", payload: response });
    setProductCount(response.products.length);
    setStatus(`Scanned ${response.products.length} visible products`);
  }

  async function sendToDashboard() {
    setConnectionStatus("sending");
    const response = await chrome.runtime.sendMessage({ type: "H2P_SEND_LAST_SCAN" });
    setConnectionStatus(response?.ok ? "success" : "error");
    setStatus(response?.ok ? "Payload sent to dashboard" : response?.error || "Failed to send");
  }

  async function saveAppUrl() {
    await chrome.runtime.sendMessage({ type: "H2P_UPDATE_APP_URL", payload: { appUrl } });
    setStatus("Dashboard URL updated");
  }

  return (
    <div style={{ width: 320, minHeight: 280, padding: 16, background: "#070b14", color: "#f8fafc", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#67e8f9", textTransform: "uppercase" }}>Hype2Profit</div>
      <h1 style={{ fontSize: 22, marginTop: 8 }}>Market Signal Capture</h1>
      <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>TradingView for Marketplace Product Research Indonesia</div>
      <div style={{ marginTop: 12, padding: 12, border: "1px solid rgba(103,232,249,.2)", borderRadius: 18, background: "rgba(255,255,255,.04)" }}>
        <div>Connection status</div>
        <div style={{ marginTop: 6, color: "#67e8f9" }}>{status}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: "#94a3b8" }}>State: {connectionStatus}</div>
      </div>
      <div style={{ marginTop: 12, padding: 12, border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, background: "rgba(255,255,255,.04)" }}>
        <div>Current marketplace detected</div>
        <div style={{ marginTop: 6 }}>{marketplace}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>Visible product count: {productCount}</div>
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ marginBottom: 6, fontSize: 12, color: "#94a3b8" }}>Dashboard URL</div>
        <input
          value={appUrl}
          onChange={(event) => setAppUrl(event.target.value)}
          style={{ width: "100%", borderRadius: 14, border: "1px solid rgba(255,255,255,.1)", padding: "10px 12px", background: "rgba(255,255,255,.04)", color: "#f8fafc" }}
        />
        <button onClick={saveAppUrl} style={{ marginTop: 8, width: "100%", borderRadius: 14, border: "1px solid rgba(255,255,255,.08)", padding: "10px 12px", background: "rgba(255,255,255,.04)", color: "#cbd5e1" }}>
          Save dashboard URL
        </button>
      </div>
      <button onClick={scanPage} style={{ marginTop: 16, width: "100%", borderRadius: 16, border: "1px solid rgba(103,232,249,.3)", padding: "12px 14px", background: "rgba(103,232,249,.12)", color: "#67e8f9" }}>
        Scan current page
      </button>
      <button onClick={sendToDashboard} style={{ marginTop: 10, width: "100%", borderRadius: 16, border: "1px solid rgba(52,211,153,.24)", padding: "12px 14px", background: "rgba(52,211,153,.08)", color: "#34d399" }}>
        Send to dashboard
      </button>
      <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>
        Visible DOM only. No private API, no captcha bypass, no checkout automation. Semua angka di dashboard adalah estimasi untuk riset keputusan.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
