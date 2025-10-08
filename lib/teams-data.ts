import type { Team } from "./types"

const teamNames = [
  "IT Support",
  "Change Management Team",
  "Incident Manager",
  "Service Request Manager",
  "Problem Manager",
  "Network Operations",
  "Database Administration",
  "Security Operations",
  "Application Support",
  "Infrastructure Team",
  "DevOps Team",
  "Quality Assurance",
  "Release Management",
  "Capacity Planning",
  "Performance Monitoring",
  "Backup and Recovery",
  "Disaster Recovery",
  "Cloud Operations",
  "Platform Engineering",
  "Site Reliability",
]

const teamCodes = [
  "ADM",
  "CMG",
  "IMG",
  "SQM",
  "PBM",
  "NET",
  "DBA",
  "SEC",
  "APP",
  "INF",
  "DEV",
  "QAS",
  "RLM",
  "CAP",
  "PER",
  "BAK",
  "DIS",
  "CLD",
  "PLT",
  "SRE",
]

const descriptions = [
  "Manages system settings, user roles, and platform configurations",
  "Oversees and approves IT changes, ensuring minimal disruption",
  "Responsible for managing and resolving incidents promptly",
  "Oversees and manages service requests, ensuring timely delivery",
  "Identifies and analyzes recurring incidents to determine root causes",
  "Monitors and maintains network infrastructure and connectivity",
  "Manages database systems, performance tuning, and data integrity",
  "Ensures security compliance and monitors for threats",
  "Provides support for business applications and user issues",
  "Maintains and optimizes IT infrastructure components",
  "Implements CI/CD pipelines and automation workflows",
  "Conducts testing and ensures software quality standards",
  "Coordinates software releases and deployment schedules",
  "Plans and monitors system capacity and resource utilization",
  "Tracks system performance metrics and optimization",
  "Manages backup procedures and data protection strategies",
  "Develops and tests disaster recovery procedures",
  "Manages cloud infrastructure and services",
  "Builds and maintains platform services and tools",
  "Ensures system reliability and uptime targets",
]

const entities = [
  "Access Bank Nigeria",
  "Access Bank Ghana",
  "Access Bank Angola",
  "Access Bank Zambia",
  "Access Bank South Africa",
  "Access Bank Kenya",
  "Access Bank Rwanda",
  "Access Bank DRC",
]

const managers = [
  { name: "Joshua Giadr", initials: "JG" },
  { name: "Sarah Johnson", initials: "SJ" },
  { name: "Michael Chen", initials: "MC" },
  { name: "Amara Okafor", initials: "AO" },
  { name: "David Williams", initials: "DW" },
  { name: "Fatima Hassan", initials: "FH" },
  { name: "James Anderson", initials: "JA" },
  { name: "Chioma Nwosu", initials: "CN" },
  { name: "Robert Taylor", initials: "RT" },
  { name: "Aisha Mohammed", initials: "AM" },
  { name: "Daniel Brown", initials: "DB" },
  { name: "Grace Adeyemi", initials: "GA" },
  { name: "Thomas Wilson", initials: "TW" },
  { name: "Blessing Okoro", initials: "BO" },
  { name: "Christopher Lee", initials: "CL" },
]

function generateEmail(teamName: string, entity: string): string {
  const prefix = teamName.toLowerCase().replace(/\s+/g, "").substring(0, 6)
  const domain = entity.toLowerCase().replace(/\s+/g, "")
  return `${prefix}@${domain}.com`
}

export function generateTeams(count = 500): Team[] {
  const teams: Team[] = []

  for (let i = 0; i < count; i++) {
    const teamIndex = i % teamNames.length
    const entityIndex = i % entities.length
    const managerIndex = i % managers.length
    const descIndex = i % descriptions.length

    const baseName = teamNames[teamIndex]
    const entity = entities[entityIndex]
    const teamName = count > 20 ? `${baseName} ${Math.floor(i / teamNames.length) + 1}` : baseName

    teams.push({
      id: `team-${i + 1}`,
      name: teamName,
      code: `${teamCodes[teamIndex]}${Math.floor(i / teamCodes.length) > 0 ? Math.floor(i / teamCodes.length) : ""}`,
      description: descriptions[descIndex],
      email: generateEmail(teamName, entity),
      entity: entity,
      manager: managers[managerIndex],
    })
  }

  return teams
}
