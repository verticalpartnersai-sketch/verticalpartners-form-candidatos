import type { DiscFactor } from "@/types"

const FACTOR_DESCRIPTIONS: Readonly<Record<DiscFactor, string>> = {
  D: "Você é uma pessoa direta, decidida e orientada a resultados. Gosta de desafios, toma decisões rápidas e prefere liderar a seguir. Em ambientes de pressão, mantém o foco no objetivo e age com determinação.",
  I: "Você é uma pessoa entusiasta, otimista e sociável. Tem facilidade para persuadir, motivar e se conectar com os outros. Prefere ambientes dinâmicos e colaborativos, e se destaca pela comunicação e energia contagiante.",
  S: "Você é uma pessoa paciente, leal e cooperativa. Valoriza estabilidade, harmonia e relacionamentos de confiança. Em equipe, é o pilar que mantém todos unidos, com escuta ativa e suporte constante.",
  C: "Você é uma pessoa analítica, precisa e organizada. Valoriza qualidade, lógica e processos bem definidos. Toma decisões baseadas em dados, é metódica e busca excelência em tudo que faz.",
}

const COMBINATION_DESCRIPTIONS: Readonly<Record<string, string>> = {
  DI: "Você combina assertividade com sociabilidade. É uma pessoa que lidera com entusiasmo — toma decisões rápidas e consegue envolver os outros na execução. Ideal para papéis que exigem iniciativa e persuasão.",
  DI_alt: "Perfil de liderança inspiradora. Você une a capacidade de tomar decisões firmes (D) com o carisma e energia para motivar equipes (I). Age com velocidade e convence pela visão.",

  DC: "Você combina determinação com precisão. É uma pessoa que busca resultados de alta qualidade — lidera com firmeza, mas sempre com base em análise e dados. Excelente para papéis técnicos de liderança.",
  DC_alt: "Perfil de excelência estratégica. Você une a orientação a resultados (D) com o rigor analítico (C). Não aceita trabalho medíocre e toma decisões embasadas.",

  ID: "Você combina influência com assertividade. É uma pessoa carismática que também sabe tomar decisões difíceis. Lidera pela comunicação e pela ação — inspira e executa.",
  ID_alt: "Perfil de liderança carismática. Você une a capacidade de conectar pessoas (I) com a determinação para agir (D). Motiva pelo exemplo e não tem medo de desafios.",

  IS: "Você combina sociabilidade com cooperação. É uma pessoa empática que se conecta genuinamente com os outros. Cria ambientes acolhedores e colaborativos — excelente para papéis de suporte e relacionamento.",
  IS_alt: "Perfil de relacionamento e cuidado. Você une a energia comunicativa (I) com a paciência e lealdade (S). Constrói relacionamentos duradouros e inspira confiança.",

  SI: "Você combina estabilidade com sociabilidade. É uma pessoa confiável e amigável — mantém a calma sob pressão e se comunica com empatia. Ideal para atendimento ao cliente e trabalho em equipe.",
  SI_alt: "Perfil de suporte empático. Você une a consistência e paciência (S) com a capacidade de se conectar (I). É o porto seguro da equipe, sempre disponível e acolhedor.",

  SC: "Você combina cooperação com precisão. É uma pessoa metódica e confiável — segue processos com disciplina e mantém a qualidade. Excelente para papéis que exigem consistência e atenção aos detalhes.",
  SC_alt: "Perfil de confiabilidade técnica. Você une a lealdade e paciência (S) com o rigor analítico (C). Entrega trabalho sólido e consistente, sem cortar caminho.",

  CS: "Você combina análise com cooperação. É uma pessoa organizada e colaborativa — busca qualidade sem criar conflitos. Trabalha bem em processos estruturados e valoriza harmonia na equipe.",
  CS_alt: "Perfil de qualidade colaborativa. Você une a precisão (C) com a estabilidade (S). É meticuloso sem ser inflexível, e coopera mantendo altos padrões.",

  CD: "Você combina precisão com determinação. É uma pessoa que busca excelência com autonomia — analisa profundamente e age com decisão. Ideal para papéis técnicos que exigem independência e rigor.",
  CD_alt: "Perfil de especialista autônomo. Você une o rigor analítico (C) com a assertividade (D). Não depende de validação externa e entrega trabalho de alta qualidade.",

  DS: "Você combina determinação com estabilidade. É uma pessoa que lidera com firmeza, mas valoriza harmonia. Toma decisões difíceis sem perder a empatia — equilibra resultados com pessoas.",
  SD: "Você combina cooperação com assertividade. É uma pessoa confiável que também sabe tomar a frente quando necessário. Mantém a calma e age com determinação nos momentos certos.",

  IC: "Você combina sociabilidade com precisão. É uma pessoa que se comunica com clareza e fundamentação. Persuade com dados e constrói argumentos sólidos — excelente para apresentações e relatórios.",
  CI: "Você combina análise com influência. É uma pessoa metódica que também sabe se comunicar e envolver os outros. Traduz complexidade em clareza — ideal para papéis que conectam técnico e negócio.",
}

export function getDiscDescription(primary: DiscFactor, secondary: DiscFactor): string {
  if (primary === secondary) {
    return FACTOR_DESCRIPTIONS[primary]
  }

  const code = `${primary}${secondary}`
  const description = COMBINATION_DESCRIPTIONS[code]

  if (description) {
    return description
  }

  return `${FACTOR_DESCRIPTIONS[primary]} Complementado por traços de ${getFactorName(secondary).toLowerCase()}: ${getShortDescription(secondary)}`
}

function getFactorName(factor: DiscFactor): string {
  const names: Readonly<Record<DiscFactor, string>> = {
    D: "Dominância",
    I: "Influência",
    S: "Estabilidade",
    C: "Conformidade",
  }
  return names[factor]
}

function getShortDescription(factor: DiscFactor): string {
  const short: Readonly<Record<DiscFactor, string>> = {
    D: "assertividade e orientação a resultados.",
    I: "sociabilidade e capacidade de persuasão.",
    S: "paciência e cooperação.",
    C: "precisão e organização.",
  }
  return short[factor]
}

export function getFactorLabel(factor: DiscFactor): string {
  return getFactorName(factor)
}
