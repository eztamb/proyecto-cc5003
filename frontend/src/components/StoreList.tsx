import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../services/server";
import type { StoreWithRating } from "../types/types";

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">
            ★
          </span>
        ))}
        {hasHalf && <span className="star half">⭑</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">
            ☆
          </span>
        ))}
      </>
    );
  };

  const handleStoreSelect = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await server.getStoresWithAverageRating();
        setStores(data);
      } catch {
        setError("Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return <div className="loading">Loading stores...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="store-list-container">
      <h1>🌯🍝🍟 BeaucheFoods 🥗🍔🍕</h1>
      <ul className="store-list">
        {stores.map((store) => (
          <li
            key={store.id}
            className="store-item"
            onClick={() => handleStoreSelect(store.id)}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleStoreSelect(store.id);
              }
            }}
          >
            <img
              src={store.images[0]}
              className="image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.png";
              }}
            />
            <h2>{store.name}</h2>
            {store.description && <p>{store.description}</p>}
            <p className="location"> 📍 Ubicación: {store.location}</p>
            <p className="category">Tipo: {store.storeCategory}</p>
            <p className={store.junaeb ? "junaeb" : ""}>
              {store.junaeb ? "Acepta Junaeb" : "No Acepta Junaeb 😔"}
            </p>
            <div className="rating">
              <span
                className="stars"
                role="img"
                aria-label={`Rating: ${store.averageRating} out of 5`}
              >
                {renderStars(store.averageRating)}
              </span>
              <span className="numeric-rating">{store.averageRating.toFixed(1)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoreList;
