import React, { useState } from "react";
import server from "../services/server";
import type { StoreItem, NewItem } from "../types/types";
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material";

interface ItemFormProps {
  storeId: string;
  onItemAdded: (item: StoreItem) => void;
  onCancel: () => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

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
    <Modal open onClose={onCancel}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Agregar Item
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="mt-4">
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
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Precio"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            disabled={loading}
          />
          <TextField
            margin="normal"
            fullWidth
            label="URL de la imagen"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Alert severity="error" className="mt-2">
              {error}
            </Alert>
          )}
          <Box className="mt-4 flex justify-end gap-2">
            <Button onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Agregar Item"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ItemForm;
