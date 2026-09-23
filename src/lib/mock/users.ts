export type UserRole = "Buyer" | "Tenant" | "Owner" | "Broker" | "Developer";
export type UserStatus = "Active" | "Suspended" | "Banned";
export type VerificationStatus = "Verified" | "Unverified";

let nextUserSeq = 1016;
export function nextUserId(): string {
  return `U-${nextUserSeq++}`;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  joined: string;
  listingsCount: number;
  status: UserStatus;
  verification: VerificationStatus;
}

export const mockUsers: AppUser[] = [
  { id: "U-1001", name: "Rohan Mehta", email: "rohan.mehta@example.com", phone: "+91 98200 11223", role: "Buyer", joined: "2025-11-02", listingsCount: 0, status: "Active", verification: "Verified" },
  { id: "U-1002", name: "Ananya Iyer", email: "ananya.iyer@example.com", phone: "+91 98450 22334", role: "Owner", joined: "2025-10-18", listingsCount: 3, status: "Active", verification: "Verified" },
  { id: "U-1003", name: "Vikram Singh", email: "vikram.singh@example.com", phone: "+91 99870 33445", role: "Broker", joined: "2025-09-27", listingsCount: 18, status: "Active", verification: "Verified" },
  { id: "U-1004", name: "Skyline Developers", email: "contact@skylinedev.com", phone: "+91 90040 44556", role: "Developer", joined: "2025-08-14", listingsCount: 42, status: "Active", verification: "Verified" },
  { id: "U-1005", name: "Priya Nair", email: "priya.nair@example.com", phone: "+91 98220 55667", role: "Tenant", joined: "2025-12-05", listingsCount: 0, status: "Suspended", verification: "Unverified" },
  { id: "U-1006", name: "Karan Kapoor", email: "karan.kapoor@example.com", phone: "+91 97410 66778", role: "Owner", joined: "2025-07-30", listingsCount: 1, status: "Active", verification: "Unverified" },
  { id: "U-1007", name: "Meera Krishnan", email: "meera.k@example.com", phone: "+91 96330 77889", role: "Broker", joined: "2025-06-21", listingsCount: 27, status: "Banned", verification: "Verified" },
  { id: "U-1008", name: "Green Valley Builders", email: "info@greenvalley.com", phone: "+91 90210 88990", role: "Developer", joined: "2025-05-09", listingsCount: 65, status: "Active", verification: "Verified" },
  { id: "U-1009", name: "Aditya Rao", email: "aditya.rao@example.com", phone: "+91 98765 99001", role: "Buyer", joined: "2026-01-11", listingsCount: 0, status: "Active", verification: "Verified" },
  { id: "U-1010", name: "Sneha Joshi", email: "sneha.joshi@example.com", phone: "+91 99887 00112", role: "Owner", joined: "2025-04-16", listingsCount: 2, status: "Active", verification: "Verified" },
  { id: "U-1011", name: "Arjun Malhotra", email: "arjun.malhotra@example.com", phone: "+91 98123 11224", role: "Broker", joined: "2025-03-08", listingsCount: 9, status: "Suspended", verification: "Unverified" },
  { id: "U-1012", name: "Horizon Realty", email: "hello@horizonrealty.com", phone: "+91 90876 22335", role: "Developer", joined: "2025-02-19", listingsCount: 31, status: "Active", verification: "Verified" },
  { id: "U-1013", name: "Divya Menon", email: "divya.menon@example.com", phone: "+91 97654 33446", role: "Tenant", joined: "2026-02-02", listingsCount: 0, status: "Active", verification: "Unverified" },
  { id: "U-1014", name: "Rahul Verma", email: "rahul.verma@example.com", phone: "+91 98432 44557", role: "Owner", joined: "2025-01-25", listingsCount: 4, status: "Active", verification: "Verified" },
  { id: "U-1015", name: "Ishaan Bhatt", email: "ishaan.bhatt@example.com", phone: "+91 99001 55889", role: "Buyer", joined: "2026-03-14", listingsCount: 0, status: "Active", verification: "Verified" },
];
