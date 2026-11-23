export interface CitySector {
  id: string;
  name: string;
  zone: "Builders & Finance" | "DeFi & Apps" | "Creator Stage" | "Beach & Lounge";
  roleLabel: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  accent: string;
}

export const CITY_SECTORS: CitySector[] = [
  {
    id: "base-builders-hq",
    name: "Base Builders HQ",
    zone: "Builders & Finance",
    roleLabel: "Builders & Team Hub",
    description:
      "Main glass & tower hub where Base builders, contributors, and ecosystem teams collaborate on onchain apps.",
    x: 4,
    y: 3,
    width: 4,
    height: 3,
    color: "#2563eb",
    accent: "#93c5fd",
  },
  {
    id: "bankr-defi-plaza",
    name: "Bankr & DeFi Plaza",
    zone: "DeFi & Apps",
    roleLabel: "dApps & Liquidity Spot",
    description:
      "Downtown plaza where DeFi protocols, swaps, and onchain finance spots live side by side.",
    x: 9,
    y: 4,
    width: 3,
    height: 3,
    color: "#7c3aed",
    accent: "#ddd6fe",
  },
  {
    id: "clanker-stage",
    name: "Clanker Live Stage",
    zone: "Creator Stage",
    roleLabel: "Creators & Events",
    description:
      "High-energy music, memes, and creator showcase stage right in the heart of Base City.",
    x: 13,
    y: 3,
    width: 3,
    height: 3,
    color: "#db2777",
    accent: "#fbcfe8",
  },
  {
    id: "feel-cash-beach",
    name: "Feel.Cash Boardwalk",
    zone: "Beach & Lounge",
    roleLabel: "Beach & Hangout Zone",
    description:
      "Sunny beachfront boardwalk with hangout spots, beach activities, and relaxed community corners.",
    x: 6,
    y: 10,
    width: 6,
    height: 2,
    color: "#0891b2",
    accent: "#a5f3fc",
  },
];
