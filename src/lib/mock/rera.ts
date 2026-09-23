export type ComplianceStatus = "RERA Registered" | "Expiring Soon" | "Non-Compliant";

export interface ReraRecord {
  id: string;
  projectName: string;
  reraNumber: string;
  state: string;
  validity: string;
  complianceStatus: ComplianceStatus;
}

let nextReraSeq = 13;
export function nextReraId(): string {
  return `RE-${String(nextReraSeq++).padStart(2, "0")}`;
}

export const mockReraRecords: ReraRecord[] = [
  { id: "RE-01", projectName: "Skyline Residency", reraNumber: "RERA/MH/2026/0142", state: "Maharashtra", validity: "2028-03-31", complianceStatus: "RERA Registered" },
  { id: "RE-02", projectName: "Green Valley Enclave", reraNumber: "RERA/KA/2025/0987", state: "Karnataka", validity: "2027-11-30", complianceStatus: "RERA Registered" },
  { id: "RE-03", projectName: "Horizon Business Park", reraNumber: "RERA/HR/2026/0055", state: "Haryana", validity: "2026-10-15", complianceStatus: "Expiring Soon" },
  { id: "RE-04", projectName: "Lakeview Towers", reraNumber: "RERA/MH/2025/0761", state: "Maharashtra", validity: "2026-08-01", complianceStatus: "Expiring Soon" },
  { id: "RE-05", projectName: "Palm Meadows", reraNumber: "RERA/TN/2026/0033", state: "Tamil Nadu", validity: "2029-01-20", complianceStatus: "RERA Registered" },
  { id: "RE-06", projectName: "Cyber Heights", reraNumber: "RERA/HR/2026/0071", state: "Haryana", validity: "2026-05-10", complianceStatus: "Non-Compliant" },
  { id: "RE-07", projectName: "Riverside Greens", reraNumber: "RERA/KA/2026/0112", state: "Karnataka", validity: "2028-06-30", complianceStatus: "RERA Registered" },
  { id: "RE-08", projectName: "Sunset Boulevard", reraNumber: "RERA/TN/2026/0203", state: "Tamil Nadu", validity: "2026-04-18", complianceStatus: "Non-Compliant" },
  { id: "RE-09", projectName: "Township Greens", reraNumber: "RERA/MH/2026/0301", state: "Maharashtra", validity: "2030-02-28", complianceStatus: "RERA Registered" },
  { id: "RE-10", projectName: "Emerald Court", reraNumber: "RERA/KA/2027/0044", state: "Karnataka", validity: "2027-09-09", complianceStatus: "RERA Registered" },
  { id: "RE-11", projectName: "Metro Square", reraNumber: "RERA/DL/2025/0512", state: "Delhi", validity: "2026-06-01", complianceStatus: "Expiring Soon" },
  { id: "RE-12", projectName: "Coastal Dunes", reraNumber: "RERA/TN/2026/0290", state: "Tamil Nadu", validity: "2029-07-14", complianceStatus: "RERA Registered" },
];
