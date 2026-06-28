import { AgentRole, IncidentOption } from "./types";

export const cyberRoles: AgentRole[] = [
  {
    id: "ciso",
    name: "Chief Information Security Officer (CISO)",
    tag: "Strategy & Governance",
    iconName: "ShieldCheck",
    ollamaModel: "llama3:70b",
    cognitiveLoad: "High",
    modelJustification: "Requires deep strategic thinking, risk-compliance assessment capabilities, and highly structured executive report drafting. A larger parameter model like llama3:70b or command-r+ ensures rigorous decision boundaries.",
    responsibilities: [
      "Sets the organization-wide cybersecurity strategy and compliance framework.",
      "Leads business-impact risk assessments and aligns security controls with operational goals.",
      "Ensures regulatory compliance requirements (SOC2, GDPR, HIPAA, ISO27001) are satisfied.",
      "Authorizes high-impact incident actions (such as complete network isolation or reporting to authorities)."
    ],
    hermesTools: [
      { name: "assess_business_risk", description: "Evaluates financial and business loss for compromised systems based on asset valuations." },
      { name: "generate_executive_brief", description: "Drafts a polished regulatory and board-ready summary of an active security crisis." }
    ],
    frameworkTemplate: `# CISO Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="llama3:70b", host="http://localhost:11434")

# Tool for evaluating enterprise threat exposure
def assess_business_risk(affected_assets):
    critical_assets = ["Active Directory", "Customer Database", "Billing Gateway"]
    exposure = [asset for asset in affected_assets if asset in critical_assets]
    severity = "CRITICAL" if len(exposure) > 0 else "MEDIUM"
    return f"Governance Alert: Affected critical assets: {exposure}. Business impact rating: {severity}."

ciso = Agent(
    name="CISO Agent",
    client=ollama,
    system_instruction="""You are the Chief Information Security Officer (CISO).
Your focus is risk compliance, business continuity, regulatory guidelines, and strategic executive sign-offs.
Do not dive into command line syntax; assess the aggregate risk, metrics (MTTD/MTTR), and regulatory exposure.""",
    tools=[Tool(assess_business_risk)]
)
`
  },
  {
    id: "sec_manager",
    name: "Security Manager",
    tag: "Operations & Enforcer",
    iconName: "Users",
    ollamaModel: "llama3:8b",
    cognitiveLoad: "Medium",
    modelJustification: "Oversees daily execution and processes. A versatile 8B parameter model is optimal for balancing performance and local resource usage when parsing schedules and policy enforcement commands.",
    responsibilities: [
      "Manages cybersecurity operations personnel and daily operations queues.",
      "Tracks critical operation metrics, primarily Mean Time to Detect (MTTD) and Mean Time to Respond (MTTR).",
      "Enforces security policies, conducts drills, and audits human elements to reduce errors.",
      "Coordinates cross-departmental communications during active cyber incidents."
    ],
    hermesTools: [
      { name: "get_incident_metrics", description: "Queries Splunk/Jira for active MTTR/MTTD values of the current month." },
      { name: "audit_policy_compliance", description: "Compares current incident containment steps against standard ISO-27001 playbooks." }
    ],
    frameworkTemplate: `# Security Manager Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="llama3:8b", host="http://localhost:11434")

def audit_policy_compliance(containment_steps):
    if "network_segregation" in containment_steps:
        return "Compliance Status: COMPLIANT with Ransomware Playbook Sec-4.2."
    return "Compliance Status: NON-COMPLIANT. Missing active network segregation rule."

security_manager = Agent(
    name="Security Manager Agent",
    client=ollama,
    system_instruction="""You are the Security Operations Manager.
You manage team members, enforce security processes, and measure success metrics like MTTR and compliance.
Your goal is operational alignment, clear escalation lanes, and minimizing human process error.""",
    tools=[Tool(audit_policy_compliance)]
)
`
  },
  {
    id: "sec_analyst",
    name: "Security Analyst",
    tag: "Threat Intelligence",
    iconName: "Eye",
    ollamaModel: "mistral:7b",
    cognitiveLoad: "Medium",
    modelJustification: "Mistral 7B excels at synthesizing external data feeds, indexing indicator lists (IoCs), and compiling fast threat summaries without heavy hardware overhead.",
    responsibilities: [
      "Performs systematic vulnerability assessments on development and cloud infrastructure.",
      "Monitors external threat intelligence streams for emerging zero-days and active campaigns.",
      "Correlates external threat indicator metrics (hashes, bad IPs) with internal network flow logs.",
      "Drafts proactive hardening reports based on newly disclosed exploit patterns."
    ],
    hermesTools: [
      { name: "query_threat_feeds", description: "Searches AlienVault OTX or MISP for active reputation of an IP address, domain, or file hash." },
      { name: "lookup_cve_database", description: "Queries NIST NVD database for vulnerability details, CVSS scores, and mitigation advice." }
    ],
    frameworkTemplate: `# Security Analyst Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool
import requests

ollama = OllamaClient(model="mistral:7b", host="http://localhost:11434")

def lookup_cve_database(cve_id):
    # Actual lookup or proxy simulated call
    return f"CVE details for {cve_id}: CVSS 9.8. Affects Apache Log4j. Exploit vector: Network. RCE possible."

analyst = Agent(
    name="Security Analyst Agent",
    client=ollama,
    system_instruction="""You are the Security Analyst.
Your role is to collect threat intelligence, monitor external feeds, lookup CVE records, and supply threat indicators.""",
    tools=[Tool(lookup_cve_database)]
)
`
  },
  {
    id: "sec_engineer",
    name: "Security Engineer",
    tag: "Defensive Builder",
    iconName: "Cpu",
    ollamaModel: "qwen2.5-coder:7b",
    cognitiveLoad: "High",
    modelJustification: "Since the Security Engineer crafts actual rules, firewall scripts, and endpoint remediation scripts, Qwen2.5-Coder or CodeLlama is the ideal match for precise technical code execution and syntax.",
    responsibilities: [
      "Designs, builds, and maintains security architectures and systems (IDS, IPS, EDR).",
      "Deploys host endpoint security agents and custom application defense filters.",
      "Configures secure system baselines, managing automated compliance checking tools.",
      "Maintains the secure pipeline of software deployment (SCA/SAST scanning integration)."
    ],
    hermesTools: [
      { name: "deploy_edr_rule", description: "Pushes an endpoint block YARA rule to all corporate workstations and servers." },
      { name: "configure_host_firewall", description: "Generates and deploys custom iptables or Windows Firewall rules to block lateral movement." }
    ],
    frameworkTemplate: `# Security Engineer Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="qwen2.5-coder:7b", host="http://localhost:11434")

def deploy_edr_rule(yara_rule_text):
    # Push rule to EDR backend (e.g. CrowdStrike/Wazuh)
    return f"EDR Deployment SUCCESS: Yara rule compiled and pushed to 2,450 endpoints globally."

engineer = Agent(
    name="Security Engineer Agent",
    client=ollama,
    system_instruction="""You are the Security Engineer.
You write firewall scripts, deploy endpoint agents, build EDR definitions, and configure platform boundaries.
Always provide precise syntax, configuration schemas, or structural scripts when executing actions.""",
    tools=[Tool(deploy_edr_rule)]
)
`
  },
  {
    id: "incident_responder",
    name: "Incident Responder",
    tag: "Incident Commander",
    iconName: "AlertTriangle",
    ollamaModel: "llama3:8b",
    cognitiveLoad: "High",
    modelJustification: "Requires reliable, highly directed procedural generation. Llama3-8B is robust at strictly adhering to critical incident response playbooks (SANS/NIST framework) under stress.",
    responsibilities: [
      "Executes the formal incident response plan (NIST SP 800-61) immediately upon confirmation.",
      "Conducts live host memory forensics, logs inspection, and extracts active malicious payloads.",
      "Performs rapid isolation of infected cloud machines or on-prem resources to block encryption/exfiltration.",
      "Coordinates post-remediation system rebuilds and guides clean restoration from verified offline backups."
    ],
    hermesTools: [
      { name: "isolate_server_node", description: "Terminates network interfaces of a specific target host VM in AWS/GCP to contain ransomware." },
      { name: "dump_memory_forensics", description: "Extracts volatile memory dump from a compromised target host for active process forensics." }
    ],
    frameworkTemplate: `# Incident Responder Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="llama3:8b", host="http://localhost:11434")

def isolate_server_node(vm_id):
    # Calls cloud provider API to remove security group rules and detach NICs
    return f"Isolation Action COMPLETE: VM instance '{vm_id}' has been isolated. Active VPC rules revoked."

responder = Agent(
    name="Incident Responder Agent",
    client=ollama,
    system_instruction="""You are the Lead Incident Responder.
You command the active crisis containment. You analyze raw malicious processes, isolate host VMs, run forensics,
and execute the NIST containment, eradication, and recovery cycles. You are fast, actions-oriented, and structured.""",
    tools=[Tool(isolate_server_node)]
)
`
  },
  {
    id: "sec_architect",
    name: "Security Architect",
    tag: "Blueprint Designer",
    iconName: "HardDrive",
    ollamaModel: "command-r:35b",
    cognitiveLoad: "High",
    modelJustification: "Command-R has an outstanding context window and is specifically fine-tuned for high-level architectural planning, structuring multi-tier network topologies, and system audits.",
    responsibilities: [
      "Designs the enterprise-wide long-term secure structural architectures (Zero Trust Network Access, IAM).",
      "Validates target systems against structural vulnerabilities and secure posture rules.",
      "Reviews cloud infrastructure blueprints (Terraform, CloudFormation) for misconfigurations.",
      "Ensures modern architectural defenses protect application workloads, API backbones, and enterprise endpoints."
    ],
    hermesTools: [
      { name: "verify_network_topology", description: "Scans Terraform configuration for insecure public subnets or open database ports." },
      { name: "recommend_iam_hierarchy", description: "Generates Principle of Least Privilege role mapping based on active cloud roles." }
    ],
    frameworkTemplate: `# Security Architect Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="command-r:35b", host="http://localhost:11434")

def verify_network_topology(terraform_json):
    # Parse terraform definitions for open ingress
    return "Architectural Audit: Found ingress '0.0.0.0/0' on PostgreSQL security group. SEVERITY: Critical. Recommended Fix: Restrict to VPC CIDR."

architect = Agent(
    name="Security Architect Agent",
    client=ollama,
    system_instruction="""You are the Security Architect.
You design long-term blueprints, validate cloud network maps, enforce Least Privilege access templates,
and audit system-level security postures. You deliver structured structural recommendations.""",
    tools=[Tool(verify_network_topology)]
)
`
  },
  {
    id: "soc_t1",
    name: "SOC Tier 1 Analyst",
    tag: "Frontline Alert Sifter",
    iconName: "Search",
    ollamaModel: "phi3:3.8b",
    cognitiveLoad: "Low",
    modelJustification: "A highly compact, ultra-fast model like Phi3 or TinyDolphin is optimal for frontline duty, sorting through thousands of SIEM alarms in milliseconds, filtering noise, and escalating true alerts.",
    responsibilities: [
      "Monitors the SIEM dashboard (Splunk, Sentinel) 24/7/365 for active threat warnings.",
      "Performs initial triage and log investigations on suspicious activity notifications.",
      "Filters out benign network noise and documented developer actions (false positives).",
      "Escalates verified security anomalies to Tier 2 SOC specialists with compiled incident context."
    ],
    hermesTools: [
      { name: "filter_alerts_stream", description: "Pulls the last 100 SIEM alerts and flags those exceeding severity threshold 7.0." },
      { name: "get_user_activity_log", description: "Queries Active Directory logs for specific user logon locations over the past 24 hours." }
    ],
    frameworkTemplate: `# SOC Tier 1 Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="phi3:3.8b", host="http://localhost:11434")

def get_user_activity_log(username):
    # Fetches recent logon records
    return f"AD Logs for {username}: 02:14 UTC - London (Success); 02:18 UTC - Moscow (Success). Flagging: Impossible Travel detected."

soc_t1 = Agent(
    name="SOC Tier 1 Analyst",
    client=ollama,
    system_instruction="""You are the frontline SOC Tier 1 Analyst.
Your job is rapid alert intake, basic user log checkups, impossible travel checks, and noise filtration.
When you spot a true anomaly, gather context and escalate to Tier 2 immediately.""",
    tools=[Tool(get_user_activity_log)]
)
`
  },
  {
    id: "soc_t2",
    name: "SOC Tier 2 Analyst",
    tag: "Threat Hunter & Validator",
    iconName: "Crosshair",
    ollamaModel: "llama3:8b",
    cognitiveLoad: "Medium",
    modelJustification: "Llama3-8B offers the right balance of complex correlation logic and threat-hunting depth to validate escalated alerts and write advanced query files.",
    responsibilities: [
      "Conducts deep, proactive threat hunting across endpoints, servers, and cloud resources.",
      "Validates alerts escalated by SOC Tier 1, correlating logs across Firewalls, AD, and EDR.",
      "Performs static and dynamic file analysis on suspicious emails and host downloads.",
      "Identifies lateral movement patterns within the enterprise LAN or cloud subnets."
    ],
    hermesTools: [
      { name: "run_threat_hunt_query", description: "Executes complex KQL or Splunk search queries to track processes spawning cmd.exe from Web Servers." },
      { name: "analyze_file_hash", description: "Simulates sandbox execution or checks VirusTotal to determine if a SHA-256 hash has malware flags." }
    ],
    frameworkTemplate: `# SOC Tier 2 Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="llama3:8b", host="http://localhost:11434")

def run_threat_hunt_query(pattern):
    # Simulates advanced Kusto Query Language execution on endpoint telemetry
    return f"KQL Search Result for '{pattern}': Spawning of powershell.exe with base64 encoded args detected on IIS-Server-09. Parent: w3wp.exe."

soc_t2 = Agent(
    name="SOC Tier 2 Analyst",
    client=ollama,
    system_instruction="""You are the SOC Tier 2 Deep Threat Hunter.
You validate escalated alerts, run advanced KQL queries, map attack steps to the MITRE ATT&CK framework,
and identify lateral movement trails inside internal servers. You pass verified intrusion paths to the Incident Responder.""",
    tools=[Tool(run_threat_hunt_query)]
)
`
  },
  {
    id: "net_engineer",
    name: "Network Security Engineer",
    tag: "Boundary Guard",
    iconName: "Server",
    ollamaModel: "qwen2.5-coder:7b",
    cognitiveLoad: "Medium",
    modelJustification: "Highly skilled in networking protocols, VPN tunnels, and subnets. Qwen2.5-Coder is preferred for compiling complex ACL and CIDR segmentation configurations.",
    responsibilities: [
      "Designs secure enterprise and cloud network perimeters using firewalls, VPCs, and DMZs.",
      "Maintains VPN tunnels, access control lists (ACLs), and load balancer routing rules.",
      "Configures and monitors Intrusion Prevention Systems (IPS) and DNS security services.",
      "Executes rapid network segmentation rules during an active incident to block lateral threat propagation."
    ],
    hermesTools: [
      { name: "isolate_network_segment", description: "Updates routing tables to quarantine a subnet, preventing data routing to outer networks." },
      { name: "block_malicious_ip", description: "Injects an explicit egress/ingress DENY rule for a target IP address in the core perimeter gateway." }
    ],
    frameworkTemplate: `# Network Security Engineer Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="qwen2.5-coder:7b", host="http://localhost:11434")

def block_malicious_ip(ip_address):
    # Interfaces with Fortinet/Cisco or AWS Security Groups API
    return f"Network Rule Injected: Deny source IP {ip_address} added to core router ACLs. All inbound traffic dropped."

net_engineer = Agent(
    name="Network Security Engineer",
    client=ollama,
    system_instruction="""You are the Network Security Engineer.
You control routers, switches, cloud security groups, load balancers, and network segmentation rules.
Your main tool is perimeter blocks, gateway isolation, and VPC routing table segmentation.""",
    tools=[Tool(block_malicious_ip)]
)
`
  },
  {
    id: "soc_manager",
    name: "SOC Manager",
    tag: "Operations Leader",
    iconName: "FolderOpen",
    ollamaModel: "llama3:8b",
    cognitiveLoad: "Medium",
    modelJustification: "Llama3-8B is excellent for prioritizing action item queues, reviewing team escalations, and maintaining SLA boundaries.",
    responsibilities: [
      "Oversees the SOC operations center, staffing schedules, and queue distributions.",
      "Reviews escalated critical cases to ensure containment SLA metrics are not breached.",
      "Acts as the liaison between the technical SOC operations team and business managers.",
      "Drives continuous improvements in detection logic, SIEM configurations, and incident playbooks."
    ],
    hermesTools: [
      { name: "check_sla_status", description: "Checks if the current critical incident has exceeded the 15-minute containment SLA threshold." },
      { name: "assign_incident_owner", description: "Assigns the active incident case to the optimal Incident Responder and tracks owner status." }
    ],
    frameworkTemplate: `# SOC Manager Hermes Agent Blueprint
from hermes_agent import Agent, OllamaClient, Tool

ollama = OllamaClient(model="llama3:8b", host="http://localhost:11434")

def check_sla_status(incident_start_time):
    # Computes duration against SLA boundaries
    return "SLA Assessment: 12 minutes elapsed since detection. 3 minutes remaining to isolate target system under corporate SLA."

soc_manager = Agent(
    name="SOC Manager",
    client=ollama,
    system_instruction="""You are the SOC Manager.
You run the hub of security operations. You manage the queue, review escalations, track SLA boundaries,
and keep metrics aligned with operational standards. You delegate tasks to analysts and engineers.""",
    tools=[Tool(check_sla_status)]
)
`
  }
];

export const incidentTemplates: IncidentOption[] = [
  {
    type: "ransomware",
    title: "Ryuk Ransomware spreading via Active Directory",
    defaultDescription: "A domain controller alert indicates a suspicious PsExec script pushing file-encrypting binaries named 'Ryuk' to all production HR and financial databases. Files are gaining .RYK extensions rapidly.",
    severity: "CRITICAL",
    defaultAssets: ["Domain Controller (AD-01)", "Financial DB (FIN-SQL-02)", "HR File Server (HR-FS-01)"]
  },
  {
    type: "phishing",
    title: "Executive Spear-Phishing & Token Theft Campaign",
    defaultDescription: "The Chief Financial Officer clicked a malicious link mimicking an internal HR payroll update. This led to a reverse-proxy phishing page that bypassed MFA, stealing active session cookies. Access is logged from anomalous international IP ranges.",
    severity: "HIGH",
    defaultAssets: ["CFO O365 Account", "Corporate Finance SharePoint", "Corporate Active Directory Domain"]
  },
  {
    type: "ddos",
    title: "High-Volume Layer 7 DDoS on Gateway API",
    defaultDescription: "A coordinated botnet is flooding the main gateway endpoint with 500,000 HTTP POST requests per second with randomized user-agents, bypassing standard Cloudflare rate limits. Core services are failing with HTTP 504 Gateway Timeouts.",
    severity: "HIGH",
    defaultAssets: ["Main API Gateway", "E-Commerce Frontend Layer", "Authentication Microservice"]
  },
  {
    type: "kerberoasting",
    title: "AD Kerberoasting & Lateral Domain Escalate",
    defaultDescription: "A compromised service account (svc-backup) was detected requesting high volumes of service ticket hashes (TGS). Offline hash cracking attempts are anticipated to compromise Domain Admin credentials, following suspicious remote desktop sessions.",
    severity: "MEDIUM",
    defaultAssets: ["Backup Server (BK-01)", "AD Domain Controller", "Enterprise Directory database"]
  }
];
