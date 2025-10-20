import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import server from "../services/server";
import type { StoreWithDetails, StoreReview, User, StoreItem } from "../types/types";
import ReviewForm from "./ReviewForm";
import ItemForm from "./ItemForm";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Rating,
  Grid,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface StoreDetailsProps {
  user: User | null;
}

const StoreDetails: React.FC<StoreDetailsProps> = ({ user }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

  const handleReviewAdded = (newReview: StoreReview) => {
    if (store) {
      const updatedReviews = [...store.reviews, newReview];
      const newAverageRating =
        updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length;

      setStore({
        ...store,
        reviews: updatedReviews,
        averageRating: Math.round(newAverageRating * 10) / 10,
      });
    }
    setShowReviewForm(false);
  };

  const handleItemAdded = (newItem: StoreItem) => {
    if (store) {
      setStore({
        ...store,
        items: [...store.items, newItem],
      });
    }
    setShowItemForm(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!store) return;
    try {
      await server.deleteStoreReview(reviewId);
      const updatedReviews = store.reviews.filter((r) => r.id !== reviewId);
      const newAverageRating =
        updatedReviews.length > 0
          ? updatedReviews.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.length
          : 0;

      setStore({
        ...store,
        reviews: updatedReviews,
        averageRating: Math.round(newAverageRating * 10) / 10,
      });
    } catch {
      setError("Failed to delete review");
    }
  };

  const handleDeleteStore = async () => {
    if (store && window.confirm(`¿Estás seguro de que quieres eliminar ${store.name}?`)) {
      try {
        await server.deleteStore(store.id);
        navigate("/");
      } catch {
        setError("Error al eliminar la tienda");
      }
    }
  };

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!storeId) return;
      try {
        setLoading(true);
        const data = await server.getStoreWithDetails(storeId);
        setStore(data);
      } catch {
        setError("Failed to load store details");
      } finally {
        setLoading(false);
      }
    };
    fetchStoreDetails();
  }, [storeId]);

  if (loading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  if (!store)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Store not found</Alert>
      </Container>
    );

  return (
    <>
      <Box sx={{ position: "relative", height: { xs: 300, md: 400 }, color: "white" }}>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${store.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{ position: "absolute", width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.6)" }}
        />
        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            py: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{ position: "absolute", top: 16, left: 16 }}
          >
            Volver
          </Button>
          <Typography variant="h2" component="h1" fontWeight="bold">
            {store.name}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {store.description}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Rating value={store.averageRating} precision={0.5} readOnly />
            <Typography sx={{ ml: 1.5 }}>
              {store.averageRating.toFixed(1)} ({store.reviews.length} reseñas)
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container sx={{ py: 4 }}>
        {user?.role === "admin" && (
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
              onClick={handleDeleteStore}
            >
              Eliminar Tienda
            </Button>
          </Box>
        )}

        <Box sx={{ mb: 6 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
          >
            <Typography variant="h4" component="h2">
              Productos
            </Typography>
            {user?.role === "admin" && (
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
                <Card sx={{ height: "100%" }}>
                  <CardMedia component="img" height="200" image={item.picture} alt={item.name} />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                      ${item.price.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        <Box>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
          >
            <Typography variant="h4" component="h2">
              Reseñas
            </Typography>
            {user && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowReviewForm(true)}
              >
                Agregar Reseña
              </Button>
            )}
          </Box>
          <Grid container spacing={3}>
            {store.reviews.map((review) => (
              <Grid item key={review.id} xs={12}>
                <Paper sx={{ p: 3, borderLeft: "4px solid", borderColor: "primary.main" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6">{review.userName || "Anónimo"}</Typography>
                    {user && (user.role === "admin" || user.id === review.user.id) && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    )}
                  </Box>
                  <Rating value={review.rating} readOnly sx={{ mb: 1 }} />
                  <Typography color="text.secondary">{review.comment}</Typography>
                  {review.picture && (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={review.picture}
                        alt="Review"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {showReviewForm && (
        <ReviewForm
          storeId={storeId}
          onReviewAdded={handleReviewAdded}
          onCancel={() => setShowReviewForm(false)}
          user={user}
        />
      )}

      {showItemForm && storeId && (
        <ItemForm
          storeId={storeId}
          onItemAdded={handleItemAdded}
          onCancel={() => setShowItemForm(false)}
        />
      )}
    </>
  );
};

export default StoreDetails;
