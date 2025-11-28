import axios from "axios";
import type {
  Store,
  StoreItem,
  StoreReview,
  StoreWithDetails,
  StoreWithRating,
  NewReview,
  NewStore,
  NewItem,
  User,
  SellerRequest,
  NewSellerRequest,
} from "../types/types";
import auth from "./auth";

const baseUrl = import.meta.env.PROD ? "/api" : "http://localhost:3001/api";

const getAuthHeaders = () => {
  const csrfToken = auth.getCsrfToken();
  return {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
};

interface StoreFilters {
  category?: string;
  search?: string;
  owner?: string;
}

const getAllStores = (filters?: StoreFilters): Promise<Store[]> => {
  return axios.get(`${baseUrl}/stores`, { params: filters }).then((response) => response.data);
};

const getStoreById = (id: string): Promise<Store> => {
  return axios.get(`${baseUrl}/stores/${id}`).then((response) => response.data);
};

const createStore = (store: NewStore): Promise<Store> => {
  return axios.post(`${baseUrl}/stores`, store, getAuthHeaders()).then((response) => response.data);
};

const updateStore = (id: string, store: NewStore): Promise<Store> => {
  return axios
    .put(`${baseUrl}/stores/${id}`, store, getAuthHeaders())
    .then((response) => response.data);
};

const deleteStore = (id: string): Promise<void> => {
  return axios.delete(`${baseUrl}/stores/${id}`, getAuthHeaders()).then(() => undefined);
};

const getAllStoreItems = (): Promise<StoreItem[]> => {
  return axios.get(`${baseUrl}/items`).then((response) => response.data);
};

const searchItems = (q: string, sort: string): Promise<StoreItem[]> => {
  return axios.get(`${baseUrl}/items/search`, { params: { q, sort } }).then((res) => res.data);
};

const getStoreItemsByStoreId = async (storeId: string): Promise<StoreItem[]> => {
  const allItems = await getAllStoreItems();
  return allItems.filter((item) => item.store.id === storeId);
};

const createStoreItem = (item: NewItem): Promise<StoreItem> => {
  return axios.post(`${baseUrl}/items`, item, getAuthHeaders()).then((response) => response.data);
};

const updateStoreItem = (id: string, item: NewItem): Promise<StoreItem> => {
  return axios
    .put(`${baseUrl}/items/${id}`, item, getAuthHeaders())
    .then((response) => response.data);
};

const deleteStoreItem = (id: string): Promise<void> => {
  return axios.delete(`${baseUrl}/items/${id}`, getAuthHeaders()).then(() => undefined);
};

const getAllStoreReviews = (): Promise<StoreReview[]> => {
  return axios.get(`${baseUrl}/reviews`).then((response) => response.data);
};

const getStoreReviewsByStoreId = async (storeId: string): Promise<StoreReview[]> => {
  const allReviews = await getAllStoreReviews();
  return allReviews.filter((review) => review.store.id === storeId);
};

const createStoreReview = (review: NewReview): Promise<StoreReview> => {
  return axios
    .post(`${baseUrl}/reviews`, review, getAuthHeaders())
    .then((response) => response.data);
};

const updateStoreReview = (id: string, reviewData: Partial<NewReview>): Promise<StoreReview> => {
  return axios
    .put(`${baseUrl}/reviews/${id}`, reviewData, getAuthHeaders())
    .then((res) => res.data);
};

const deleteStoreReview = (id: string): Promise<void> => {
  return axios.delete(`${baseUrl}/reviews/${id}`, getAuthHeaders()).then(() => undefined);
};

const getStoreWithDetails = (storeId: string): Promise<StoreWithDetails> => {
  return Promise.all([
    getStoreById(storeId),
    getStoreItemsByStoreId(storeId),
    getStoreReviewsByStoreId(storeId),
  ])
    .then(([store, items, reviews]) => {
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0;

      return {
        ...store,
        items,
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
      };
    })
    .catch((error) => {
      throw new Error(`Failed to fetch store details: ${error}`);
    });
};

const getStoresWithAverageRating = (filters?: StoreFilters): Promise<StoreWithRating[]> => {
  return Promise.all([getAllStores(filters), getAllStoreReviews()])
    .then(([stores, reviews]) => {
      return stores.map((store) => {
        const storeReviews = reviews.filter((review) => review.store.id === store.id);
        const averageRating =
          storeReviews.length > 0
            ? storeReviews.reduce((sum, review) => sum + review.rating, 0) / storeReviews.length
            : 0;
        return {
          ...store,
          averageRating: Math.round(averageRating * 10) / 10,
        };
      });
    })
    .catch((error) => {
      throw new Error(`Failed to fetch stores with ratings: ${error}`);
    });
};

const getAllUsers = (): Promise<User[]> => {
  return axios.get(`${baseUrl}/users`, getAuthHeaders()).then((response) => response.data);
};

const updateUserRole = (id: string, role: "admin" | "reviewer" | "seller"): Promise<User> => {
  return axios
    .put(`${baseUrl}/users/${id}`, { role }, getAuthHeaders())
    .then((response) => response.data);
};

const deleteUser = (id: string): Promise<void> => {
  return axios.delete(`${baseUrl}/users/${id}`, getAuthHeaders()).then(() => undefined);
};

const createSellerRequest = (data: NewSellerRequest): Promise<SellerRequest> => {
  return axios.post(`${baseUrl}/users/requests`, data, getAuthHeaders()).then((res) => res.data);
};

const getSellerRequests = (): Promise<SellerRequest[]> => {
  return axios.get(`${baseUrl}/users/requests`, getAuthHeaders()).then((res) => res.data);
};

const updateSellerRequestStatus = (
  id: string,
  status: "approved" | "rejected",
): Promise<SellerRequest> => {
  return axios
    .put(`${baseUrl}/users/requests/${id}`, { status }, getAuthHeaders())
    .then((res) => res.data);
};

export default {
  getAllStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getStoresWithAverageRating,
  getAllStoreItems,
  getStoreItemsByStoreId,
  createStoreItem,
  updateStoreItem,
  deleteStoreItem,
  searchItems,
  getAllStoreReviews,
  getStoreReviewsByStoreId,
  createStoreReview,
  updateStoreReview,
  deleteStoreReview,
  getStoreWithDetails,
  getAllUsers,
  updateUserRole,
  deleteUser,
  createSellerRequest,
  getSellerRequests,
  updateSellerRequestStatus,
};
