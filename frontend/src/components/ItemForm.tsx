import React, { useState } from "react";
import server from "../services/server";
import type { StoreItem, NewItem } from "../types/types";

interface ItemFormProps {
  storeId: string;
  onItemAdded: (item: StoreItem) => void;
  onCancel: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ storeId, onItemAdded, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [picture, setPicture] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const newItem: NewItem = {
      name,
      description,
      price,
      picture,
      storeId,
    };

    try {
      const addedItem = await server.createStoreItem(newItem);
      onItemAdded(addedItem);
    } catch {
      setError("Error al agregar el item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form">
        <div className="review-form-header">
          <h3>Agregar Item</h3>
          <button type="button" className="close-button" onClick={onCancel} disabled={loading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="picture">URL de la imagen</label>
            <input
              id="picture"
              type="text"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-buttons">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Agregando..." : "Agregar Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
