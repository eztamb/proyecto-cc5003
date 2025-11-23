import React, { useState } from "react";
import server from "../../services/server";
import type { StoreItem } from "../../types/types";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "./ProductCard";
import PageLoader from "../common/PageLoader";
import { DataGrid } from "../common/DataGrid";
import { getErrorMessage } from "../../utils/errorUtils";

const ProductSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("price_asc");
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);

    try {
      const results = await server.searchItems(query, sort);
      setItems(results);
      setSearched(true);
    } catch (error) {
      console.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Busca un Producto
      </Typography>

      <Box component="form" onSubmit={handleSearch} sx={{ my: 4, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          label="Nombre del producto (ej: Monster, Empanada)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select value={sort} label="Ordenar por" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
            <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
          </Select>
        </FormControl>
        <Button
          sx={{ minWidth: 120 }}
          type="submit"
          variant="contained"
          startIcon={<SearchIcon />}
          size="large"
        >
          Buscar
        </Button>
      </Box>

      {loading ? (
        <PageLoader />
      ) : searched ? (
        <DataGrid
          items={items}
          renderItem={(item) => <ProductCard item={item} showStoreInfo={true} />}
          emptyMessage="No se encontraron productos."
        />
      ) : null}
    </Container>
  );
};

export default ProductSearch;
