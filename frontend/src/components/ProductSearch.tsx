import React, { useState } from "react";
import server from "../services/server";
import type { StoreItem } from "../types/types";
import {
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Rating,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

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
    try {
      const results = await server.searchItems(query, sort);
      setItems(results);
      setSearched(true);
    } catch (error) {
      console.error(error);
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
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select value={sort} label="Ordenar por" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="price_asc">Precio: Menor a Mayor</MenuItem>
            <MenuItem value="price_desc">Precio: Mayor a Menor</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" startIcon={<SearchIcon />} size="large">
          Buscar
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.picture || "/images/placeholder-item.png"}
                  alt={item.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder-item.png";
                  }}
                  sx={{
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${item.price.toLocaleString()}
                  </Typography>
                  <Box mt={2} pt={2} borderTop="1px solid #444">
                    <Typography variant="subtitle2" color="text.secondary">
                      Vendido en:
                    </Typography>
                    <Link
                      to={`/store/${item.store.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ "&:hover": { textDecoration: "underline" } }}
                      >
                        {item.store.name}
                      </Typography>
                    </Link>
                    <Box display="flex" alignItems="center">
                      <Rating value={item.storeRating || 0} precision={0.5} readOnly size="small" />
                      <Typography variant="caption" ml={1}>
                        ({item.storeRating})
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {searched && items.length === 0 && (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No se encontraron productos.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default ProductSearch;
