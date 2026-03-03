export const COLORS = {
  bg: {
    primary: "#000000",
    secondary: "#0A0E1A",
    card: "rgba(34, 32, 82, 0.4)",
    cardSolid: "#222052",
    input: "rgba(0, 0, 0, 0.3)",
  },
  accent: {
    gold: "#D2B68A",
    cream: "#EEE5D3",
    electricBlue: "#2B7FFF",
    cyan: "#00A3FF",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B7B7B7",
    muted: "rgba(255, 255, 255, 0.5)",
  },
  border: {
    gold: "rgba(210, 182, 138, 0.15)",
    silver: "rgba(183, 183, 183, 0.1)",
  },
  glow: {
    gold: "rgba(210, 182, 138, 0.3)",
    blue: "rgba(43, 127, 255, 0.3)",
  },
  disc: {
    d: "#E74C3C",
    i: "#F1C40F",
    s: "#2ECC71",
    c: "#3498DB",
  },
  status: {
    new: "#3498DB",
    reviewed: "#F1C40F",
    approved: "#2ECC71",
    rejected: "#E74C3C",
    interview: "#9B59B6",
  },
  position: {
    "gestor-trafego": "#2B7FFF",
    "cs-suporte": "#2ECC71",
    "dev-senior-fullstack": "#9B59B6",
  },
} as const

export const DISC_FACTOR_COLORS: Readonly<Record<string, string>> = {
  D: "#E74C3C",
  I: "#F1C40F",
  S: "#2ECC71",
  C: "#3498DB",
} as const

export const STATUS_LABELS: Readonly<Record<string, string>> = {
  new: "Novo",
  reviewed: "Revisado",
  approved: "Aprovado",
  rejected: "Rejeitado",
  interview: "Entrevista",
} as const

export const POSITION_LABELS: Readonly<Record<string, string>> = {
  "gestor-trafego": "Gestor de Trafego",
  "cs-suporte": "CS / Suporte",
  "dev-senior-fullstack": "Dev Full-Stack",
} as const

export const TRANSITIONS = {
  fast: { duration: 0.15, ease: "easeOut" },
  normal: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 24 },
} as const
