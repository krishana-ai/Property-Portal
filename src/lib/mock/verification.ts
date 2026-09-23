export type VerificationStage =
  | "Draft"
  | "Submitted"
  | "AI Check"
  | "Duplicate Check"
  | "Document Check"
  | "Human Review"
  | "Verified"
  | "Published"
  | "Updated"
  | "Expired"
  | "Rejected";

export interface VerificationItem {
  id: string;
  name: string;
  linkedTo: string;
  submitted: string;
  stage: VerificationStage;
  note?: string;
}

export const ownerVerificationQueue: VerificationItem[] = [
  { id: "OV-101", name: "Ananya Iyer", linkedTo: "P-5001 · Sunrise Towers", submitted: "2026-09-20", stage: "Human Review" },
  { id: "OV-102", name: "Karan Kapoor", linkedTo: "P-5009 · Kothrud Garden View", submitted: "2026-09-19", stage: "Document Check" },
  { id: "OV-103", name: "Sneha Joshi", linkedTo: "P-5009 · Kothrud Garden View", submitted: "2026-09-18", stage: "Verified" },
  { id: "OV-104", name: "Rahul Verma", linkedTo: "P-5012 · Township Greens", submitted: "2026-09-17", stage: "AI Check" },
  { id: "OV-105", name: "Priya Nair", linkedTo: "P-5003 · Hinjewadi Phase 2", submitted: "2026-09-16", stage: "Rejected", note: "ID proof mismatch" },
  { id: "OV-106", name: "Divya Menon", linkedTo: "P-5006 · Sarjapur Road Layout", submitted: "2026-09-15", stage: "Submitted" },
  { id: "OV-107", name: "Arjun Malhotra", linkedTo: "P-5011 · Commercial Street Retail", submitted: "2026-09-14", stage: "Duplicate Check" },
  { id: "OV-108", name: "Ishaan Bhatt", linkedTo: "P-5004 · ECR Villa Row", submitted: "2026-09-12", stage: "Published" },
  { id: "OV-109", name: "Rohan Mehta", linkedTo: "P-5007 · Vasant Kunj Sky Residences", submitted: "2026-09-10", stage: "Draft" },
  { id: "OV-110", name: "Meera Krishnan", linkedTo: "P-5002 · MG Road Commercial Complex", submitted: "2026-08-28", stage: "Expired" },
  { id: "OV-111", name: "Vikram Singh", linkedTo: "P-5008 · DLF Cyber City", submitted: "2026-08-20", stage: "Updated" },
];

export const documentVerificationQueue: VerificationItem[] = [
  { id: "DV-201", name: "3BHK Sea View Apartment", linkedTo: "L-2041 · Sale Deed", submitted: "2026-09-22", stage: "Human Review" },
  { id: "DV-202", name: "Commercial Space, MG Road", linkedTo: "L-2040 · NOC", submitted: "2026-09-22", stage: "Document Check" },
  { id: "DV-203", name: "2BHK Ready to Move", linkedTo: "L-2039 · RERA Certificate", submitted: "2026-09-21", stage: "Verified" },
  { id: "DV-204", name: "Independent Villa with Garden", linkedTo: "L-2038 · Sale Deed", submitted: "2026-09-21", stage: "Published" },
  { id: "DV-205", name: "Residential Plot, Sarjapur Road", linkedTo: "L-2036 · Layout Approval", submitted: "2026-09-19", stage: "Rejected", note: "Approval document expired" },
  { id: "DV-206", name: "Office Space, Cyber City", linkedTo: "L-2034 · NOC", submitted: "2026-09-18", stage: "AI Check" },
  { id: "DV-207", name: "Farmhouse with Pool", linkedTo: "L-2032 · Land Title", submitted: "2026-09-16", stage: "Duplicate Check" },
  { id: "DV-208", name: "Retail Shop, Commercial Street", linkedTo: "L-2031 · Sale Deed", submitted: "2026-09-15", stage: "Submitted" },
  { id: "DV-209", name: "4BHK Penthouse", linkedTo: "L-2035 · Occupancy Certificate", submitted: "2026-09-05", stage: "Updated" },
  { id: "DV-210", name: "3BHK Township Apartment", linkedTo: "L-2030 · Occupancy Certificate", submitted: "2026-08-25", stage: "Expired" },
];

export const reraSignalsQueue: VerificationItem[] = [
  { id: "RS-301", name: "Skyline Residency Phase 1", linkedTo: "RERA/MH/2026/0142", submitted: "2026-09-20", stage: "Verified" },
  { id: "RS-302", name: "Green Valley Enclave", linkedTo: "RERA/KA/2025/0987", submitted: "2026-09-19", stage: "Human Review" },
  { id: "RS-303", name: "Horizon Business Park", linkedTo: "RERA/HR/2026/0055", submitted: "2026-09-18", stage: "AI Check" },
  { id: "RS-304", name: "Lakeview Towers", linkedTo: "RERA/MH/2025/0761", submitted: "2026-09-14", stage: "Expired" },
  { id: "RS-305", name: "Palm Meadows", linkedTo: "RERA/TN/2026/0033", submitted: "2026-09-12", stage: "Published" },
  { id: "RS-306", name: "Cyber Heights", linkedTo: "RERA/HR/2026/0071", submitted: "2026-09-08", stage: "Rejected", note: "Registration number not found in state portal" },
  { id: "RS-307", name: "Riverside Greens", linkedTo: "RERA/KA/2026/0112", submitted: "2026-09-02", stage: "Document Check" },
  { id: "RS-308", name: "Sunset Boulevard", linkedTo: "RERA/MH/2026/0203", submitted: "2026-08-30", stage: "Submitted" },
];
