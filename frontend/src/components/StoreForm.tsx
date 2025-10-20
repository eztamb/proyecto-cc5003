import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import server from "../services/server";
import type { NewStore } from "../types/types";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

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
    <Container component="main" maxWidth="sm">
      <Box className="mt-8 flex flex-col items-center">
        <Typography component="h1" variant="h4">
          {storeId ? "Editar Tienda" : "Agregar Tienda"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="w-full mt-4">
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Descripción"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Ubicación"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Categoría"
            value={storeCategory}
            onChange={(e) => setStoreCategory(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Imágenes (URL separadas por comas)"
            value={images.join(",")}
            onChange={(e) => setImages(e.target.value.split(","))}
            disabled={loading}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={junaeb}
                onChange={(e) => setJunaeb(e.target.checked)}
                disabled={loading}
              />
            }
            label="Acepta Junaeb"
          />
          {error && (
            <Alert severity="error" className="w-full mt-2">
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="mt-4 mb-2"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Guardar Tienda"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StoreForm;
