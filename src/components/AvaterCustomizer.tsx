import React from "react";

export interface AvatarConfig {
  name: string;
  bodyWidth: number;   // 0.75 (slim) to 1.45 (broad/muscular)
  bodyHeight: number;  // 0.80 (compact) to 1.30 (tall)
  headScale: number;   // 0.85 to 1.25
  outfitColor: string;
  skinTone: string;
  visor: boolean;
}

interface AvatarCustomizerProps {
  avatar: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}

const OUTFIT_COLORS = ["#0052FF", "#7C3AED", "#EC4899", "#10B981", "#F59E0B", "#EF4444"];
const SKIN_TONES = ["#F8D2B4", "#E5B893", "#C68B59", "#8D5524", "#523218"];

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ avatar, onChange }) => {
  const update = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    onChange({ ...avatar, [key]: value });
  };

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.92)",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        borderRadius: 14,
        padding: 14,
        width: 260,
        color: "#f8fafc",
        fontSize: 13,
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "#60a5fa" }}>
        Custom Body & Citizen Shape
      </div>

      <label style={{ display: "block", marginBottom: 8 }}>
        <span style={{ display: "block", color: "#94a3b8", marginBottom: 4 }}>Citizen Name</span>
        <input
          type="text"
          value={avatar.name}
          maxLength={16}
          onChange={(e) => update("name", e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "6px 8px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#fff",
          }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
          <span>Body Width (Build)</span>
          <span>{Math.round(avatar.bodyWidth * 100)}%</span>
        </div>
        <input
          type="range"
          min={0.75}
          max={1.45}
          step={0.05}
          value={avatar.bodyWidth}
          onChange={(e) => update("bodyWidth", parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
          <span>Body Height</span>
          <span>{Math.round(avatar.bodyHeight * 100)}%</span>
        </div>
        <input
          type="range"
          min={0.8}
          max={1.3}
          step={0.05}
          value={avatar.bodyHeight}
          onChange={(e) => update("bodyHeight", parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <label style={{ display: "block", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#cbd5e1" }}>
          <span>Head Proportion</span>
          <span>{Math.round(avatar.headScale * 100)}%</span>
        </div>
        <input
          type="range"
          min={0.85}
          max={1.25}
          step={0.05}
          value={avatar.headScale}
          onChange={(e) => update("headScale", parseFloat(e.target.value))}
          style={{ width: "100%" }}
        />
      </label>

      <div style={{ marginBottom: 8 }}>
        <div style={{ color: "#94a3b8", marginBottom: 4 }}>Outfit Color</div>
        <div style={{ display: "flex", gap: 6 }}>
          {OUTFIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update("outfitColor", c)}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: c,
                border: avatar.outfitColor === c ? "2px solid #fff" : "1px solid #334155",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ color: "#94a3b8", marginBottom: 4 }}>Skin Tone</div>
        <div style={{ display: "flex", gap: 6 }}>
          {SKIN_TONES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update("skinTone", c)}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: c,
                border: avatar.skinTone === c ? "2px solid #fff" : "1px solid #334155",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={avatar.visor}
          onChange={(e) => update("visor", e.target.checked)}
        />
        <span>Base Cyber Visor</span>
      </label>
    </div>
  );
};
