export type LeadChannel = "Call" | "WhatsApp" | "Chat" | "Callback";
export type LeadQuality = "Genuine" | "Spam";
export type LeadUserType = "Buyer" | "Broker" | "Developer";
export type LeadStatus = "New" | "Contacted" | "Follow-up" | "Closed";

export interface Lead {
  id: string;
  userName: string;
  listingOrProject: string;
  channel: LeadChannel;
  quality: LeadQuality;
  userType: LeadUserType;
  status: LeadStatus;
  date: string;
}

export const mockLeads: Lead[] = [
  { id: "LD-201", userName: "Rohan Mehta", listingOrProject: "3BHK Sea View Apartment", channel: "Call", quality: "Genuine", userType: "Buyer", status: "New", date: "2026-09-22" },
  { id: "LD-202", userName: "Ananya Iyer", listingOrProject: "Skyline Residency", channel: "WhatsApp", quality: "Genuine", userType: "Buyer", status: "Contacted", date: "2026-09-22" },
  { id: "LD-203", userName: "Vikram Singh", listingOrProject: "Commercial Space, MG Road", channel: "Chat", quality: "Genuine", userType: "Broker", status: "Follow-up", date: "2026-09-21" },
  { id: "LD-204", userName: "Unknown Caller", listingOrProject: "2BHK Ready to Move", channel: "Call", quality: "Spam", userType: "Buyer", status: "Closed", date: "2026-09-21" },
  { id: "LD-205", userName: "Priya Nair", listingOrProject: "Independent Villa with Garden", channel: "Callback", quality: "Genuine", userType: "Buyer", status: "New", date: "2026-09-20" },
  { id: "LD-206", userName: "Karan Kapoor", listingOrProject: "Green Valley Enclave", channel: "WhatsApp", quality: "Genuine", userType: "Developer", status: "Contacted", date: "2026-09-20" },
  { id: "LD-207", userName: "Meera Krishnan", listingOrProject: "Studio Apartment, Whitefield", channel: "Chat", quality: "Genuine", userType: "Broker", status: "Follow-up", date: "2026-09-19" },
  { id: "LD-208", userName: "Promo Bot", listingOrProject: "Office Space, Cyber City", channel: "Chat", quality: "Spam", userType: "Buyer", status: "Closed", date: "2026-09-18" },
  { id: "LD-209", userName: "Aditya Rao", listingOrProject: "4BHK Penthouse", channel: "Call", quality: "Genuine", userType: "Buyer", status: "New", date: "2026-09-17" },
  { id: "LD-210", userName: "Sneha Joshi", listingOrProject: "2BHK Garden Facing Flat", channel: "WhatsApp", quality: "Genuine", userType: "Buyer", status: "Contacted", date: "2026-09-16" },
  { id: "LD-211", userName: "Arjun Malhotra", listingOrProject: "Retail Shop, Commercial Street", channel: "Call", quality: "Genuine", userType: "Broker", status: "Follow-up", date: "2026-09-15" },
  { id: "LD-212", userName: "Divya Menon", listingOrProject: "Farmhouse with Pool", channel: "Callback", quality: "Genuine", userType: "Buyer", status: "Closed", date: "2026-09-14" },
  { id: "LD-213", userName: "Rahul Verma", listingOrProject: "3BHK Township Apartment", channel: "Chat", quality: "Genuine", userType: "Buyer", status: "New", date: "2026-09-13" },
];
