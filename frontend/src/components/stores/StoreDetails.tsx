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
import type { StoreItem } from "../../types/types";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import { useStoreDetails } from "../../hooks/useStoreDetails";
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

  const {
    store,
    loading,
    error,
    handleReviewSaved,
    deleteReview,
    addItemToState,
    updateItemInState,
    deleteItemFromState,
  } = useStoreDetails(storeId);

  // State local para UI
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [deleteStoreDialogOpen, setDeleteStoreDialogOpen] = useState(false);
  const [deleteReviewDialogOpen, setDeleteReviewDialogOpen] = useState(false);
  const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);

  const [targetReviewId, setTargetReviewId] = useState<string | null>(null);
  const [targetItemId, setTargetItemId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);

  // Derivar reseña del usuario actual si existe
  const userReview =
    store && user ? store.reviews.find((r) => r.user.id === user.id) || null : null;

  useEffect(() => {
    if (editingItem) {
      setShowItemForm(true);
    }
  }, [editingItem]);

  const handleDeleteReview = async () => {
    if (!targetReviewId) return;
    await deleteReview(targetReviewId);
    setDeleteReviewDialogOpen(false);
  };

  const handleDeleteItem = async () => {
    if (!targetItemId) return;
    await deleteItemFromState(targetItemId);
    setDeleteItemDialogOpen(false);
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

  const handleItemFormClose = () => {
    setShowItemForm(false);
    setEditingItem(null);
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
              Editar Tienda
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteStoreDialogOpen(true)}
            >
              Eliminar Tienda
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
                <ProductCard
                  item={item}
                  onEdit={
                    canManage
                      ? (itm) => {
                          setEditingItem(itm);
                        }
                      : undefined
                  }
                  onDelete={
                    canManage
                      ? (id) => {
                          setTargetItemId(id);
                          setDeleteItemDialogOpen(true);
                        }
                      : undefined
                  }
                />
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
          onReviewAdded={(review) => {
            handleReviewSaved(review);
            setShowReviewForm(false);
          }}
          onCancel={() => setShowReviewForm(false)}
          user={user}
          initialReview={userReview}
        />
      )}

      {showItemForm && storeId && (
        <ItemForm
          storeId={storeId}
          initialItem={editingItem}
          onItemSaved={(savedItem) => {
            if (editingItem) {
              updateItemInState(savedItem);
            } else {
              addItemToState(savedItem);
            }
            handleItemFormClose();
          }}
          onCancel={handleItemFormClose}
        />
      )}

      {/* Dialogs */}
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
      <ConfirmDialog
        open={deleteItemDialogOpen}
        title="Eliminar Producto"
        content="¿Estás seguro de que deseas eliminar este producto?"
        onClose={() => setDeleteItemDialogOpen(false)}
        onConfirm={handleDeleteItem}
      />
    </>
  );
};

export default StoreDetails;
