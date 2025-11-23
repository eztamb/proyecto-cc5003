import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useShopStore } from "../stores/useStoreStore";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  type SelectChangeEvent,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const categories = [
  "all",
  "Cafetería",
  "Restaurante",
  "Food Truck",
  "Máquina Expendedora",
  "Minimarket",
  "Otro",
];

const StoreList: React.FC = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();

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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const handleStoreSelect = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.paper", borderBottom: "1px solid #684a4aff" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src="/favicon.png" alt="Logo" style={{ height: "32px", marginRight: "10px" }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              BeaucheFoods
            </Typography>
          </Box>

          {user ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {user.role === "admin" && (
                <Button color="inherit" component={Link} to="/users" sx={{ mr: 1 }}>
                  Administrar Usuarios
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout} sx={{ mr: 2 }}>
                Logout
              </Button>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                <Typography component="span">
                  {user.username} ({user.role})
                </Typography>
              </Box>
            </Box>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tiendas Disponibles
          </Typography>
          {user?.role === "admin" && (
            <Button variant="contained" component={Link} to="/new-store">
              Agregar Tienda
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            label="Buscar tienda..."
            variant="outlined"
            fullWidth
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-filter-label">Categoría</InputLabel>
            <Select
              labelId="category-filter-label"
              value={filters.category}
              label="Categoría"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category === "all" ? "Todas" : category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : stores.length === 0 ? (
          <Typography>No se encontraron tiendas con los filtros aplicados.</Typography>
        ) : (
          <Grid container spacing={4}>
            {stores.map((store) => (
              <Grid item key={store.id} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
                {" "}
                <Card
                  sx={{ height: "100%", display: "flex", flexDirection: "column", width: "100%" }}
                >
                  {" "}
                  <CardActionArea
                    onClick={() => handleStoreSelect(store.id)}
                    sx={{ display: "flex", flexDirection: "column", height: "100%" }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={store.images[0] || "/images/placeholder.png"}
                      alt={store.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/placeholder.png";
                      }}
                      sx={{
                        flexShrink: 0,
                        objectFit: "cover",
                        height: "200px",
                        width: "100%",
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                      <Typography gutterBottom variant="h5">
                        {store.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {store.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{store.location}</Typography>
                      </Box>
                      <Chip label={store.storeCategory} size="small" sx={{ mt: 1 }} />
                      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                        <Rating value={store.averageRating} precision={0.5} readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {store.averageRating?.toFixed(1)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default StoreList;
