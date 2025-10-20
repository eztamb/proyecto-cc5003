import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface StoreListProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const StoreList: React.FC<StoreListProps> = ({ user, setUser }) => {
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStoreSelect = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await server.getStoresWithAverageRating();
        setStores(data);
      } catch {
        setError("Failed to load stores");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.paper", borderBottom: "1px solid #684a4aff" }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            BeaucheFoods
          </Typography>
          {user ? (
            <Box>
              <Typography component="span" sx={{ mr: 2 }}>
                Hola, {user.username} ({user.role})
              </Typography>
              {user.role === "admin" && (
                <Button color="inherit" component={Link} to="/users">
                  Administrar Usuarios
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
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

        {stores.length === 0 ? (
          <Typography>No hay tiendas disponibles en este momento.</Typography>
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
                          {store.averageRating.toFixed(1)}
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
