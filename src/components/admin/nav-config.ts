import {
  LayoutDashboard,
  Building2,
  Home,
  FolderKanban,
  Map,
  Copy,
  ShieldCheck,
  FileText,
  Scale,
  Users,
  PhoneCall,
  CreditCard,
  Repeat,
  BarChart3,
  LineChart,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { label: "Listings", href: "/admin/listings", icon: Building2 },
      { label: "Properties", href: "/admin/properties", icon: Home },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Townships", href: "/admin/townships", icon: Map },
      { label: "Duplicates", href: "/admin/duplicates", icon: Copy },
    ],
  },
  {
    label: "Trust & Verification",
    items: [
      { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
      { label: "Documents", href: "/admin/documents", icon: FileText },
      { label: "RERA", href: "/admin/rera", icon: Scale },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Leads", href: "/admin/leads", icon: PhoneCall },
    ],
  },
  {
    label: "Money",
    items: [
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Transactions", href: "/admin/transactions", icon: Repeat },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Analytics", href: "/admin/analytics", icon: LineChart },
      { label: "AI Governance", href: "/admin/ai", icon: Bot },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];
