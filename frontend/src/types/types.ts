export interface User {
  id: string;
  username: string;
  role: "admin" | "reviewer" | "seller";
}

export interface Store {
  id: string;
  storeCategory: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  junaeb: boolean;
  owner: string;
  averageRating?: number;
}

export interface NewStore {
  storeCategory: string;
  name: string;
  description: string;
  location: string;
  images: string[];
  junaeb: boolean;
}

export interface StoreWithRating extends Store {
  averageRating: number;
}

export interface StoreReference {
  id: string;
  name: string;
  location?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  store: StoreReference;
  description: string;
  picture: string;
  price: number;
  storeRating?: number;
}

export interface NewItem {
  name: string;
  storeId: string;
  description: string;
  picture: string;
  price: number;
}

export interface NewReview {
  storeId: string;
  rating: number;
  comment: string;
  userName?: string;
  picture?: string;
}

export interface StoreReview {
  id: string;
  store: StoreReference;
  user: {
    id: string;
    username: string;
  };
  rating: number;
  comment: string;
  userName?: string;
  picture?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface StoreWithDetails extends Store {
  items: StoreItem[];
  reviews: StoreReview[];
  averageRating: number;
}

export interface SellerRequest {
  id: string;
  user: {
    id: string;
    username: string;
  };
  fullName: string;
  rut: string;
  email: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface NewSellerRequest {
  fullName: string;
  rut: string;
  email: string;
  description: string;
}
