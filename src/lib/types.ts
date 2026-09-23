export interface Listing {
  id: string;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "agent" | "customer";
}
