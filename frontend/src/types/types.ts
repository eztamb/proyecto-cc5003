export interface Store {
  id: string;
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
  rating: number;
  comment: string;
  userName?: string;
  picture?: string;
}

export interface StoreWithDetails extends Store {
  items: StoreItem[];
  reviews: StoreReview[];
  averageRating: number;
}

export interface StoresResponse {
  stores: Store[];
  total: number;
}
