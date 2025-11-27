import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import { useAuthStore } from "../../stores/useAuthStore";
import { useShopStore } from "../../stores/useStoreStore";
import StoreCard from "./StoreCard";
import PageHeader from "../common/PageHeader";
import PageLoader from "../common/PageLoader";
import { DataGrid } from "../common/DataGrid";
import { useDebounce } from "../../hooks/useDebounce";

const CATEGORIES = [
  "all",
  "Cafetería",
  "Restaurante",
  "Food Truck",
  "Máquina Expendedora",
  "Minimarket",
  "Otro",
];

const StoreList: React.FC = () => {
  const { user } = useAuthStore();
  const { stores, loading, error, filters, fetchStores, setSearch, setCategory } = useShopStore();
  const [localSearchTerm, setLocalSearchTerm] = useState(filters.search);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500);

  useEffect(() => {
    setSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearch]);

  useEffect(() => {
    fetchStores();
  }, [filters.search, filters.category, fetchStores]);

  useEffect(() => {
    setLocalSearchTerm(filters.search);
  }, [filters.search]);

  return (
    <Box>
      <PageHeader
        title="Tiendas Disponibles"
        actionLabel={user?.role === "admin" ? "Agregar Tienda" : undefined}
        actionLink="/new-store"
      />

      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Buscar tienda..."
          variant="outlined"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={filters.category}
            label="Categoría"
            onChange={(e: SelectChangeEvent) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat === "all" ? "Todas" : cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          items={stores}
          emptyMessage="No se encontraron tiendas con los filtros aplicados."
          renderItem={(store) => <StoreCard store={store} />}
        />
      )}
    </Box>
  );
};

export default StoreList;
