import { useState, useEffect, useCallback } from "react";
import server from "../services/server";
import { useUIStore } from "../stores/useUIStore";
import type { StoreWithDetails, StoreReview, StoreItem } from "../types/types";
import { getErrorMessage } from "../utils/errorUtils";

export const useStoreDetails = (storeId: string | undefined) => {
  const [store, setStore] = useState<StoreWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showSnackbar } = useUIStore();

  const fetchDetails = useCallback(async () => {
    if (!storeId) return;
    try {
      setLoading(true);
      const data = await server.getStoreWithDetails(storeId);
      setStore(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const updateReviewState = (reviews: StoreReview[]) => {
    if (!store) return;
    const avg =
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    setStore({ ...store, reviews, averageRating: avg });
  };

  const handleReviewSaved = (savedReview: StoreReview) => {
    if (!store) return;
    const exists = store.reviews.find((r) => r.id === savedReview.id);
    const updatedReviews = exists
      ? store.reviews.map((r) => (r.id === savedReview.id ? savedReview : r))
      : [...store.reviews, savedReview];

    updateReviewState(updatedReviews);
  };

  const deleteReview = async (reviewId: string) => {
    if (!store) return;
    try {
      await server.deleteStoreReview(reviewId);
      const updatedReviews = store.reviews.filter((r) => r.id !== reviewId);
      updateReviewState(updatedReviews);
      showSnackbar("Reseña eliminada", "success");
      return true;
    } catch {
      showSnackbar("Error al eliminar", "error");
      return false;
    }
  };

  const addItemToState = (newItem: StoreItem) => {
    if (store) setStore({ ...store, items: [...store.items, newItem] });
  };

  return {
    store,
    loading,
    error,
    handleReviewSaved,
    deleteReview,
    addItemToState,
  };
};
