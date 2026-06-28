import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint for incident simulation
app.post("/api/simulate", async (req, res) => {
  try {
    const { incidentType, customDescription } = req.body;
    
    let client;
    try {
      client = getGeminiClient();
    } catch (err: any) {
      return res.status(400).json({
        error: "Missing API Key",
        message: "Please configure your GEMINI_API_KEY in the Secrets panel."
      });
    }

    const description = customDescription || `A security threat of type: ${incidentType}`;
    
    // Construct the schema for structured JSON response representing the multi-agent collaboration
    const prompt = `
      You are an expert Cybersecurity Coordinator. Generate a realistic, highly technical, step-by-step incident response and governance simulation transcript where 10 specialized autonomous AI agents (using Ollama local LLMs + Hermes Agent framework) collaborate to identify, triage, hunt, contain, and govern a cybersecurity incident.
      
      Incident details:
      Type: ${incidentType}
      Scenario: ${description}
      
      The 10 roles are:
      1. Chief Information Security Officer (CISO): High-level risk management, strategic decision-making, executive reports.
      2. Security Manager: Oversight, operations coordinator, SLA metric monitor.
      3. Security Analyst: Threat intelligence compiler, SIEM analyzer.
      4. Security Engineer: Endpoint, app, and system defender. Runs firewall and endpoint patches.
      5. Incident Responder: Direct hands-on containment, payload analysis, remediation leader.
      6. Security Architect: Architectural integrity advisor, long-term blueprints.
      7. SOC Tier 1 Security Analyst: High-speed initial triage, log scanner, escalates anomalies.
      8. SOC Tier 2 Analyst: Deep threat hunter, vulnerability scanner, validates escalations.
      9. Network Security Engineer: VPC/firewall configuration, network segmentation rules.
      10. SOC Manager: Alert escalation tracker, mean-time-to-contain metrics driver.

      For the scenario, generate 4 distinct chronological phases of the incident life cycle:
      Phase 1: Detection & Triage (Alerting, initial T1 triage, escalation by SOC Manager)
      Phase 2: Deep Dive Analysis (T2 threat hunting, Security Analyst intel, Network analysis, Incident Responder payload review)
      Phase 3: Containment & Eradication (Security Engineer block lists, Network segregation, Incident Responder server patching)
      Phase 4: Governance & Post-Mortem (CISO risk assessment, Security Architect blueprint corrections, Security Manager SLA metrics report)

      For each phase, generate:
      - A visual state summary (affected systems, current network impact score from 0-100, severity indicator)
      - 3 to 4 detailed dialog turns between specific agents. Each turn must represent their technical role, tool outputs (e.g. "Hermes Agent running tool 'query_splunk'"), and analytical conclusions. Make the dialogue realistic, professional, and full of domain-specific jargon (e.g., AD Kerberoasting, Mimikatz, EDR telemetry, PCAP file, CIDR blocks).
      - Containment measures proposed.
      
      Output the result in strict JSON format matching the schema below:
    `;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            overallSeverity: { type: Type.STRING, description: "CRITICAL, HIGH, MEDIUM, LOW" },
            compromisedAssets: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            phases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.INTEGER },
                  phaseName: { type: Type.STRING },
                  stateSummary: { type: Type.STRING },
                  networkImpactScore: { type: Type.INTEGER },
                  dialogs: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        agentName: { type: Type.STRING, description: "One of the 10 roles" },
                        modelUsed: { type: Type.STRING, description: "The recommended local Ollama model for this role, e.g. llama3, phi3, qwen2.5-coder" },
                        toolUsed: { type: Type.STRING, description: "Empty string or the specific Hermes tool executed, e.g., read_pcap, scan_port, update_firewall" },
                        message: { type: Type.STRING, description: "What the agent said or analyzed. Highly professional and technical." }
                      },
                      required: ["agentName", "modelUsed", "toolUsed", "message"]
                    }
                  },
                  containmentMeasures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["phaseNumber", "phaseName", "stateSummary", "networkImpactScore", "dialogs", "containmentMeasures"]
              }
            },
            postMortemLessons: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["title", "summary", "overallSeverity", "compromisedAssets", "phases", "postMortemLessons"]
        }
      }
    });

    const simulationData = JSON.parse(response.text || "{}");
    res.json(simulationData);
  } catch (error: any) {
    console.error("Error running simulation:", error);
    res.status(500).json({
      error: "Simulation Failed",
      message: error.message || "An unexpected error occurred during the simulation."
    });
  }
});

// Serve static build or Vite dev server
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

initializeServer();
