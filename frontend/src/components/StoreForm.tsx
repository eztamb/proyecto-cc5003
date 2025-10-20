import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import server from "../services/server";
import type { NewStore } from "../types/types";

const StoreForm: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [junaeb, setJunaeb] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storeId) {
      const fetchStore = async () => {
        try {
          const store = await server.getStoreById(storeId);
          setName(store.name);
          setDescription(store.description);
          setLocation(store.location);
          setStoreCategory(store.storeCategory);
          setImages(store.images);
          setJunaeb(store.junaeb);
        } catch {
          setError("Error al cargar la tienda");
        }
      };
      fetchStore();
    }
  }, [storeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const storeData: NewStore = {
      name,
      description,
      location,
      storeCategory,
      images,
      junaeb,
    };

    try {
      if (storeId) {
        await server.updateStore(storeId, storeData);
      } else {
        await server.createStore(storeData);
      }
      navigate("/");
    } catch {
      setError("Error al guardar la tienda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{storeId ? "Editar Tienda" : "Agregar Tienda"}</h1>
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
            <label htmlFor="location">Ubicación</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="storeCategory">Categoría</label>
            <input
              id="storeCategory"
              type="text"
              value={storeCategory}
              onChange={(e) => setStoreCategory(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="images">Imágenes (URL separadas por comas)</label>
            <input
              id="images"
              type="text"
              value={images.join(",")}
              onChange={(e) => setImages(e.target.value.split(","))}
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={junaeb}
                onChange={(e) => setJunaeb(e.target.checked)}
                disabled={loading}
              />
              Acepta Junaeb
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Guardando..." : "Guardar Tienda"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;
