import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import server from "../services/server";
import type { StoreWithRating } from "../types/types";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const MyStores: React.FC = () => {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<StoreWithRating[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      server.getStoresWithAverageRating({ owner: user.id }).then(setStores);
    }
  }, [user]);

  return (
    <Container sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Mis Tiendas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/new-store">
          Nueva Tienda
        </Button>
      </Box>

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} sm={6} md={4} key={store.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/store/${store.id}`)}>
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
    </Container>
  );
};

export default MyStores;
