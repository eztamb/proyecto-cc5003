import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import server from "../services/server";
import auth from "../services/auth";
import type { StoreWithRating, User } from "../types/types";
import {
  Container,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Grid,
  Rating,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface StoreListProps {
  user: User | null;
  setUser: (user: User | null) => void;
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

const StoreList: React.FC<StoreListProps> = ({ user, setUser }) => {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce delay
  const navigate = useNavigate();

  const handleStoreSelect = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    navigate("/"); // Redirect to home after logout might be better
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value);
  };

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: debouncedSearchTerm || undefined,
      };
      const data = await server.getStoresWithAverageRating(filters);
      setStores(data);
    } catch (err) {
      console.error("Failed to load stores:", err);
      setError("Error al cargar las tiendas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearchTerm]); // Dependencies for useCallback

  useEffect(() => {
    fetchStores();
  }, [fetchStores]); // useEffect depends on the memoized fetchStores function

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.paper", borderBottom: "1px solid #684a4aff" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/favicon.png"
              alt="BeaucheFoods logo"
              style={{ height: "32px", marginRight: "10px" }}
            />
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

        {/* Filter and Search Bar */}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <TextField
            label="Buscar tienda..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="category-filter-label">Categoría</InputLabel>
            <Select
              labelId="category-filter-label"
              value={selectedCategory}
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
              <Grid item key={store.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardActionArea onClick={() => handleStoreSelect(store.id)}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={store.images[0] || "/images/placeholder.png"}
                      alt={store.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {store.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {store.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {store.location}
                        </Typography>
                      </Box>
                      <Chip label={store.storeCategory} size="small" sx={{ mb: 2 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: store.junaeb ? "#68d391" : "#fc8181", fontWeight: "medium" }}
                      >
                        {store.junaeb ? "Acepta Junaeb" : "No Acepta Junaeb"}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: "auto", pt: 2 }}>
                        <Rating
                          name="read-only"
                          value={store.averageRating}
                          precision={0.5}
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          {store.averageRating != null ? store.averageRating.toFixed(1) : "N/A"}
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
