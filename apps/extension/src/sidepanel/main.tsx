import React from "react";
import ReactDOM from "react-dom/client";
import { DEFAULT_APP_URL, normalizeProductCard } from "../shared/normalize";
import type { ExtensionStorageState } from "../shared/types";

function Sidepanel() {
  const [state, setState] = React.useState<ExtensionStorageState>({
    appUrl: DEFAULT_APP_URL,
    lastScan: null,
    lastSendStatus: "idle"
  });

  React.useEffect(() => {
    chrome.runtime.sendMessage({ type: "H2P_GET_LAST_SCAN" }, (nextState: ExtensionStorageState) => {
      if (nextState) setState(nextState);
    });
  }, []);

  const previewRows = (state.lastScan?.products ?? []).map(normalizeProductCard);

  return (
    <div style={{ minHeight: "100vh", padding: 16, background: "#050816", color: "#e2e8f0", fontFamily: "system-ui" }}>
      <div style={{ fontSize: 12, letterSpacing: "0.3em", color: "#8b5cf6", textTransform: "uppercase" }}>Signal Bridge</div>
      <h1 style={{ marginTop: 8, fontSize: 24 }}>From visible products to decision cockpit</h1>
      <div style={{ marginTop: 16, border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 16, background: "rgba(255,255,255,.04)" }}>
        Side panel ini dipakai untuk preview hasil scan halaman aktif tanpa bypass login, captcha, atau API privat. Data dipakai sebagai estimasi keputusan, bukan angka resmi marketplace.
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button
          onClick={() => chrome.runtime.sendMessage({ type: "H2P_OPEN_DASHBOARD" })}
          style={{ borderRadius: 14, border: "1px solid rgba(103,232,249,.24)", padding: "10px 12px", background: "rgba(103,232,249,.08)", color: "#67e8f9" }}
        >
          Open dashboard
        </button>
        <button
          onClick={() => chrome.runtime.sendMessage({ type: "H2P_SEND_LAST_SCAN" }, () => chrome.runtime.sendMessage({ type: "H2P_GET_LAST_SCAN" }, setState))}
          style={{ borderRadius: 14, border: "1px solid rgba(52,211,153,.24)", padding: "10px 12px", background: "rgba(52,211,153,.08)", color: "#34d399" }}
        >
          Send latest scan
        </button>
      </div>
      <div style={{ marginTop: 18, fontSize: 13, color: "#94a3b8" }}>
        Connection: {state.lastSendStatus} {state.lastSendMessage ? `• ${state.lastSendMessage}` : ""}
      </div>
      <div style={{ marginTop: 18, overflow: "hidden", borderRadius: 20, border: "1px solid rgba(255,255,255,.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead style={{ background: "rgba(255,255,255,.04)", color: "#94a3b8" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left" }}>Product</th>
              <th style={{ padding: 12, textAlign: "left" }}>Price</th>
              <th style={{ padding: 12, textAlign: "left" }}>Sold</th>
              <th style={{ padding: 12, textAlign: "left" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {previewRows.length ? (
              previewRows.slice(0, 12).map((row) => (
                <tr key={row.id} style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                  <td style={{ padding: 12 }}>
                    <div style={{ color: "#f8fafc", fontWeight: 600 }}>{row.title || "Untitled product"}</div>
                    <div style={{ marginTop: 4, color: "#94a3b8", fontSize: 12 }}>{row.shop || "Unknown shop"}</div>
                  </td>
                  <td style={{ padding: 12 }}>{row.numericPrice || "-"}</td>
                  <td style={{ padding: 12 }}>{row.numericSold || "-"}</td>
                  <td style={{ padding: 12, color: "#67e8f9" }}>{row.estimatedScore}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ padding: 18, color: "#94a3b8", textAlign: "center" }}>
                  Scan visible product cards from a supported marketplace page to preview them here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Sidepanel />
  </React.StrictMode>
);
