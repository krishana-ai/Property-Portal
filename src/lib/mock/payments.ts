export type TxnStatus = "Success" | "Failed" | "Refunded";

export interface Transaction {
  id: string;
  user: string;
  property: string;
  amount: string;
  status: TxnStatus;
  date: string;
}

export const mockPaymentTransactions: Transaction[] = [
  { id: "TXN-8801", user: "Ananya Iyer", property: "Sunrise Towers, Bandra West", amount: "₹1,00,000", status: "Success", date: "2026-09-22" },
  { id: "TXN-8802", user: "Karan Kapoor", property: "Kothrud Garden View", amount: "₹65,000", status: "Success", date: "2026-09-21" },
  { id: "TXN-8803", user: "Vikram Singh", property: "MG Road Commercial Complex", amount: "₹2,00,000", status: "Failed", date: "2026-09-21" },
  { id: "TXN-8804", user: "Skyline Developers", property: "Skyline Residency Phase 1", amount: "₹12,50,000", status: "Success", date: "2026-09-20" },
  { id: "TXN-8805", user: "Priya Nair", property: "Hinjewadi Phase 2, Block C-12", amount: "₹50,000", status: "Refunded", date: "2026-09-19" },
  { id: "TXN-8806", user: "Rahul Verma", property: "Township Greens, Building 7", amount: "₹1,50,000", status: "Success", date: "2026-09-18" },
  { id: "TXN-8807", user: "Meera Krishnan", property: "Whitefield Tech Residency", amount: "₹80,000", status: "Failed", date: "2026-09-17" },
  { id: "TXN-8808", user: "Green Valley Builders", property: "Green Valley Enclave Phase 2", amount: "₹18,75,000", status: "Success", date: "2026-09-15" },
  { id: "TXN-8809", user: "Aditya Rao", property: "DLF Cyber City, Tower 6", amount: "₹90,000", status: "Success", date: "2026-09-13" },
  { id: "TXN-8810", user: "Sneha Joshi", property: "Kothrud Garden View", amount: "₹35,000", status: "Refunded", date: "2026-09-11" },
  { id: "TXN-8811", user: "Arjun Malhotra", property: "Commercial Street Retail Row", amount: "₹1,10,000", status: "Success", date: "2026-09-09" },
  { id: "TXN-8812", user: "Divya Menon", property: "ECR Farmhouse Estate", amount: "₹2,65,000", status: "Failed", date: "2026-09-06" },
];

export interface PaymentPlan {
  id: string;
  property: string;
  buyer: string;
  templateName: string;
  installments: number;
  paidAmount: number;
  upcomingAmount: number;
  overdueAmount: number;
}

export const mockPaymentPlans: PaymentPlan[] = [
  { id: "PP-01", property: "Skyline Residency, Unit A-1204", buyer: "Ananya Iyer", templateName: "20:80 Construction Linked", installments: 8, paidAmount: 480000, upcomingAmount: 1120000, overdueAmount: 0 },
  { id: "PP-02", property: "Green Valley Enclave, Unit B-506", buyer: "Karan Kapoor", templateName: "10:90 Down Payment", installments: 6, paidAmount: 150000, upcomingAmount: 850000, overdueAmount: 100000 },
  { id: "PP-03", property: "Lakeview Towers, Unit C-2201", buyer: "Rahul Verma", templateName: "Flexi Payment Plan", installments: 10, paidAmount: 900000, upcomingAmount: 300000, overdueAmount: 0 },
  { id: "PP-04", property: "Township Greens, Unit D-1104", buyer: "Sneha Joshi", templateName: "20:80 Construction Linked", installments: 8, paidAmount: 320000, upcomingAmount: 980000, overdueAmount: 60000 },
  { id: "PP-05", property: "Cyber Heights, Unit E-808", buyer: "Meera Krishnan", templateName: "Possession Linked", installments: 5, paidAmount: 200000, upcomingAmount: 600000, overdueAmount: 150000 },
  { id: "PP-06", property: "Riverside Greens, Unit F-303", buyer: "Aditya Rao", templateName: "10:90 Down Payment", installments: 6, paidAmount: 500000, upcomingAmount: 450000, overdueAmount: 0 },
  { id: "PP-07", property: "Emerald Court, Unit G-707", buyer: "Divya Menon", templateName: "Flexi Payment Plan", installments: 10, paidAmount: 100000, upcomingAmount: 1100000, overdueAmount: 0 },
  { id: "PP-08", property: "Palm Meadows, Unit H-101", buyer: "Arjun Malhotra", templateName: "Possession Linked", installments: 5, paidAmount: 750000, upcomingAmount: 150000, overdueAmount: 50000 },
];
