import React, { useState, useEffect } from "react";
import server from "../services/server";
import type { StoreReview, User } from "../types/types";
import {
  Modal,
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

interface ReviewFormProps {
  storeId?: string;
  onReviewAdded: (review: StoreReview) => void;
  onCancel: () => void;
  user: User | null;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ReviewForm: React.FC<ReviewFormProps> = ({ storeId, onReviewAdded, onCancel, user }) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [picture, setPicture] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserName(user.username);
    }
  }, [user]);

  if (!storeId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }
    if (comment.trim().length === 0) {
      setError("Por favor escribe un comentario");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const reviewData = {
        storeId,
        rating,
        comment: comment.trim(),
        ...(userName.trim() && { userName: userName.trim() }),
        ...(picture.trim() && { picture: picture.trim() }),
      };
      const newReview = await server.createStoreReview(reviewData);
      onReviewAdded(newReview);
    } catch {
      setError("Error al enviar la reseña. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onCancel}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Agregar Reseña
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="mt-4">
          <Typography component="legend">Calificación</Typography>
          <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue) => {
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
          {error && (
            <Alert severity="error" className="mt-2">
              {error}
            </Alert>
          )}
          <Box className="mt-4 flex justify-end gap-2">
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} /> : "Enviar Reseña"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ReviewForm;
