import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import server from "../../services/server";
import type { StoreWithDetails, StoreReview } from "../../types/types";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import StoreHero from "./StoreHero";
import ProductCard from "../products/ProductCard";
import ReviewList from "../reviews/ReviewList";
import ReviewForm from "../reviews/ReviewForm";
import ItemForm from "../products/ItemForm";
import ConfirmDialog from "../common/ConfirmDialog";

const StoreDetails: React.FC = () => {
  const { user } = useAuthStore();
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useUIStore();

  const [store, setStore] = useState<StoreWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [deleteStoreDialogOpen, setDeleteStoreDialogOpen] = useState(false);
  const [deleteReviewDialogOpen, setDeleteReviewDialogOpen] = useState(false);
  const [targetReviewId, setTargetReviewId] = useState<string | null>(null);
  const [userReview, setUserReview] = useState<StoreReview | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!storeId) return;
      try {
        setLoading(true);
        const data = await server.getStoreWithDetails(storeId);
        setStore(data);
      } catch {
        setError("Error al cargar la tienda");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [storeId]);

  useEffect(() => {
    if (store && user) {
      setUserReview(store.reviews.find((r) => r.user.id === user.id) || null);
    }
  }, [store, user]);

  const updateStoreReviews = (reviews: StoreReview[]) => {
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

    updateStoreReviews(updatedReviews);
    setShowReviewForm(false);
  };

  const handleDeleteReview = async () => {
    if (!targetReviewId || !store) return;
    try {
      await server.deleteStoreReview(targetReviewId);
      const updatedReviews = store.reviews.filter((r) => r.id !== targetReviewId);
      updateStoreReviews(updatedReviews);
      if (userReview?.id === targetReviewId) setUserReview(null);
      showSnackbar("Reseña eliminada", "success");
    } catch {
      showSnackbar("Error al eliminar", "error");
    } finally {
      setDeleteReviewDialogOpen(false);
    }
  };

  const handleDeleteStore = async () => {
    if (!store) return;
    try {
      await server.deleteStore(store.id);
      showSnackbar("Tienda eliminada", "success");
      navigate("/");
    } catch {
      showSnackbar("Error", "error");
      setDeleteStoreDialogOpen(false);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" minHeight="100vh" alignItems="center">
        <CircularProgress />
      </Box>
    );
  if (error || !store)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || "Store not found"}</Alert>
      </Container>
    );

  const canManage =
    user && (user.role === "admin" || (user.role === "seller" && store.owner === user.id));

  return (
    <>
      <StoreHero store={store} />

      <Container sx={{ py: 4 }}>
        {canManage && (
          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              component={Link}
              to={`/edit-store/${store.id}`}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteStoreDialogOpen(true)}
            >
              Eliminar
            </Button>
          </Box>
        )}

        <Box sx={{ mb: 6 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Productos</Typography>
            {canManage && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowItemForm(true)}
              >
                Agregar Item
              </Button>
            )}
          </Box>
          <Grid container spacing={4}>
            {store.items.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={4}>
                <ProductCard item={item} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">Reseñas</Typography>
            {user && (
              <Button
                variant="contained"
                startIcon={userReview ? <EditIcon /> : <AddIcon />}
                onClick={() => setShowReviewForm(true)}
              >
                {userReview ? "Editar mi Reseña" : "Agregar Reseña"}
              </Button>
            )}
          </Box>
          <ReviewList
            reviews={store.reviews}
            user={user}
            onDeleteClick={(id) => {
              setTargetReviewId(id);
              setDeleteReviewDialogOpen(true);
            }}
          />
        </Box>
      </Container>

      {showReviewForm && storeId && (
        <ReviewForm
          storeId={storeId}
          onReviewAdded={handleReviewSaved}
          onCancel={() => setShowReviewForm(false)}
          user={user}
          initialReview={userReview}
        />
      )}
      {showItemForm && storeId && (
        <ItemForm
          storeId={storeId}
          onItemAdded={(newItem) => {
            setStore({ ...store, items: [...store.items, newItem] });
            setShowItemForm(false);
          }}
          onCancel={() => setShowItemForm(false)}
        />
      )}

      <ConfirmDialog
        open={deleteStoreDialogOpen}
        title="Eliminar Tienda"
        content={`¿Eliminar ${store.name}?`}
        onClose={() => setDeleteStoreDialogOpen(false)}
        onConfirm={handleDeleteStore}
      />
      <ConfirmDialog
        open={deleteReviewDialogOpen}
        title="Eliminar Reseña"
        content="¿Eliminar esta reseña?"
        onClose={() => setDeleteReviewDialogOpen(false)}
        onConfirm={handleDeleteReview}
      />
    </>
  );
};

export default StoreDetails;
