export type AdminRoleName = "Super Admin" | "Moderator" | "Verification Officer" | "Finance" | "Support";

export interface AdminRoleRow {
  id: string;
  name: string;
  email: string;
  role: AdminRoleName;
  permissions: {
    approveListings: boolean;
    manageUsers: boolean;
    viewFinance: boolean;
  };
}

export const mockAdminRoles: AdminRoleRow[] = [
  { id: "A-01", name: "Priya Sharma", email: "priya.sharma@anavrinproperty.com", role: "Super Admin", permissions: { approveListings: true, manageUsers: true, viewFinance: true } },
  { id: "A-02", name: "Neha Desai", email: "neha.desai@anavrinproperty.com", role: "Moderator", permissions: { approveListings: true, manageUsers: false, viewFinance: false } },
  { id: "A-03", name: "Sameer Khan", email: "sameer.khan@anavrinproperty.com", role: "Verification Officer", permissions: { approveListings: true, manageUsers: false, viewFinance: false } },
  { id: "A-04", name: "Anjali Gupta", email: "anjali.gupta@anavrinproperty.com", role: "Finance", permissions: { approveListings: false, manageUsers: false, viewFinance: true } },
  { id: "A-05", name: "Farhan Ali", email: "farhan.ali@anavrinproperty.com", role: "Support", permissions: { approveListings: false, manageUsers: true, viewFinance: false } },
];

export type TemplateChannel = "Email" | "SMS" | "WhatsApp" | "Push";

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: TemplateChannel;
  lastEdited: string;
}

export const mockNotificationTemplates: NotificationTemplate[] = [
  { id: "NT-01", name: "Listing Approved", channel: "Email", lastEdited: "2026-09-10" },
  { id: "NT-02", name: "Listing Rejected", channel: "Email", lastEdited: "2026-09-10" },
  { id: "NT-03", name: "OTP Verification", channel: "SMS", lastEdited: "2026-08-22" },
  { id: "NT-04", name: "New Lead Alert", channel: "WhatsApp", lastEdited: "2026-09-15" },
  { id: "NT-05", name: "Payment Reminder", channel: "Push", lastEdited: "2026-09-01" },
  { id: "NT-06", name: "Document Rejected", channel: "Email", lastEdited: "2026-08-30" },
];

export interface ApiKeyRow {
  id: string;
  service: string;
  maskedKey: string;
  lastRotated: string;
}

export const mockApiKeys: ApiKeyRow[] = [
  { id: "K-01", service: "Maps API", maskedKey: "AIzaSy••••••••••••••••8fQ2", lastRotated: "2026-06-14" },
  { id: "K-02", service: "Payment Gateway", maskedKey: "rzp_live_••••••••••••9a3c", lastRotated: "2026-08-01" },
  { id: "K-03", service: "SMS Gateway", maskedKey: "sms_key_••••••••••••e71d", lastRotated: "2026-07-20" },
  { id: "K-04", service: "LLM API", maskedKey: "sk-ant-••••••••••••••••••b6f1", lastRotated: "2026-09-05" },
];

export interface AuditLogEntry {
  id: string;
  adminName: string;
  action: string;
  target: string;
  time: string;
}

export const mockAuditLog: AuditLogEntry[] = [
  { id: "AL-01", adminName: "Priya Sharma", action: "Approved listing", target: "L-2035 · 4BHK Penthouse", time: "2026-09-22 10:14" },
  { id: "AL-02", adminName: "Sameer Khan", action: "Verified document", target: "DOC-001 · Sale Deed", time: "2026-09-22 09:48" },
  { id: "AL-03", adminName: "Neha Desai", action: "Rejected listing", target: "L-2036 · Residential Plot", time: "2026-09-21 17:32" },
  { id: "AL-04", adminName: "Anjali Gupta", action: "Refunded transaction", target: "TXN-8805", time: "2026-09-19 14:05" },
  { id: "AL-05", adminName: "Farhan Ali", action: "Suspended user", target: "U-1011 · Arjun Malhotra", time: "2026-09-18 11:20" },
  { id: "AL-06", adminName: "Priya Sharma", action: "Regenerated API key", target: "Payment Gateway", time: "2026-08-01 08:00" },
  { id: "AL-07", adminName: "Sameer Khan", action: "Flagged RERA record", target: "RE-06 · Cyber Heights", time: "2026-08-28 15:40" },
];
