import React, { useState, useEffect } from "react";
import server from "../services/server";
import type { StoreReview, User } from "../types/types";

interface ReviewFormProps {
  storeId?: string;
  onReviewAdded: (review: StoreReview) => void;
  onCancel: () => void;
  user: User | null;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ storeId, onReviewAdded, onCancel, user }) => {
  const [rating, setRating] = useState<number>(0);
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

  if (!storeId) {
    return;
  }

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
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

  const renderStars = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-button ${star <= rating ? "selected" : ""}`}
            onClick={() => handleStarClick(star)}
            disabled={isSubmitting}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form">
        <div className="review-form-header">
          <h3>Agregar Reseña</h3>
          <button type="button" className="close-button" onClick={onCancel} disabled={isSubmitting}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="rating">Calificación *</label>
            {renderStars()}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comentario *</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia..."
              rows={4}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userName">Nombre (opcional)</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="picture">URL de imagen (opcional)</label>
            <input
              type="url"
              id="picture"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {error && <div>{error}</div>}

          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Reseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
