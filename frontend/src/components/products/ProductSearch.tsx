import React, { useState, useEffect } from "react";
import { TextField, Box, Select, MenuItem, FormControl, InputLabel, Alert } from "@mui/material";
import ProductCard from "./ProductCard";
import PageLoader from "../common/PageLoader";
import { DataGrid } from "../common/DataGrid";
import { useProductStore } from "../../stores/useProductStore";
import type { SelectChangeEvent } from "@mui/material";
import { useDebounce } from "../../hooks/useDebounce";
import PageHeader from "../common/PageHeader";

const ProductSearch: React.FC = () => {
  const { items, loading, error, hasSearched, filters, searchItems, setQuery, setSort } =
    useProductStore();

  const [localQuery, setLocalQuery] = useState(filters.query);
  const debouncedQuery = useDebounce(localQuery, 500);

  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery, setQuery]);

  useEffect(() => {
    searchItems();
  }, [filters.query, filters.sort, searchItems]);

  useEffect(() => {
    setLocalQuery(filters.query);
  }, [filters.query]);

  const handleSortChange = (e: SelectChangeEvent<string>) => {
    setSort(e.target.value);
  };

  return (
    <Box>
      <PageHeader title="Busca un Producto" />

      <Box sx={{ my: 4, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          label="Nombre del producto (ej: Monster, Empanada)"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select value={filters.sort} label="Ordenar por" onChange={handleSortChange}>
            <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
            <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <PageLoader />
      ) : hasSearched || items.length > 0 ? (
        <DataGrid
          items={items}
          renderItem={(item) => <ProductCard item={item} showStoreInfo={true} />}
          emptyMessage="No se encontraron productos."
        />
      ) : null}
    </Box>
  );
};

export default ProductSearch;
