import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import server from "../services/server";
import auth from "../services/auth";
import type { StoreWithRating, User } from "../types/types";

interface StoreListProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const StoreList: React.FC<StoreListProps> = ({ user, setUser }) => {
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

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    navigate("/");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🌯🍝🍟 BeaucheFoods 🥗🍔🍕</h1>
        {user ? (
          <div>
            <span>
              Hola, {user.username} ({user.role})
            </span>
            <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
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
