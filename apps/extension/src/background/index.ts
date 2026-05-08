import { DEFAULT_APP_URL } from "../shared/normalize";
import type { ExtensionMessage, ExtensionStorageState, ScanPayload } from "../shared/types";

const defaultState: ExtensionStorageState = {
  appUrl: DEFAULT_APP_URL,
  lastScan: null,
  lastSendStatus: "idle"
};

async function getState(): Promise<ExtensionStorageState> {
  const state = await chrome.storage.local.get(defaultState);
  return { ...defaultState, ...state } as ExtensionStorageState;
}

async function setState(nextState: Partial<ExtensionStorageState>) {
  await chrome.storage.local.set(nextState);
}

async function sendLastScanToDashboard(scan: ScanPayload) {
  const state = await getState();
  await setState({ lastSendStatus: "sending", lastSendMessage: "Sending visible DOM snapshot..." });

  try {
    const response = await fetch(`${state.appUrl}/api/extension/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scan)
    });
    const data = await response.json();
    await setState({
      lastSendStatus: "success",
      lastSendMessage: `Sent ${scan.products.length} products to Hype2Profit`
    });
    return data;
  } catch (error) {
    await setState({
      lastSendStatus: "error",
      lastSendMessage: error instanceof Error ? error.message : "Unknown send error"
    });
    throw error;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set(defaultState);
});

chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === "H2P_SCAN_RESULT") {
    setState({ lastScan: message.payload, lastSendStatus: "idle", lastSendMessage: "Scan ready to send" }).then(() =>
      sendResponse({ ok: true, count: message.payload.products.length })
    );
    return true;
  }

  if (message.type === "H2P_GET_LAST_SCAN") {
    getState().then((state) => sendResponse(state));
    return true;
  }

  if (message.type === "H2P_SEND_LAST_SCAN") {
    getState()
      .then((state) => {
        if (!state.lastScan) throw new Error("No scan available yet");
        return sendLastScanToDashboard(state.lastScan);
      })
      .then((data) => sendResponse({ ok: true, data }))
      .catch((error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }));
    return true;
  }

  if (message.type === "H2P_UPDATE_APP_URL") {
    setState({ appUrl: message.payload.appUrl }).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (message.type === "H2P_OPEN_DASHBOARD") {
    getState().then((state) => {
      chrome.tabs.create({ url: `${state.appUrl}/dashboard` });
      sendResponse({ ok: true });
    });
    return true;
  }
});
