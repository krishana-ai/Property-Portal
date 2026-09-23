export type DocumentStatus = "Uploaded" | "Under Review" | "Verified" | "Rejected";
export type LinkedEntityType = "User" | "Listing" | "Project";

let nextDocSeq = 13;
export function nextDocumentId(): string {
  return `DOC-${String(nextDocSeq++).padStart(3, "0")}`;
}

export interface DocumentRecord {
  id: string;
  docType: string;
  linkedEntityType: LinkedEntityType;
  linkedEntityName: string;
  uploadDate: string;
  status: DocumentStatus;
}

export const mockDocuments: DocumentRecord[] = [
  { id: "DOC-001", docType: "Sale Deed", linkedEntityType: "Listing", linkedEntityName: "3BHK Sea View Apartment", uploadDate: "2026-09-22", status: "Verified" },
  { id: "DOC-002", docType: "NOC", linkedEntityType: "Listing", linkedEntityName: "Commercial Space, MG Road", uploadDate: "2026-09-22", status: "Under Review" },
  { id: "DOC-003", docType: "RERA Certificate", linkedEntityType: "Project", linkedEntityName: "Skyline Residency", uploadDate: "2026-09-21", status: "Verified" },
  { id: "DOC-004", docType: "PAN Card", linkedEntityType: "User", linkedEntityName: "Ananya Iyer", uploadDate: "2026-09-21", status: "Verified" },
  { id: "DOC-005", docType: "Aadhaar Card", linkedEntityType: "User", linkedEntityName: "Karan Kapoor", uploadDate: "2026-09-20", status: "Uploaded" },
  { id: "DOC-006", docType: "Layout Approval", linkedEntityType: "Listing", linkedEntityName: "Residential Plot, Sarjapur Road", uploadDate: "2026-09-19", status: "Rejected" },
  { id: "DOC-007", docType: "Occupancy Certificate", linkedEntityType: "Listing", linkedEntityName: "4BHK Penthouse", uploadDate: "2026-09-18", status: "Verified" },
  { id: "DOC-008", docType: "Brochure", linkedEntityType: "Project", linkedEntityName: "Green Valley Enclave", uploadDate: "2026-09-17", status: "Uploaded" },
  { id: "DOC-009", docType: "Land Title", linkedEntityType: "Listing", linkedEntityName: "Farmhouse with Pool", uploadDate: "2026-09-16", status: "Rejected" },
  { id: "DOC-010", docType: "GST Certificate", linkedEntityType: "User", linkedEntityName: "Horizon Realty", uploadDate: "2026-09-15", status: "Verified" },
  { id: "DOC-011", docType: "Property Tax Receipt", linkedEntityType: "Listing", linkedEntityName: "2BHK Garden Facing Flat", uploadDate: "2026-09-14", status: "Under Review" },
  { id: "DOC-012", docType: "RERA Certificate", linkedEntityType: "Project", linkedEntityName: "Cyber Heights", uploadDate: "2026-09-10", status: "Rejected" },
];
