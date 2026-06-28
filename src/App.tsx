import { useState } from "react";
import { 
  ShieldCheck, 
  Users, 
  Eye, 
  Cpu, 
  AlertTriangle, 
  HardDrive, 
  Search, 
  Crosshair, 
  Server, 
  FolderOpen, 
  BookOpen, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  RefreshCw, 
  ExternalLink, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { cyberRoles, incidentTemplates } from "./data";
import { SimulationResult, AgentRole } from "./types";

// Helper component for icon rendering based on name string
function RoleIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  switch (name) {
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "Users": return <Users className={className} />;
    case "Eye": return <Eye className={className} />;
    case "Cpu": return <Cpu className={className} />;
    case "AlertTriangle": return <AlertTriangle className={className} />;
    case "HardDrive": return <HardDrive className={className} />;
    case "Search": return <Search className={className} />;
    case "Crosshair": return <Crosshair className={className} />;
    case "Server": return <Server className={className} />;
    case "FolderOpen": return <FolderOpen className={className} />;
    default: return <ShieldCheck className={className} />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"agents" | "simulator" | "tutorial" | "portfolio">("simulator");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("ciso");
  const [selectedIncidentType, setSelectedIncidentType] = useState<string>("ransomware");
  const [customDescription, setCustomDescription] = useState<string>("");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [diagRunning, setDiagRunning] = useState<boolean>(false);
  const [diagDone, setDiagDone] = useState<boolean>(false);

  const runDiagnostics = () => {
    setDiagRunning(true);
    setDiagDone(false);
    setTimeout(() => {
      setDiagRunning(false);
      setDiagDone(true);
    }, 1500);
  };

  const selectedAgent = cyberRoles.find(r => r.id === selectedAgentId) || cyberRoles[0];
  const activeIncidentTemplate = incidentTemplates.find(i => i.type === selectedIncidentType) || incidentTemplates[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const runSimulation = async () => {
    setSimulating(true);
    setErrorMessage(null);
    setSimulationResult(null);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incidentType: activeIncidentTemplate.title,
          customDescription: customDescription || activeIncidentTemplate.defaultDescription,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to trigger simulation on the backend.");
      }

      const data = await response.json();
      setSimulationResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred during communication with the server.");
    } finally {
      setSimulating(false);
    }
  };

  // Pre-compiled Github Portfolio code files structure
  const portfolioCodeFiles = {
    readme: `# Autonomous Cybersecurity Incident Response Team (Multi-Agent)

This repository details the configuration and scripts to stand up a fully autonomous, 10-role collaborative cybersecurity team powered by local Large Language Models (LLMs) via **Ollama** and orchestrated using the **Hermes Agent** framework.

## Team Architecture & LLM Mapping

Our multi-agent hierarchy leverages task-specific models to balance computational efficiency and logical depth:

| Agent Role | Responsibility Domain | Optimal Ollama LLM | Justification |
| :--- | :--- | :--- | :--- |
| **CISO** | Governance, Executive Reporting & Risk | \`llama3:70b\` | High strategic abstraction and risk correlation |
| **Security Manager** | Process Flow, SLA Tracking & Operations | \`llama3:8b\` | Reliable scheduling and operational alignment |
| **Security Analyst** | Threat Intelligence, CVE & Hash Lookups | \`mistral:7b\` | Outstanding text parsing and external API lookup formatting |
| **Security Engineer** | Defenses, Rule Deployment & Host Scripting | \`qwen2.5-coder:7b\` | State-of-the-art coding metrics for automation rules |
| **Incident Responder** | Forensics, Containment & Eradication | \`llama3:8b\` | Strict execution of tactical playbooks |
| **Security Architect** | Infrastructure Review & Threat Modeling | \`command-r:35b\` | Large context window for complex topology scans |
| **SOC Tier 1** | SIEM Log Parsing & Rapid Noise Filtration | \`phi3:3.8b\` | Ultra-lightweight for near-instant triage filtering |
| **SOC Tier 2** | Threat Hunting & Correlation Analysis | \`llama3:8b\` | Powerful KQL/Splunk query generation capabilities |
| **Network Security Eng**| Firewall Blocks, VLAN & VPC Quarantine | \`qwen2.5-coder:7b\` | High syntax precision for router ACL rules |
| **SOC Manager** | Alert Escalation Logs & Response SLAs | \`llama3:8b\` | Standard coordination and priority queues |

---

## Setup & Running the Multi-Agent Framework

### 1. Prerequisite: Install Ollama
Download and install [Ollama](https://ollama.com/) for your operating system.
Start the local server and pull the model weights required:
\`\`\`bash
ollama run phi3:3.8b
ollama run mistral:7b
ollama run qwen2.5-coder:7b
ollama run llama3:8b
# For CISO and Security Architect (if system specs allow):
ollama run command-r:35b
ollama run llama3:70b
\`\`\`

### 2. Install Hermes Agent Framework
Clone or install the framework dependencies (or package):
\`\`\`bash
pip install hermes-agent pydantic requests
\`\`\`

### 3. Execution Script
Deploy \`orchestrator.py\` (provided in this repository) to trigger multi-agent collaboration during a crisis simulation.
\`\`\`bash
python orchestrator.py --incident "Ransomware detection on AD-01"
\`\`\`
`,
    orchestrator: `import argparse
import json
import sys
from hermes_agent import Agent, OllamaClient, Tool

# Initialize Local LLMs
phi_client = OllamaClient(model="phi3:3.8b", host="http://localhost:11434")
llama_client = OllamaClient(model="llama3:8b", host="http://localhost:11434")
coder_client = OllamaClient(model="qwen2.5-coder:7b", host="http://localhost:11434")

# Defined Tools
def query_splunk(query_text):
    return f"Splunk Query Out: Found anomalous process execution on Server-AD-01."

def isolate_subnet(ip_range):
    return f"Router Action: Segmenting subnet {ip_range} from production gateway."

def deploy_yara_signature(rule_def):
    return f"EDR Action: Pushed Yara definition to 500 endpoint monitors."

# Agent Blueprint Configurations
soc_tier1 = Agent(
    name="SOC Tier 1 Analyst",
    client=phi_client,
    system_instruction="You are the front line monitor. Parse alarms instantly. Escalate true threats.",
    tools=[Tool(query_splunk)]
)

network_engineer = Agent(
    name="Network Security Engineer",
    client=coder_client,
    system_instruction="You manipulate firewalls and isolate subnets.",
    tools=[Tool(isolate_subnet)]
)

incident_responder = Agent(
    name="Incident Responder",
    client=llama_client,
    system_instruction="Tactical eradication specialist. Guide VM containment.",
    tools=[]
)

def run_incident_workflow(incident_description):
    print(f"[*] Dispatching Incident: {incident_description}\\n")
    
    # Phase 1: SOC T1 Alert Check
    print("[SOC T1] Scanning Splunk logs...")
    t1_output = soc_tier1.run("Investigate indicators for AD-01 anomaly")
    print(f"-> {t1_output}\\n")
    
    # Phase 2: Network Engineer Segregation
    print("[NetEng] Executing emergency perimeter defense...")
    net_output = network_engineer.run("Isolate subnet 10.100.4.0/24")
    print(f"-> {net_output}\\n")
    
    # Phase 3: Responder cleanup
    print("[IncidentResponder] Confirming containment...")
    resp_output = incident_responder.run("Review mitigation success. Draft state summary.")
    print(f"-> {resp_output}\\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Multi-Agent Incident Commander")
    parser.add_argument("--incident", type=str, required=True, help="Description of cyber incident")
    args = parser.parse_args()
    
    run_incident_workflow(args.incident)
`,
    dockerCompose: `version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: cyber_ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_storage:/root/.ollama
    restart: unless-stopped

  cyber_agents:
    build: .
    container_name: cyber_agents_runtime
    depends_on:
      - ollama
    environment:
      - OLLAMA_HOST=http://ollama:11434
    volumes:
      - .:/workspace
    command: python orchestrator.py --incident "Automatic pipeline triggers"

volumes:
  ollama_storage:
`
  };

  return (
    <div id="cyber-platform-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Platform Header */}
      <header id="header-bar" className="border-b border-slate-800 bg-slate-900 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <span>CYBER_COMMAND</span>
              <span className="text-xs text-cyan-400 font-normal px-2 py-0.5 rounded border border-cyan-800/50 bg-cyan-950/40">
                OLLAMA + HERMES AGENT
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Autonomous Multi-Agent Organization blueprint, interactive incident commander, and portfolio exporter.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto justify-between border-t border-slate-800/80 md:border-t-0 pt-3 md:pt-0">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-4">
            <div>
              <span className="text-slate-500">SYSTEM_SLA:</span> <span className="text-emerald-400 font-bold">99.9%</span>
            </div>
            <div>
              <span className="text-slate-500">ACTIVE_AGENTS:</span> <span className="text-cyan-400 font-bold">10 / 10</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-header */}
      <nav id="nav-tabs" className="bg-slate-900/40 border-b border-slate-800/50 px-6 py-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          id="tab-simulator"
          onClick={() => { setActiveTab("simulator"); setErrorMessage(null); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "simulator" 
              ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/60" 
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <Play className="w-4 h-4" />
          Incident Simulator
        </button>

        <button
          id="tab-agents"
          onClick={() => { setActiveTab("agents"); setErrorMessage(null); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "agents" 
              ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/60" 
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <Users className="w-4 h-4" />
          Agent Directory & Blueprints
        </button>

        <button
          id="tab-tutorial"
          onClick={() => { setActiveTab("tutorial"); setErrorMessage(null); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "tutorial" 
              ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/60" 
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Ollama + Hermes Tutorial
        </button>

        <button
          id="tab-portfolio"
          onClick={() => { setActiveTab("portfolio"); setErrorMessage(null); }}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === "portfolio" 
              ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/60" 
              : "text-slate-400 hover:text-white hover:bg-slate-800/50"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          GitHub Portfolio Exporter
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: SIMULATOR */}
        {activeTab === "simulator" && (
          <div id="panel-simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Simulation Controller & Outputs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Terminal className="text-cyan-400 w-5 h-5" />
                  <span>Multi-Agent Crisis Simulation Lab</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-3xl">
                  Choose a common organizational security threat pattern or supply custom telemetry description. When you initiate, 
                  our simulated orchestrator maps each of the 10 distinct agents to local Ollama LLMs and triggers an active SANS-compliant containment plan.
                </p>

                {/* Threat Selector Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  {incidentTemplates.map((inc) => (
                    <button
                      key={inc.type}
                      onClick={() => {
                        setSelectedIncidentType(inc.type);
                        setCustomDescription("");
                      }}
                      className={`p-4 rounded-lg text-left transition-all border ${
                        selectedIncidentType === inc.type
                          ? "bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950"
                          : "bg-slate-950 hover:bg-slate-800/40 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          inc.severity === "CRITICAL" ? "bg-red-950 text-red-400 border border-red-800/40" :
                          inc.severity === "HIGH" ? "bg-amber-950 text-amber-400 border border-amber-800/40" :
                          "bg-blue-950 text-blue-400 border border-blue-800/40"
                        }`}>
                          {inc.severity}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-white mt-2 font-mono line-clamp-1">
                        {inc.title.split(" & ")[0].split(" via ")[0]}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {inc.defaultDescription}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Dynamic Inputs */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Active Threat Intelligence Payload Detail
                    </label>
                    <textarea
                      value={customDescription || activeIncidentTemplate.defaultDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-slate-800/50">
                    <div className="text-xs text-slate-400 font-mono">
                      TARGET ASSETS: <span className="text-cyan-400">{activeIncidentTemplate.defaultAssets.join(", ")}</span>
                    </div>
                    <button
                      onClick={runSimulation}
                      disabled={simulating}
                      className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold font-mono text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      {simulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Orchestrating Local LLMs...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-slate-950" />
                          <span>Simulate Autonomous Response</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ERROR HANDLING */}
              {errorMessage && (
                <div className="bg-slate-900 border-l-4 border-amber-500 p-4 rounded-lg flex gap-3">
                  <AlertCircle className="text-amber-500 w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-sm">LLM Server Proxy Unavailable</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      This AI Studio playground runs inside an sandboxed Cloud environment. To run real server-side simulations, the platform requires you to supply a <code className="text-yellow-400 bg-slate-950 px-1 py-0.5 rounded">GEMINI_API_KEY</code> in the user secrets panel.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <button 
                        onClick={() => setErrorMessage(null)}
                        className="text-xs text-slate-400 hover:text-white underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION VISUAL TIMELINE */}
              {simulating && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="relative flex items-center justify-center mb-6">
                    <div className="w-16 h-16 rounded-full border border-cyan-500/20 animate-ping absolute" />
                    <div className="w-12 h-12 rounded-full border border-cyan-500/40 animate-pulse absolute" />
                    <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center">
                      <Terminal className="text-cyan-400 w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-md font-bold text-white font-mono animate-pulse">
                    CONSTRUCTING AUTONOMOUS COLLABORATION TRANSCRIPT...
                  </h3>
                  <p className="text-xs text-slate-400 text-center max-w-md mt-2">
                    Querying the orchestration engine. Setting model roles: llama3 for CISO, qwen2.5-coder for engineers, phi3 for SOC logs. Matching SANS containment protocols...
                  </p>
                  
                  {/* Visual loading bars representing the 4 stages */}
                  <div className="mt-8 grid grid-cols-4 gap-2 w-full max-w-lg font-mono text-[9px]">
                    <div className="space-y-1">
                      <div className="h-1.5 bg-cyan-500 rounded animate-pulse" />
                      <div className="text-cyan-400 text-center font-bold">DETECTION</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-800 rounded animate-pulse" />
                      <div className="text-slate-500 text-center">TRIAGE</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-800 rounded animate-pulse" />
                      <div className="text-slate-500 text-center">CONTAINMENT</div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-1.5 bg-slate-800 rounded animate-pulse" />
                      <div className="text-slate-500 text-center">GOVERNANCE</div>
                    </div>
                  </div>
                </div>
              )}

              {simulationResult && !simulating && (
                <div className="space-y-6 animate-fade-in">
                  {/* Header Board of Simulation Result */}
                  <div className="bg-slate-900 border border-cyan-900/40 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                          Active Incident War Room Report
                        </span>
                        <h3 className="text-xl font-bold text-white font-mono mt-1">
                          {simulationResult.title}
                        </h3>
                        <p className="text-slate-300 text-sm mt-2 max-w-4xl">
                          {simulationResult.summary}
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-center shrink-0 min-w-[150px]">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Severity Status</div>
                        <div className={`text-lg font-black mt-1 ${
                          simulationResult.overallSeverity === "CRITICAL" ? "text-red-500" :
                          simulationResult.overallSeverity === "HIGH" ? "text-amber-500" :
                          "text-cyan-400"
                        }`}>
                          {simulationResult.overallSeverity}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-2">10 AGENTS DISPATCHED</div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4 text-xs font-mono">
                      <span className="text-slate-500">Compromised Assets:</span>
                      {simulationResult.compromisedAssets.map((asset, idx) => (
                        <span key={idx} className="bg-slate-950 text-red-400 border border-red-950 px-2 py-0.5 rounded text-[11px]">
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Phased Execution Timeline */}
                  <div className="space-y-8">
                    {simulationResult.phases.map((phase) => (
                      <div key={phase.phaseNumber} className="relative border-l-2 border-cyan-800/40 pl-6 md:pl-8 ml-3 space-y-4">
                        {/* Timeline Node Point */}
                        <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono">
                          {phase.phaseNumber}
                        </div>

                        {/* Phase Meta */}
                        <div className="bg-slate-900/60 border border-slate-800/50 rounded-xl p-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                            <div>
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/50">
                                Phase {phase.phaseNumber} of 4
                              </span>
                              <h4 className="text-md font-bold text-white mt-1 font-mono">
                                {phase.phaseName}
                              </h4>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/60">
                              <div className="text-xs font-mono text-slate-400">
                                Network Impact:
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      phase.networkImpactScore > 75 ? "bg-red-500" :
                                      phase.networkImpactScore > 40 ? "bg-amber-500" :
                                      "bg-cyan-500"
                                    }`}
                                    style={{ width: `${phase.networkImpactScore}%` }}
                                  />
                                </div>
                                <span className="text-xs font-mono font-bold text-white">
                                  {phase.networkImpactScore}/100
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-400 font-mono bg-slate-950 border border-slate-900 px-3 py-2 rounded mb-6">
                            <span className="text-slate-500 font-semibold">[STATE]:</span> {phase.stateSummary}
                          </p>

                          {/* Dialogue Thread */}
                          <div className="space-y-4">
                            {phase.dialogs.map((dialog, dIdx) => (
                              <div key={dIdx} className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-4 relative overflow-hidden">
                                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                                      <RoleIcon name={cyberRoles.find(r => r.name.toLowerCase().includes(dialog.agentName.toLowerCase().replace("soc ", "")))?.iconName || "ShieldCheck"} className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold font-mono text-slate-200">
                                      {dialog.agentName}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                                    <span>Ollama: <code className="text-cyan-500 bg-slate-900 px-1 py-0.5 rounded">{dialog.modelUsed}</code></span>
                                    {dialog.toolUsed && (
                                      <span className="border-l border-slate-800 pl-2 text-amber-500">
                                        Tool Executed: <code className="bg-slate-900 px-1 py-0.5 rounded">{dialog.toolUsed}()</code>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                                  {dialog.message}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Phase Containment Measures */}
                          <div className="mt-5 border-t border-slate-800/60 pt-4 space-y-2">
                            <h5 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Active Defenses & Containment Logs</h5>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-emerald-400">
                              {phase.containmentMeasures.map((measure, mIdx) => (
                                <li key={mIdx} className="flex items-start gap-2 bg-emerald-950/20 border border-emerald-900/30 p-2 rounded">
                                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                  <span>{measure}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Post Mortem Insights */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h4 className="text-md font-bold text-white font-mono flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                      <span>Incident Post-Mortem & Strategic Lessons</span>
                    </h4>
                    <ul className="space-y-3">
                      {simulationResult.postMortemLessons.map((lesson, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed">
                          <span className="text-cyan-400 font-mono font-bold">{idx + 1}.</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: System Health Sidebar */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${simulating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shrink-0`} />
                  <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    SYSTEM_HEALTH
                  </h3>
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  OLLAMA v0.1.48
                </div>
              </div>

              {/* Host Status Widgets */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px] uppercase">Host VRAM Load</div>
                  <div className="text-white font-bold text-sm mt-0.5">
                    {simulating ? "88%" : "64%"}
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded mt-1 overflow-hidden">
                    <div className={`h-full ${simulating ? 'bg-amber-500 animate-pulse' : 'bg-cyan-500'}`} style={{ width: simulating ? '88%' : '64%' }} />
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px] uppercase">Core Temp</div>
                  <div className={`font-bold text-sm mt-0.5 ${simulating ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {simulating ? "74°C" : "48°C"}
                  </div>
                  <div className="text-[9px] text-slate-600 mt-1">GPU ACTIVE</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px] uppercase">Service State</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">CONNECTED</div>
                  <div className="text-[9px] text-slate-500 mt-1">127.0.0.1:11434</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                  <div className="text-slate-500 text-[9px] uppercase">SLA Breach Risk</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">NOMINAL</div>
                  <div className="text-[9px] text-slate-500 mt-1">MTTR &lt; 15m</div>
                </div>
              </div>

              {/* Diagnostics Actions */}
              <div className="space-y-2">
                <button
                  onClick={runDiagnostics}
                  disabled={diagRunning}
                  className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 text-xs text-slate-300 font-mono rounded border border-slate-800 flex items-center justify-center gap-2 transition-colors"
                >
                  {diagRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Scanning local models...</span>
                    </>
                  ) : (
                    <>
                      <Server className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Run Model Diagnostics</span>
                    </>
                  )}
                </button>

                {diagDone && !diagRunning && (
                  <div className="text-[11px] text-center text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 py-1 px-2 rounded font-mono">
                    ✓ 10/10 localized roles respond successfully (0 lost packets).
                  </div>
                )}
              </div>

              {/* Individual Model Status Lists */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  Model Load &amp; Parameters
                </div>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {cyberRoles.map((role) => {
                    let memoryVal = "4.8 GB";
                    let stateColor = "bg-emerald-500";
                    let stateText = "ONLINE";
                    let latencyText = "12ms";
                    
                    if (role.id === "ciso") { memoryVal = "41.2 GB"; latencyText = "48ms"; }
                    else if (role.id === "sec_architect") { memoryVal = "22.6 GB"; latencyText = "32ms"; }
                    else if (role.id === "sec_engineer") { memoryVal = "4.5 GB"; latencyText = "14ms"; }
                    else if (role.id === "net_engineer") { memoryVal = "4.4 GB"; latencyText = "15ms"; }
                    else if (role.id === "soc_t1") { memoryVal = "2.2 GB"; latencyText = "6ms"; }
                    else if (role.id === "sec_analyst") { memoryVal = "4.1 GB"; latencyText = "18ms"; }
                    
                    let isProcessing = false;
                    if (simulating) {
                      isProcessing = true;
                      stateColor = "bg-cyan-400 animate-pulse";
                      stateText = "ACTIVE LOAD";
                    }

                    return (
                      <div key={role.id} className="bg-slate-950 border border-slate-900 p-2.5 rounded space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`w-1.5 h-1.5 rounded-full ${stateColor} shrink-0`} />
                            <span className="text-xs font-bold text-slate-200 truncate font-mono">
                              {role.name.split(" (")[0]}
                            </span>
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/30 border border-cyan-900/40 px-1 py-0.5 rounded shrink-0">
                            {role.ollamaModel}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-1.5">
                          <div>
                            <span className="text-slate-600">VRAM:</span> <span className="text-slate-300">{memoryVal}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">PING:</span> <span className="text-slate-300">{isProcessing ? "Active" : latencyText}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-600">TEMP:</span> <span className="text-slate-300">{role.id === 'ciso' || role.id === 'sec_architect' ? '0.7' : '0.2'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AGENT DIRECTORY & BLUEPRINTS */}
        {activeTab === "agents" && (
          <div id="panel-agents" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Hand List */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                ORGANIZATIONAL ROLES (10)
              </h3>
              <div className="space-y-2">
                {cyberRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedAgentId(role.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between border ${
                      selectedAgentId === role.id
                        ? "bg-slate-900 border-cyan-500/80 shadow-md shadow-slate-950"
                        : "bg-slate-900/50 hover:bg-slate-900 border-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedAgentId === role.id ? "bg-cyan-950 text-cyan-400" : "bg-slate-950 text-slate-400"
                      }`}>
                        <RoleIcon name={role.iconName} className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-white font-mono">
                          {role.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {role.tag}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${
                      selectedAgentId === role.id ? "translate-x-1 text-cyan-400" : ""
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hand Blueprint Details */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 flex items-center justify-center">
                    <RoleIcon name={selectedAgent.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{selectedAgent.tag}</span>
                    <h3 className="text-lg font-bold text-white font-mono">{selectedAgent.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">COGNITIVE LOAD:</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    selectedAgent.cognitiveLoad === "High" ? "bg-red-950 text-red-400 border border-red-800/40" :
                    selectedAgent.cognitiveLoad === "Medium" ? "bg-amber-950 text-amber-400 border border-amber-800/40" :
                    "bg-blue-950 text-blue-400 border border-blue-800/40"
                  }`}>
                    {selectedAgent.cognitiveLoad}
                  </span>
                </div>
              </div>

              {/* Local Ollama Model Details */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-slate-400">RECOMMENDED OLLAMA MODEL:</span>
                  <code className="text-xs font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                    {selectedAgent.ollamaModel}
                  </code>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-mono">
                  {selectedAgent.modelJustification}
                </p>
              </div>

              {/* Responsibilities list */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Core Responsibilities</h4>
                <ul className="space-y-2">
                  {selectedAgent.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-500 font-mono mt-0.5 shrink-0">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Custom Hermes Tools */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Hermes Tool Bindings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedAgent.hermesTools.map((tool, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-900 rounded-lg p-3">
                      <div className="text-xs font-mono text-amber-400 font-bold">{tool.name}()</div>
                      <div className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-use Python Framework Blueprint */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Hermes Framework Python Template</h4>
                  <button
                    onClick={() => handleCopy(selectedAgent.frameworkTemplate, selectedAgent.id)}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedStates[selectedAgent.id] ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-72">
                  {selectedAgent.frameworkTemplate}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OLLAMA + HERMES TUTORIAL */}
        {activeTab === "tutorial" && (
          <div id="panel-tutorial" className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white font-mono">
                Deploying Autonomous Security Teams (Ollama + Hermes)
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                A complete, step-by-step tutorial to configure local language models, install dependencies, and orchestrate the multi-agent incident command loop.
              </p>
            </div>

            {/* Steps timeline */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="relative border-l-2 border-slate-800 pl-6 ml-3">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                  1
                </div>
                <div className="space-y-3">
                  <h3 className="text-md font-bold text-white font-mono flex items-center gap-2">
                    <span>Install & Start Ollama Local Service</span>
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Ollama is a lightweight framework for downloading and executing open-source foundation LLMs locally on your hardware. 
                    Unlike cloud APIs, running Ollama secures sensitive organization logs and PCAPs within your local parameters.
                  </p>
                  <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 font-mono">
                    <li>Download the client executable from <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Ollama.com</a>.</li>
                    <li>Initialize the daemon process:</li>
                  </ol>
                  <pre className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto">
                    {`# Starting server daemon on macOS/Linux
ollama serve

# Confirming Ollama service status
curl http://localhost:11434`}
                  </pre>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative border-l-2 border-slate-800 pl-6 ml-3">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                  2
                </div>
                <div className="space-y-3">
                  <h3 className="text-md font-bold text-white font-mono">
                    Download Specialized Models for Your Roles
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Rather than routing all operations to one expensive monolithic model, fetch targeted models tailored to each agent role:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-slate-300">
                    <li className="bg-slate-950 border border-slate-800/60 p-3 rounded-lg">
                      <div className="font-bold text-cyan-400">Frontline Parsing (<code className="bg-slate-900 px-1 rounded">phi3:3.8b</code>)</div>
                      <p className="text-[11px] text-slate-400 mt-1">Excellent speed-to-context ratios for quick triage logs.</p>
                      <code className="text-[10px] text-slate-500 block mt-2">ollama pull phi3:3.8b</code>
                    </li>
                    <li className="bg-slate-950 border border-slate-800/60 p-3 rounded-lg">
                      <div className="font-bold text-cyan-400">Code/Script Execution (<code className="bg-slate-900 px-1 rounded">qwen2.5-coder:7b</code>)</div>
                      <p className="text-[11px] text-slate-400 mt-1">Exceptional compliance for writing firewall rules and python patches.</p>
                      <code className="text-[10px] text-slate-500 block mt-2">ollama pull qwen2.5-coder:7b</code>
                    </li>
                    <li className="bg-slate-950 border border-slate-800/60 p-3 rounded-lg">
                      <div className="font-bold text-cyan-400">Incident Commands (<code className="bg-slate-900 px-1 rounded">llama3:8b</code>)</div>
                      <p className="text-[11px] text-slate-400 mt-1">A robust model for analytical reasoning and playbook adherence.</p>
                      <code className="text-[10px] text-slate-500 block mt-2">ollama pull llama3:8b</code>
                    </li>
                    <li className="bg-slate-950 border border-slate-800/60 p-3 rounded-lg">
                      <div className="font-bold text-cyan-400">Threat Intel Synthesis (<code className="bg-slate-900 px-1 rounded">mistral:7b</code>)</div>
                      <p className="text-[11px] text-slate-400 mt-1">Synthesizes feed formats, parsing JSON, and writing technical reports.</p>
                      <code className="text-[10px] text-slate-500 block mt-2">ollama pull mistral:7b</code>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative border-l-2 border-slate-800 pl-6 ml-3">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                  3
                </div>
                <div className="space-y-3">
                  <h3 className="text-md font-bold text-white font-mono">
                    Install & Configure Hermes Agent Framework
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Hermes Agent is a developer-centric python library that handles agent prompt orchestration, local loop history, 
                    and binding custom Python functions as tools for local LLMs.
                  </p>
                  <pre className="bg-slate-950 border border-slate-800 p-3 rounded-lg font-mono text-xs text-slate-300 overflow-x-auto">
                    {`# Installs standard library interfaces
pip install hermes-agent pydantic requests`}
                  </pre>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Hermes automatically detects model tools using basic Python type-hints, compiling them into clean JSON declarations before forwarding execution loops back to the local Ollama instance.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative border-l-2 border-slate-800 pl-6 ml-3">
                <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                  4
                </div>
                <div className="space-y-3">
                  <h3 className="text-md font-bold text-white font-mono">
                    Construct the Multi-Agent Orchestrator Loop
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    To enable multi-agent collaboration, initialize each role with custom system guidelines representing their 
                    position on the org chart, then route output tokens dynamically as sequential execution prompts.
                  </p>
                  <p className="text-xs text-slate-400">
                    See the <button onClick={() => setActiveTab("portfolio")} className="text-cyan-400 underline hover:text-cyan-300">GitHub Portfolio Exporter</button> to review the complete, deployable Python orchestration script code!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PORTFOLIO EXPORTER */}
        {activeTab === "portfolio" && (
          <div id="panel-portfolio" className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderOpen className="text-cyan-400 w-5 h-5" />
                <span>GitHub Portfolio Folder Compiler</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-4xl">
                Ready to demonstrate your expertise? Export these pre-built scripts, configuration plans, and orchestration systems directly into your personal engineering portfolio. 
                Below are ready-to-use directory definitions you can paste directly into your GitHub workspace.
              </p>
            </div>

            {/* Folder Structure Representation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Directory tree visualizer */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">PROJECT FILE TREE</h4>
                <div className="font-mono text-xs text-slate-300 space-y-2.5 bg-slate-950 p-4 rounded-lg border border-slate-900">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                    <span>autonomous-cyber-team/</span>
                  </div>
                  <div className="pl-6 flex items-center gap-2 text-emerald-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>README.md</span>
                  </div>
                  <div className="pl-6 flex items-center gap-2 text-cyan-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>orchestrator.py</span>
                  </div>
                  <div className="pl-6 flex items-center gap-2 text-amber-500">
                    <FileText className="w-3.5 h-3.5" />
                    <span>docker-compose.yml</span>
                  </div>
                  <div className="pl-6 flex items-center gap-2 text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dockerfile</span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed font-sans bg-slate-950/40 border border-slate-800/80 p-3 rounded">
                  <span className="font-bold text-slate-200 block mb-1">Portfolio Checklist:</span>
                  1. Paste the <span className="text-emerald-400">README.md</span> to explain roles.<br />
                  2. Use the <span className="text-cyan-400">orchestrator.py</span> script as core code.<br />
                  3. Bind the <span className="text-amber-500">docker-compose.yml</span> to demonstrate infrastructure orchestration.
                </div>
              </div>

              {/* Code viewer tabs */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-widest">Code Exporter Console</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(portfolioCodeFiles.readme, "readme")}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800/80 hover:bg-slate-900 text-xs font-mono text-slate-300 rounded flex items-center gap-2 transition-colors"
                    >
                      {copiedStates["readme"] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy README</span>
                    </button>
                    <button
                      onClick={() => handleCopy(portfolioCodeFiles.orchestrator, "orchestrator")}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800/80 hover:bg-slate-900 text-xs font-mono text-slate-300 rounded flex items-center gap-2 transition-colors"
                    >
                      {copiedStates["orchestrator"] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy orchestrator.py</span>
                    </button>
                    <button
                      onClick={() => handleCopy(portfolioCodeFiles.dockerCompose, "docker_compose")}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800/80 hover:bg-slate-900 text-xs font-mono text-slate-300 rounded flex items-center gap-2 transition-colors"
                    >
                      {copiedStates["docker_compose"] ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy docker-compose</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 block mb-1"># File: README.md</span>
                    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-56">
                      {portfolioCodeFiles.readme}
                    </pre>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-cyan-400 block mb-1"># File: orchestrator.py</span>
                    <pre className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-x-auto text-slate-300 max-h-56">
                      {portfolioCodeFiles.orchestrator}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-6 text-center text-xs font-mono text-slate-500">
        <div>AUTONOMOUS SECURITY COMMAND CORE — POWERED BY OLLAMA LOCAL LLMS & HERMES AGENT</div>
        <div className="mt-1">Designed for robust local enterprise data safety. No outbound network telemetry.</div>
      </footer>
    </div>
  );
}
