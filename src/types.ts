export interface AgentRole {
  id: string;
  name: string;
  tag: string;
  iconName: string;
  ollamaModel: string;
  modelJustification: string;
  cognitiveLoad: "High" | "Medium" | "Low";
  responsibilities: string[];
  hermesTools: { name: string; description: string }[];
  frameworkTemplate: string;
}

export interface IncidentOption {
  type: string;
  title: string;
  defaultDescription: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  defaultAssets: string[];
}

export interface SimulatedTurn {
  agentName: string;
  modelUsed: string;
  toolUsed: string;
  message: string;
}

export interface SimulatedPhase {
  phaseNumber: number;
  phaseName: string;
  stateSummary: string;
  networkImpactScore: number; // 0 - 100
  dialogs: SimulatedTurn[];
  containmentMeasures: string[];
}

export interface SimulationResult {
  title: string;
  summary: string;
  overallSeverity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  compromisedAssets: string[];
  phases: SimulatedPhase[];
  postMortemLessons: string[];
}
