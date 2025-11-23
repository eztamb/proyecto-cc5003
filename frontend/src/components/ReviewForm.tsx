import React, { useState, useEffect } from "react";
import server from "../services/server";
import type { StoreReview, User, NewReview } from "../types/types";
import { Modal, Box, Typography, Rating, TextField, Button, CircularProgress } from "@mui/material";
import { useUIStore } from "../stores/useUIStore";
import axios from "axios";

interface ReviewFormProps {
  storeId: string;
  onReviewAdded: (review: StoreReview) => void;
  onCancel: () => void;
  user: User | null;
  initialReview?: StoreReview | null;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const ReviewForm: React.FC<ReviewFormProps> = ({
  storeId,
  onReviewAdded,
  onCancel,
  user,
  initialReview,
}) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { showSnackbar } = useUIStore();

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
      setUserName(initialReview.userName || (user ? user.username : ""));
      setPicture(initialReview.picture || "");
    } else if (user) {
      setUserName(user.username);
    }
  }, [user, initialReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating === 0) {
      showSnackbar("Por favor selecciona una calificación", "warning");
      return;
    }
    if (comment.trim().length === 0) {
      showSnackbar("Por favor escribe un comentario", "warning");
      return;
    }
    setIsSubmitting(true);

    try {
      const reviewData: Partial<NewReview> = {
        rating,
        comment: comment.trim(),
        ...(userName.trim() && { userName: userName.trim() }),
        ...(picture.trim() && { picture: picture.trim() }),
      };

      let result: StoreReview;

      if (initialReview) {
        // Editar existente
        result = await server.updateStoreReview(initialReview.id, reviewData);
        showSnackbar("Reseña actualizada con éxito", "success");
      } else {
        // Crear nueva
        const newReviewData = { ...reviewData, storeId } as NewReview;
        result = await server.createStoreReview(newReviewData);
        showSnackbar("Reseña agregada con éxito", "success");
      }

      onReviewAdded(result);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        showSnackbar(err.response.data.error, "error");
      } else {
        showSnackbar("Error al enviar la reseña", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onCancel}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {initialReview ? "Editar Reseña" : "Agregar Reseña"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="mt-4">
          <Typography component="legend">Calificación</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(_event, newValue) => {
              setRating(newValue);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Comentario"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nombre (opcional)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            margin="normal"
            fullWidth
            label="URL de imagen (opcional)"
            type="url"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            disabled={isSubmitting}
          />
          <Box className="mt-4 flex justify-end gap-2">
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : "Enviar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewForm;
