// types/order.ts
export interface OrderItem {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  note?: string;
  profile?: string;
  width?: number;
  height?: number;
  m2?: number;
  device?: string;
  product: {
    title: string;
    mainImage: string;
    category: string;
  };
}

export interface Address {
  type: "shipping" | "billing";
  firstName?: string;
  lastName?: string;
  address: string;
  district?: string;
  city: string;
  zip?: string;
  phone?: string;
  country: string;
}

export interface FormattedOrder {
  id: number;
  user: {
    name: string;
    surname: string;
    email: string;
  };
  totalPrice: number;
  paidPrice: number;
  paymentMethod: string;
  transactionId?: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  addresses: Address[];
}
