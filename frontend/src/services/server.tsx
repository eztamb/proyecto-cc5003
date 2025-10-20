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
} from "../types/types";
import auth from "./auth";

const baseUrl = "http://localhost:3001/api";

const getAllStores = (): Promise<Store[]> => {
  return axios.get(`${baseUrl}/stores`).then((response) => response.data);
};

const getStoreById = (id: string): Promise<Store> => {
  return axios.get(`${baseUrl}/stores/${id}`).then((response) => response.data);
};

const createStore = (store: NewStore): Promise<Store> => {
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.post(`${baseUrl}/stores`, store, config).then((response) => response.data);
};

const updateStore = (id: string, store: NewStore): Promise<Store> => {
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.put(`${baseUrl}/stores/${id}`, store, config).then((response) => response.data);
};

const deleteStore = (id: string): Promise<void> => {
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.delete(`${baseUrl}/stores/${id}`, config).then(() => undefined);
};

const getAllStoreItems = (): Promise<StoreItem[]> => {
  return axios.get(`${baseUrl}/items`).then((response) => response.data);
};

const getStoreItemsByStoreId = async (storeId: string): Promise<StoreItem[]> => {
  const allItems = await getAllStoreItems();
  return allItems.filter((item) => item.store.id === storeId);
};

const getStoreItemById = (id: string): Promise<StoreItem> => {
  return axios.get(`${baseUrl}/items/${id}`).then((response) => response.data);
};

const createStoreItem = (item: NewItem): Promise<StoreItem> => {
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.post(`${baseUrl}/items`, item, config).then((response) => response.data);
};

const getAllStoreReviews = (): Promise<StoreReview[]> => {
  return axios.get(`${baseUrl}/reviews`).then((response) => response.data);
};

const getStoreReviewsByStoreId = async (storeId: string): Promise<StoreReview[]> => {
  const allReviews = await getAllStoreReviews();
  return allReviews.filter((review) => review.store.id === storeId);
};

const getStoreReviewById = (id: string): Promise<StoreReview> => {
  return axios.get(`${baseUrl}/reviews/${id}`).then((response) => response.data);
};

const createStoreReview = (review: NewReview): Promise<StoreReview> => {
  const csrfToken = auth.getCsrfToken();

  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };

  return axios.post(`${baseUrl}/reviews`, review, config).then((response) => response.data);
};

const deleteStoreReview = (id: string): Promise<void> => {
  const csrfToken = auth.getCsrfToken();

  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };

  return axios.delete(`${baseUrl}/reviews/${id}`, config).then(() => undefined);
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

const getStoresWithAverageRating = (): Promise<StoreWithRating[]> => {
  return Promise.all([getAllStores(), getAllStoreReviews()])
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
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.get(`${baseUrl}/users`, config).then((response) => response.data);
};

const updateUserRole = (id: string, role: "admin" | "reviewer"): Promise<User> => {
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.put(`${baseUrl}/users/${id}`, { role }, config).then((response) => response.data);
};

const deleteUser = (id: string): Promise<void> => {
  const csrfToken = auth.getCsrfToken();
  const config = {
    withCredentials: true,
    headers: {
      "X-CSRF-Token": csrfToken || "",
    },
  };
  return axios.delete(`${baseUrl}/users/${id}`, config).then(() => undefined);
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
  getStoreItemById,
  createStoreItem,

  getAllStoreReviews,
  getStoreReviewsByStoreId,
  getStoreReviewById,
  createStoreReview,
  deleteStoreReview,

  getStoreWithDetails,

  getAllUsers,
  updateUserRole,
  deleteUser,
};
