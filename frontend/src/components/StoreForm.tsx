import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import server from "../services/server";
import type { NewStore } from "../types/types";
import { useUIStore } from "../stores/useUIStore";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  type SelectChangeEvent,
} from "@mui/material";

const categories = [
  "Cafetería",
  "Restaurante",
  "Food Truck",
  "Máquina Expendedora",
  "Minimarket",
  "Otro",
];

const StoreForm: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { showSnackbar } = useUIStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [junaeb, setJunaeb] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (storeId) {
      setLoading(true);
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
          showSnackbar("Error al cargar los datos de la tienda", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchStore();
    }
  }, [storeId, showSnackbar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const storeData: NewStore = {
      name,
      description,
      location,
      storeCategory,
      images: images.map((img) => img.trim()).filter((img) => img !== ""),
      junaeb,
    };

    try {
      if (storeId) {
        await server.updateStore(storeId, storeData);
        showSnackbar("Tienda actualizada con éxito", "success");
      } else {
        await server.createStore(storeData);
        showSnackbar("Tienda creada con éxito", "success");
      }
      navigate("/");
    } catch {
      showSnackbar("Error al guardar la tienda", "error");
      setLoading(false);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setStoreCategory(event.target.value as string);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box className="mt-8 flex flex-col items-center">
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
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
          <FormControl fullWidth margin="normal" required disabled={loading}>
            <InputLabel id="category-select-label">Categoría</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={storeCategory}
              label="Categoría"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            fullWidth
            label="Imágenes (URL separadas por comas)"
            value={images.join(",")}
            onChange={(e) => setImages(e.target.value.split(",").map((s) => s.trim()))}
            disabled={loading}
            helperText="Separe múltiples URLs con comas."
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
            sx={{ display: "block", mt: 1 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="mt-4 mb-2"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Guardar Tienda"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={loading}
            sx={{ mb: 4 }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default StoreForm;
