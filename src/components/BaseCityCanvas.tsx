ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.fillStyle = tileFill;
          ctx.fill();
          ctx.strokeStyle = "rgba(255,255,255,0.06)";
          ctx.stroke();
import React, { useEffect, useRef, useState } from "react";
import { CITY_SECTORS, CitySector } from "../data/sectors";
import { AvatarConfig } from "./AvatarCustomizer";

interface BaseCityCanvasProps {
  avatar: AvatarConfig;
  selectedSector: CitySector | null;
  onSelectSector: (sector: CitySector | null) => void;
}

const GRID_COLS = 20;
const GRID_ROWS = 15;
const TILE_W = 56;
const TILE_H = 28;

function gridToIso(gx: number, gy: number, originX: number, originY: number) {
  return {
    x: originX + (gx - gy) * (TILE_W / 2),
    y: originY + (gx + gy) * (TILE_H / 2),
  };
}

function isoToGrid(sx: number, sy: number, originX: number, originY: number) {
  const dx = sx - originX;
  const dy = sy - originY;
  const gx = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2;
  const gy = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;
  return { gx, gy };
}

export const BaseCityCanvas: React.FC<BaseCityCanvasProps> = ({
  avatar,
  selectedSector,
  onSelectSector,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerPos = useRef({ gx: 8.5, gy: 7.5 });
  const targetPos = useRef<{ gx: number; gy: number } | null>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const [nearbySector, setNearbySector] = useState<CitySector | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      targetPos.current = null;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const originX = canvas.width / 2;
    const originY = 95;

    const { gx, gy } = isoToGrid(sx, sy, originX, originY);
    const clampedX = Math.max(1, Math.min(GRID_COLS - 1.5, gx));
    const clampedY = Math.max(1, Math.min(GRID_ROWS - 1.5, gy));
    targetPos.current = { gx: clampedX, gy: clampedY };

    const clickedSector = CITY_SECTORS.find(
      (s) =>
        clampedX >= s.x - 0.8 &&
        clampedX <= s.x + s.width + 0.8 &&
        clampedY >= s.y - 0.8 &&
        clampedY <= s.y + s.height + 0.8
    );
    if (clickedSector) {
      onSelectSector(clickedSector);
    }
  };

  useEffect(() => {
    let animId = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvas.clientWidth || 900;
      canvas.height = canvas.clientHeight || 560;

      const speed = 0.08;
      let dx = 0;
      let dy = 0;
      if (keysPressed.current["w"] || keysPressed.current["arrowup"]) dy -= speed;
      if (keysPressed.current["s"] || keysPressed.current["arrowdown"]) dy += speed;
      if (keysPressed.current["a"] || keysPressed.current["arrowleft"]) dx -= speed;
      if (keysPressed.current["d"] || keysPressed.current["arrowright"]) dx += speed;

      if (dx !== 0 || dy !== 0) {
        playerPos.current.gx = Math.max(1, Math.min(GRID_COLS - 1.5, playerPos.current.gx + dx));
        playerPos.current.gy = Math.max(1, Math.min(GRID_ROWS - 1.5, playerPos.current.gy + dy));
      } else if (targetPos.current) {
        const diffX = targetPos.current.gx - playerPos.current.gx;
        const diffY = targetPos.current.gy - playerPos.current.gy;
        const dist = Math.hypot(diffX, diffY);
        if (dist > 0.08) {
          playerPos.current.gx += (diffX / dist) * speed;
          playerPos.current.gy += (diffY / dist) * speed;
        } else {
          targetPos.current = null;
        }
      }

      const foundNear =
        CITY_SECTORS.find((s) => {
          const cx = s.x + s.width / 2;
          const cy = s.y + s.height / 2;
          return Math.hypot(playerPos.current.gx - cx, playerPos.current.gy - cy) < 3.2;
        }) || null;

      setNearbySector((prev) => (prev?.id === foundNear?.id ? prev : foundNear));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, "#1e1b4b");
      bgGrad.addColorStop(0.55, "#0f172a");
      bgGrad.addColorStop(1, "#0284c7");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const originX = canvas.width / 2;
      const originY = 95;

      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const p0 = gridToIso(c, r, originX, originY);
          const p1 = gridToIso(c + 1, r, originX, originY);
          const p2 = gridToIso(c + 1, r + 1, originX, originY);
          const p3 = gridToIso(c, r + 1, originX, originY);

          let tileFill = "#334155";
          if (r >= 9 && r <= 11) tileFill = "#f3d58d";
          if (r >= 12) tileFill = "#0ea5e9";
          if (r === 7 || c === 8) tileFill = "#1e293b";
          }
      }

      CITY_SECTORS.forEach((sec) => {
        const topLeft = gridToIso(sec.x, sec.y, originX, originY);
        const topRight = gridToIso(sec.x + sec.width, sec.y, originX, originY);
        const bottomRight = gridToIso(sec.x + sec.width, sec.y + sec.height, originX, originY);
        const bottomLeft = gridToIso(sec.x, sec.y + sec.height, originX, originY);
        const lift = sec.zone === "Beach & Lounge" ? 8 : 28;
        const isSelected = selectedSector?.id === sec.id;

        ctx.beginPath();
        ctx.moveTo(bottomLeft.x, bottomLeft.y);
        ctx.lineTo(bottomRight.x, bottomRight.y);
        ctx.lineTo(bottomRight.x, bottomRight.y - lift);
        ctx.lineTo(bottomLeft.x, bottomLeft.y - lift);
        ctx.closePath();
        ctx.fillStyle = sec.color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(topLeft.x, topLeft.y - lift);
        ctx.lineTo(topRight.x, topRight.y - lift);
        ctx.lineTo(bottomRight.x, bottomRight.y - lift);
        ctx.lineTo(bottomLeft.x, bottomLeft.y - lift);
        ctx.closePath();
        ctx.fillStyle = sec.accent;
        ctx.fill();
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.strokeStyle = isSelected ? "#facc15" : "#0f172a";
        ctx.stroke();
        ctx.lineWidth = 1;

        const center = gridToIso(
          sec.x + sec.width / 2,
          sec.y + sec.height / 2,
          originX,
          originY
        );
        ctx.font = "bold 12px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#0f172a";
        ctx.fillText(sec.name, center.x, center.y - lift + 4);
      });

      const pScreen = gridToIso(playerPos.current.gx, playerPos.current.gy, originX, originY);
      const wScale = avatar.bodyWidth;
      const hScale = avatar.bodyHeight;
      const headR = 7 * avatar.headScale;
      const torsoW = 14 * wScale;
      const torsoH = 18 * hScale;

      ctx.beginPath();
      ctx.ellipse(pScreen.x, pScreen.y + 2, 11 * wScale, 5.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fill();

      ctx.strokeStyle = avatar.skinTone;
      ctx.lineWidth = 3 * wScale;
      ctx.beginPath();
      ctx.moveTo(pScreen.x - 4 * wScale, pScreen.y - 2);
      ctx.lineTo(pScreen.x - 4 * wScale, pScreen.y + 5);
      ctx.moveTo(pScreen.x + 4 * wScale, pScreen.y - 2);
      ctx.lineTo(pScreen.x + 4 * wScale, pScreen.y + 5);
      ctx.stroke();

      ctx.fillStyle = avatar.outfitColor;
      ctx.beginPath();
      ctx.roundRect(
        pScreen.x - torsoW / 2,
        pScreen.y - 2 - torsoH,
        torsoW,
        torsoH,
        5
      );
      ctx.fill();

      const headY = pScreen.y - 4 - torsoH - headR;
      ctx.beginPath();
      ctx.arc(pScreen.x, headY, headR, 0, Math.PI * 2);
      ctx.fillStyle = avatar.skinTone;
      ctx.fill();

      if (avatar.visor) {
        ctx.fillStyle = "#38bdf8";
        ctx.fillRect(pScreen.x - headR * 0.7, headY - 2, headR * 1.4, 4);
      }

      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(avatar.name || "Citizen", pScreen.x, headY - headR - 6);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [avatar, selectedSector]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{ width: "100%", height: "100%", display: "block", cursor: "pointer" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          background: "rgba(15, 23, 42, 0.85)",
          border: "1px solid rgba(148, 163, 184, 0.25)",
          borderRadius: 10,
          padding: "8px 12px",
          fontSize: 12,
          color: "#e2e8f0",
        }}
      >
        Move: <b>WASD / Arrows / Click Map</b>
        {nearbySector && (
          <span style={{ marginLeft: 12, color: "#38bdf8" }}>
            Near: <b>{nearbySector.name}</b>
          </span>
        )}
      </div>
    </div>
  );
};
