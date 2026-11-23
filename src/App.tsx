import React, { useState } from "react";
import { AvatarConfig, AvatarCustomizer } from "./components/AvatarCustomizer";
import { BaseCityCanvas } from "./components/BaseCityCanvas";
import { CitySector } from "./data/sectors";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const BASE_CHAIN_ID_HEX = "0x2105"; // 8453 (Base Mainnet)

export function App() {
  const [avatar, setAvatar] = useState<AvatarConfig>({
    name: "Base Citizen",
    bodyWidth: 1.0,
    bodyHeight: 1.0,
    headScale: 1.0,
    outfitColor: "#0052FF",
    skinTone: "#E5B893",
    visor: true,
  });

  const [selectedSector, setSelectedSector] = useState<CitySector | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletStatus, setWalletStatus] = useState<string>("");

  const connectBaseWallet = async () => {
    if (!window.ethereum) {
      setWalletStatus("No browser wallet found (install Rabby/Coinbase/MetaMask)");
      return;
    }
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BASE_CHAIN_ID_HEX }],
        });
      } catch {
        // User may cancel network switch; keep connected state
      }

      if (accounts && accounts[0]) {
        setWalletAddress(accounts[0]);
        setWalletStatus("Connected on Base");
      }
    } catch {
      setWalletStatus("Wallet connection cancelled");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw" }}>
      <header
        style={{
          height: 54,
          padding: "0 16px",
          background: "#0b1120",
          borderBottom: "1px solid rgba(148, 163, 184, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#0052FF",
              display: "inline-block",
            }}
          />
          <strong style={{ fontSize: 16 }}>BASE CITY</strong>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Lightweight Isometric World</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {walletStatus && (
            <span style={{ fontSize: 12, color: "#93c5fd" }}>{walletStatus}</span>
          )}
          <button
            type="button"
            onClick={connectBaseWallet}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "none",
              background: "#0052FF",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {walletAddress
              ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
              : "Connect Base Wallet"}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 10,
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <AvatarCustomizer avatar={avatar} onChange={setAvatar} />
        </div>

        <div style={{ flex: 1, height: "100%" }}>
          <BaseCityCanvas
            avatar={avatar}
            selectedSector={selectedSector}
            onSelectSector={setSelectedSector}
          />
        </div>

        {selectedSector && (
          <aside
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 10,
              width: 280,
              background: "rgba(15, 23, 42, 0.94)",
              border: "1px solid rgba(148, 163, 184, 0.25)",
              borderRadius: 14,
              padding: 16,
              color: "#f8fafc",
              boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#60a5fa", fontWeight: 700 }}>
                {selectedSector.zone.toUpperCase()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSector(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <h3 style={{ margin: "6px 0 4px", fontSize: 17 }}>{selectedSector.name}</h3>
            <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 10 }}>
              {selectedSector.roleLabel}
            </div>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#e2e8f0" }}>
              {selectedSector.description}
            </p>
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
