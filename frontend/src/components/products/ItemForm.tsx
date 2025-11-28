import React, { useState, useEffect } from "react";
import { Box, TextField, Button } from "@mui/material";
import server from "../../services/server";
import type { StoreItem, NewItem } from "../../types/types";
import { useUIStore } from "../../stores/useUIStore";
import BaseModal from "../common/BaseModal";
import { getErrorMessage } from "../../utils/errorUtils";
import LoadingButton from "../common/LoadingButton";

interface ItemFormProps {
  storeId: string;
  onItemSaved: (item: StoreItem) => void;
  onCancel: () => void;
  initialItem?: StoreItem | null;
}

const ItemForm: React.FC<ItemFormProps> = ({ storeId, onItemSaved, onCancel, initialItem }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    picture: "",
  });

  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useUIStore();

  useEffect(() => {
    if (initialItem) {
      setFormData({
        name: initialItem.name,
        description: initialItem.description,
        price: initialItem.price,
        picture: initialItem.picture || "",
      });
    }
  }, [initialItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemPayload: NewItem = {
      ...formData,
      storeId,
    };

    try {
      let savedItem: StoreItem;
      if (initialItem) {
        // Update
        savedItem = await server.updateStoreItem(initialItem.id, itemPayload);
        showSnackbar("Item actualizado con éxito", "success");
      } else {
        // Create
        savedItem = await server.createStoreItem(itemPayload);
        showSnackbar("Item agregado con éxito", "success");
      }
      onItemSaved(savedItem);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={true} onClose={onCancel} title={initialItem ? "Editar Item" : "Agregar Item"}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          name="name"
          margin="normal"
          required
          fullWidth
          label="Nombre"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          name="description"
          margin="normal"
          required
          fullWidth
          label="Descripción"
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          name="price"
          margin="normal"
          required
          fullWidth
          label="Precio"
          type="number"
          value={formData.price}
          onChange={handleChange}
          disabled={loading}
        />
        <TextField
          name="picture"
          margin="normal"
          fullWidth
          label="URL de la imagen"
          value={formData.picture}
          onChange={handleChange}
          disabled={loading}
        />
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <LoadingButton type="submit" variant="contained" loading={loading}>
            {initialItem ? "Guardar Cambios" : "Agregar Item"}
          </LoadingButton>
        </Box>
      </Box>
    </BaseModal>
  );
};

export default ItemForm;
