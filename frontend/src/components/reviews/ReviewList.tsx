import React from "react";
import { Grid, Paper, Box, Typography, Button, Rating } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { StoreReview, User } from "../../types/types";
import ImageWithFallback from "../common/ImageWithFallback";

interface ReviewListProps {
  reviews: StoreReview[];
  user: User | null;
  onDeleteClick: (id: string) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, user, onDeleteClick }) => {
  return (
    <Grid container spacing={3}>
      {reviews.map((review) => (
        <Grid item key={review.id} xs={12}>
          <Paper sx={{ p: 3, borderLeft: "4px solid", borderColor: "primary.main" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {review.userName || "Anónimo"}
              </Typography>
              {user && (user.role === "admin" || user.id === review.user.id) && (
                <Button size="small" color="error" onClick={() => onDeleteClick(review.id)}>
                  <DeleteIcon fontSize="small" />
                </Button>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Rating value={review.rating} readOnly size="small" />
              {review.updatedAt && review.createdAt && review.updatedAt > review.createdAt && (
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  (Editado: {new Date(review.updatedAt).toLocaleDateString()})
                </Typography>
              )}
            </Box>

            <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
              {review.comment}
            </Typography>

            {review.picture && (
              <Box sx={{ mt: 2, maxWidth: "200px" }}>
                <ImageWithFallback
                  type="review" // Usa placeholder-reviews.png si falla
                  src={review.picture}
                  alt={`Reseña de ${review.userName}`}
                  sx={{ borderRadius: "8px", width: "100%" }}
                />
              </Box>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReviewList;
