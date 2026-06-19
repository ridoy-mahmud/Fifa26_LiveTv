// FIFA World Cup 2026 — Real Schedule Data
// 48 teams, 12 groups (A–L). Co-hosts: USA, Canada, Mexico.
// All kickoff times in UTC. Source: Al Jazeera / FIFA official schedule.

export interface Team {
  code: string;
  name: string;
  group: string;
}

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow" | "red" | "sub";
  player: string;
  side: "home" | "away";
}

export interface Match {
  id: string;
  matchNumber: number;
  stage: "Group" | "R32" | "R16" | "QF" | "SF" | "3rd" | "Final";
  group?: string;
  homeCode: string;
  awayCode: string;
  venue: string;
  city: string;
  kickoff: string; // ISO UTC
  status: "scheduled" | "live" | "ht" | "ft";
  minute?: number;
  homeScore: number;
  awayScore: number;
  events?: MatchEvent[];
}

// Real World Cup 2026 groups (announced by FIFA)
export const TEAMS: Team[] = [
  // Group A
  { code: "MEX", name: "Mexico", group: "A" },
  { code: "ZAF", name: "South Africa", group: "A" },
  { code: "KOR", name: "South Korea", group: "A" },
  { code: "CZE", name: "Czechia", group: "A" },
  // Group B
  { code: "CAN", name: "Canada", group: "B" },
  { code: "BIH", name: "Bosnia-Herzegovina", group: "B" },
  { code: "QAT", name: "Qatar", group: "B" },
  { code: "SUI", name: "Switzerland", group: "B" },
  // Group C
  { code: "BRA", name: "Brazil", group: "C" },
  { code: "MAR", name: "Morocco", group: "C" },
  { code: "HAI", name: "Haiti", group: "C" },
  { code: "SCO", name: "Scotland", group: "C" },
  // Group D
  { code: "USA", name: "United States", group: "D" },
  { code: "PAR", name: "Paraguay", group: "D" },
  { code: "AUS", name: "Australia", group: "D" },
  { code: "TUR", name: "Türkiye", group: "D" },
  // Group E
  { code: "GER", name: "Germany", group: "E" },
  { code: "CUW", name: "Curaçao", group: "E" },
  { code: "CIV", name: "Ivory Coast", group: "E" },
  { code: "ECU", name: "Ecuador", group: "E" },
  // Group F
  { code: "NED", name: "Netherlands", group: "F" },
  { code: "JPN", name: "Japan", group: "F" },
  { code: "SWE", name: "Sweden", group: "F" },
  { code: "TUN", name: "Tunisia", group: "F" },
  // Group G
  { code: "BEL", name: "Belgium", group: "G" },
  { code: "EGY", name: "Egypt", group: "G" },
  { code: "IRN", name: "Iran", group: "G" },
  { code: "NZL", name: "New Zealand", group: "G" },
  // Group H
  { code: "ESP", name: "Spain", group: "H" },
  { code: "CPV", name: "Cape Verde", group: "H" },
  { code: "KSA", name: "Saudi Arabia", group: "H" },
  { code: "URU", name: "Uruguay", group: "H" },
  // Group I
  { code: "FRA", name: "France", group: "I" },
  { code: "SEN", name: "Senegal", group: "I" },
  { code: "IRQ", name: "Iraq", group: "I" },
  { code: "NOR", name: "Norway", group: "I" },
  // Group J
  { code: "ARG", name: "Argentina", group: "J" },
  { code: "ALG", name: "Algeria", group: "J" },
  { code: "AUT", name: "Austria", group: "J" },
  { code: "JOR", name: "Jordan", group: "J" },
  // Group K
  { code: "POR", name: "Portugal", group: "K" },
  { code: "COD", name: "DR Congo", group: "K" },
  { code: "UZB", name: "Uzbekistan", group: "K" },
  { code: "COL", name: "Colombia", group: "K" },
  // Group L
  { code: "ENG", name: "England", group: "L" },
  { code: "CRO", name: "Croatia", group: "L" },
  { code: "GHA", name: "Ghana", group: "L" },
  { code: "PAN", name: "Panama", group: "L" },
];

export function getTeam(code: string, source: Team[] = TEAMS): Team {
  return source.find((t) => t.code === code) ?? { code, name: code, group: "?" };
}

export function flagUrl(code: string): string {
  const map: Record<string, string> = {
    MEX: "mx", ZAF: "za", KOR: "kr", CZE: "cz",
    CAN: "ca", BIH: "ba", QAT: "qa", SUI: "ch",
    BRA: "br", MAR: "ma", HAI: "ht", SCO: "gb-sct",
    USA: "us", PAR: "py", AUS: "au", TUR: "tr",
    GER: "de", CUW: "cw", CIV: "ci", ECU: "ec",
    NED: "nl", JPN: "jp", SWE: "se", TUN: "tn",
    BEL: "be", EGY: "eg", IRN: "ir", NZL: "nz",
    ESP: "es", CPV: "cv", KSA: "sa", URU: "uy",
    FRA: "fr", SEN: "sn", IRQ: "iq", NOR: "no",
    ARG: "ar", ALG: "dz", AUT: "at", JOR: "jo",
    POR: "pt", COD: "cd", UZB: "uz", COL: "co",
    ENG: "gb-eng", CRO: "hr", GHA: "gh", PAN: "pa",
  };
  const iso = map[code] ?? code.toLowerCase().slice(0, 2);
  return `https://flagcdn.com/w160/${iso}.png`;
}

// Complete FIFA World Cup 2026 schedule — all 104 matches
// Group stage: June 11–27 | R32: June 28–July 3 | R16: July 4–7 | QF: July 9–11 | SF: July 14–15 | 3rd: July 18 | Final: July 19
export const MATCHES: Match[] = [
  // ===== GROUP STAGE =====
  // Thursday June 11
  { id: "m1", matchNumber: 1, stage: "Group", group: "A", homeCode: "MEX", awayCode: "ZAF", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-06-11T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m2", matchNumber: 2, stage: "Group", group: "A", homeCode: "KOR", awayCode: "CZE", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-12T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Friday June 12
  { id: "m3", matchNumber: 3, stage: "Group", group: "B", homeCode: "CAN", awayCode: "BIH", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-12T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m4", matchNumber: 4, stage: "Group", group: "D", homeCode: "USA", awayCode: "PAR", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-13T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Saturday June 13
  { id: "m5", matchNumber: 5, stage: "Group", group: "B", homeCode: "QAT", awayCode: "SUI", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-13T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m6", matchNumber: 6, stage: "Group", group: "C", homeCode: "BRA", awayCode: "MAR", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-13T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m7", matchNumber: 7, stage: "Group", group: "C", homeCode: "HAI", awayCode: "SCO", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-14T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m8", matchNumber: 8, stage: "Group", group: "D", homeCode: "AUS", awayCode: "TUR", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-14T04:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Sunday June 14
  { id: "m9", matchNumber: 9, stage: "Group", group: "E", homeCode: "GER", awayCode: "CUW", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-14T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m10", matchNumber: 10, stage: "Group", group: "F", homeCode: "NED", awayCode: "JPN", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-14T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m11", matchNumber: 11, stage: "Group", group: "E", homeCode: "CIV", awayCode: "ECU", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-14T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m12", matchNumber: 12, stage: "Group", group: "F", homeCode: "SWE", awayCode: "TUN", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-15T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Monday June 15
  { id: "m13", matchNumber: 13, stage: "Group", group: "H", homeCode: "ESP", awayCode: "CPV", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-15T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m14", matchNumber: 14, stage: "Group", group: "G", homeCode: "BEL", awayCode: "EGY", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-15T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m15", matchNumber: 15, stage: "Group", group: "H", homeCode: "KSA", awayCode: "URU", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-15T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m16", matchNumber: 16, stage: "Group", group: "G", homeCode: "IRN", awayCode: "NZL", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-16T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Tuesday June 16
  { id: "m17", matchNumber: 17, stage: "Group", group: "I", homeCode: "FRA", awayCode: "SEN", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-16T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m18", matchNumber: 18, stage: "Group", group: "I", homeCode: "IRQ", awayCode: "NOR", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-16T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m19", matchNumber: 19, stage: "Group", group: "J", homeCode: "ARG", awayCode: "ALG", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-17T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m20", matchNumber: 20, stage: "Group", group: "J", homeCode: "AUT", awayCode: "JOR", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-17T04:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Wednesday June 17
  { id: "m21", matchNumber: 21, stage: "Group", group: "K", homeCode: "POR", awayCode: "COD", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-17T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m22", matchNumber: 22, stage: "Group", group: "L", homeCode: "ENG", awayCode: "CRO", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-17T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m23", matchNumber: 23, stage: "Group", group: "L", homeCode: "GHA", awayCode: "PAN", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-17T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m24", matchNumber: 24, stage: "Group", group: "K", homeCode: "UZB", awayCode: "COL", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-06-18T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Thursday June 18
  { id: "m25", matchNumber: 25, stage: "Group", group: "A", homeCode: "CZE", awayCode: "ZAF", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-18T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m26", matchNumber: 26, stage: "Group", group: "B", homeCode: "SUI", awayCode: "BIH", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-18T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m27", matchNumber: 27, stage: "Group", group: "B", homeCode: "CAN", awayCode: "QAT", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-18T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m28", matchNumber: 28, stage: "Group", group: "A", homeCode: "MEX", awayCode: "KOR", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-19T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Friday June 19
  { id: "m29", matchNumber: 29, stage: "Group", group: "C", homeCode: "SCO", awayCode: "MAR", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-19T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m30", matchNumber: 30, stage: "Group", group: "D", homeCode: "USA", awayCode: "AUS", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-06-19T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m31", matchNumber: 31, stage: "Group", group: "C", homeCode: "BRA", awayCode: "HAI", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-20T00:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m32", matchNumber: 32, stage: "Group", group: "D", homeCode: "TUR", awayCode: "PAR", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-20T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Saturday June 20
  { id: "m33", matchNumber: 33, stage: "Group", group: "F", homeCode: "NED", awayCode: "SWE", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-20T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m34", matchNumber: 34, stage: "Group", group: "E", homeCode: "GER", awayCode: "CIV", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-20T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m35", matchNumber: 35, stage: "Group", group: "E", homeCode: "ECU", awayCode: "CUW", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-21T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m36", matchNumber: 36, stage: "Group", group: "F", homeCode: "TUN", awayCode: "JPN", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-21T04:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Sunday June 21
  { id: "m37", matchNumber: 37, stage: "Group", group: "H", homeCode: "ESP", awayCode: "KSA", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-21T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m38", matchNumber: 38, stage: "Group", group: "G", homeCode: "BEL", awayCode: "IRN", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-21T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m39", matchNumber: 39, stage: "Group", group: "H", homeCode: "URU", awayCode: "CPV", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-21T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m40", matchNumber: 40, stage: "Group", group: "G", homeCode: "NZL", awayCode: "EGY", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-22T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Monday June 22
  { id: "m41", matchNumber: 41, stage: "Group", group: "J", homeCode: "ARG", awayCode: "AUT", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-22T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m42", matchNumber: 42, stage: "Group", group: "I", homeCode: "FRA", awayCode: "IRQ", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-22T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m43", matchNumber: 43, stage: "Group", group: "I", homeCode: "NOR", awayCode: "SEN", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-23T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m44", matchNumber: 44, stage: "Group", group: "J", homeCode: "JOR", awayCode: "ALG", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-23T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Tuesday June 23
  { id: "m45", matchNumber: 45, stage: "Group", group: "K", homeCode: "POR", awayCode: "UZB", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-23T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m46", matchNumber: 46, stage: "Group", group: "L", homeCode: "ENG", awayCode: "GHA", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-23T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m47", matchNumber: 47, stage: "Group", group: "L", homeCode: "PAN", awayCode: "CRO", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-23T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m48", matchNumber: 48, stage: "Group", group: "K", homeCode: "COL", awayCode: "COD", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-24T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Wednesday June 24
  { id: "m49", matchNumber: 49, stage: "Group", group: "B", homeCode: "SUI", awayCode: "CAN", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-24T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m50", matchNumber: 50, stage: "Group", group: "B", homeCode: "BIH", awayCode: "QAT", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-06-24T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m51", matchNumber: 51, stage: "Group", group: "C", homeCode: "SCO", awayCode: "BRA", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-24T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m52", matchNumber: 52, stage: "Group", group: "C", homeCode: "MAR", awayCode: "HAI", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-24T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m53", matchNumber: 53, stage: "Group", group: "A", homeCode: "CZE", awayCode: "MEX", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-06-25T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m54", matchNumber: 54, stage: "Group", group: "A", homeCode: "ZAF", awayCode: "KOR", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-25T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Thursday June 25
  { id: "m55", matchNumber: 55, stage: "Group", group: "E", homeCode: "ECU", awayCode: "GER", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-25T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m56", matchNumber: 56, stage: "Group", group: "E", homeCode: "CUW", awayCode: "CIV", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-25T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m57", matchNumber: 57, stage: "Group", group: "F", homeCode: "JPN", awayCode: "SWE", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-25T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m58", matchNumber: 58, stage: "Group", group: "F", homeCode: "TUN", awayCode: "NED", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-25T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m59", matchNumber: 59, stage: "Group", group: "D", homeCode: "TUR", awayCode: "USA", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-26T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m60", matchNumber: 60, stage: "Group", group: "D", homeCode: "PAR", awayCode: "AUS", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-06-26T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Friday June 26
  { id: "m61", matchNumber: 61, stage: "Group", group: "I", homeCode: "NOR", awayCode: "FRA", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-26T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m62", matchNumber: 62, stage: "Group", group: "I", homeCode: "SEN", awayCode: "IRQ", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-06-26T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m63", matchNumber: 63, stage: "Group", group: "H", homeCode: "CPV", awayCode: "KSA", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-27T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m64", matchNumber: 64, stage: "Group", group: "H", homeCode: "URU", awayCode: "ESP", venue: "Estadio Guadalajara", city: "Guadalajara", kickoff: "2026-06-27T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m65", matchNumber: 65, stage: "Group", group: "G", homeCode: "EGY", awayCode: "IRN", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-06-27T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m66", matchNumber: 66, stage: "Group", group: "G", homeCode: "NZL", awayCode: "BEL", venue: "BC Place", city: "Vancouver", kickoff: "2026-06-27T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  // Saturday June 27
  { id: "m67", matchNumber: 67, stage: "Group", group: "L", homeCode: "PAN", awayCode: "ENG", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-27T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m68", matchNumber: 68, stage: "Group", group: "L", homeCode: "CRO", awayCode: "GHA", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-06-27T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m69", matchNumber: 69, stage: "Group", group: "K", homeCode: "COL", awayCode: "POR", venue: "Miami Stadium", city: "Miami", kickoff: "2026-06-27T23:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m70", matchNumber: 70, stage: "Group", group: "K", homeCode: "COD", awayCode: "UZB", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-06-27T23:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m71", matchNumber: 71, stage: "Group", group: "J", homeCode: "ALG", awayCode: "AUT", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-06-28T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "m72", matchNumber: 72, stage: "Group", group: "J", homeCode: "JOR", awayCode: "ARG", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-28T02:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },

  // ===== ROUND OF 32 =====
  { id: "r32-1", matchNumber: 73, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-06-28T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-2", matchNumber: 74, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Houston Stadium", city: "Houston", kickoff: "2026-06-29T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-3", matchNumber: 75, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Boston Stadium", city: "Boston", kickoff: "2026-06-29T20:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-4", matchNumber: 76, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Estadio Monterrey", city: "Guadalupe", kickoff: "2026-06-30T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-5", matchNumber: 77, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-06-30T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-6", matchNumber: 78, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-06-30T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-7", matchNumber: 79, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-07-01T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-8", matchNumber: 80, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-07-01T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-9", matchNumber: 81, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-07-01T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-10", matchNumber: 82, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "San Francisco Bay Area Stadium", city: "San Francisco", kickoff: "2026-07-01T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-11", matchNumber: 83, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-07-02T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-12", matchNumber: 84, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Toronto Stadium", city: "Toronto", kickoff: "2026-07-02T23:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-13", matchNumber: 85, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "BC Place", city: "Vancouver", kickoff: "2026-07-03T03:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-14", matchNumber: 86, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-07-03T18:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-15", matchNumber: 87, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Miami Stadium", city: "Miami", kickoff: "2026-07-03T22:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r32-16", matchNumber: 88, stage: "R32", homeCode: "TBD", awayCode: "TBD", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-07-04T01:30:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },

  // ===== ROUND OF 16 =====
  { id: "r16-1", matchNumber: 89, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Houston Stadium", city: "Houston", kickoff: "2026-07-04T17:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-2", matchNumber: 90, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Philadelphia Stadium", city: "Philadelphia", kickoff: "2026-07-04T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-3", matchNumber: 91, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-07-05T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-4", matchNumber: 92, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Mexico City Stadium", city: "Mexico City", kickoff: "2026-07-06T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-5", matchNumber: 93, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-07-06T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-6", matchNumber: 94, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Seattle Stadium", city: "Seattle", kickoff: "2026-07-07T00:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-7", matchNumber: 95, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-07-07T16:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "r16-8", matchNumber: 96, stage: "R16", homeCode: "TBD", awayCode: "TBD", venue: "BC Place", city: "Vancouver", kickoff: "2026-07-07T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },

  // ===== QUARTERFINALS =====
  { id: "qf-1", matchNumber: 97, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Boston Stadium", city: "Boston", kickoff: "2026-07-09T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "qf-2", matchNumber: 98, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Los Angeles Stadium", city: "Los Angeles", kickoff: "2026-07-10T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "qf-3", matchNumber: 99, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Miami Stadium", city: "Miami", kickoff: "2026-07-11T20:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "qf-4", matchNumber: 100, stage: "QF", homeCode: "TBD", awayCode: "TBD", venue: "Kansas City Stadium", city: "Kansas City", kickoff: "2026-07-12T01:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },

  // ===== SEMIFINALS =====
  { id: "sf-1", matchNumber: 101, stage: "SF", homeCode: "TBD", awayCode: "TBD", venue: "Dallas Stadium", city: "Dallas", kickoff: "2026-07-14T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
  { id: "sf-2", matchNumber: 102, stage: "SF", homeCode: "TBD", awayCode: "TBD", venue: "Atlanta Stadium", city: "Atlanta", kickoff: "2026-07-15T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },

  // ===== THIRD PLACE =====
  { id: "3rd", matchNumber: 103, stage: "3rd", homeCode: "TBD", awayCode: "TBD", venue: "Miami Stadium", city: "Miami", kickoff: "2026-07-18T21:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },

  // ===== FINAL =====
  { id: "final", matchNumber: 104, stage: "Final", homeCode: "TBD", awayCode: "TBD", venue: "New York New Jersey Stadium", city: "New Jersey", kickoff: "2026-07-19T19:00:00Z", status: "scheduled", homeScore: 0, awayScore: 0 },
];

export function getMatch(id: string, source: Match[] = MATCHES): Match | undefined {
  return source.find((m) => m.id === id);
}

export function liveMatches(source: Match[] = MATCHES): Match[] {
  return source.filter((m) => m.status === "live" || m.status === "ht");
}

export function upcomingMatches(limit = 6, source: Match[] = MATCHES): Match[] {
  const now = Date.now();
  return source.filter((m) => m.status === "scheduled" && new Date(m.kickoff).getTime() > now)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
    .slice(0, limit);
}

export function matchesByGroup(group: string, source: Match[] = MATCHES): Match[] {
  return source.filter((m) => m.group === group);
}

export interface StandingRow {
  team: Team;
  p: number; w: number; d: number; l: number;
  gf: number; ga: number; gd: number; pts: number;
}

export function groupStandings(
  group: string,
  matches: Match[] = MATCHES,
  teams: Team[] = TEAMS,
): StandingRow[] {
  const groupTeams = teams.filter((t) => t.group === group);
  const rows: Record<string, StandingRow> = {};
  for (const t of groupTeams) rows[t.code] = { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  for (const match of matches.filter((m) => m.group === group && (m.status === "live" || m.status === "ht" || m.status === "ft"))) {
    const h = rows[match.homeCode];
    const a = rows[match.awayCode];
    if (!h || !a) continue;
    h.p++; a.p++;
    h.gf += match.homeScore; h.ga += match.awayScore;
    a.gf += match.awayScore; a.ga += match.homeScore;
    if (match.status === "ft") {
      if (match.homeScore > match.awayScore) { h.w++; h.pts += 3; a.l++; }
      else if (match.homeScore < match.awayScore) { a.w++; a.pts += 3; h.l++; }
      else { h.d++; a.d++; h.pts++; a.pts++; }
    }
  }
  return Object.values(rows)
    .map((r) => ({ ...r, gd: r.gf - r.ga }))
    .sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
}

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
