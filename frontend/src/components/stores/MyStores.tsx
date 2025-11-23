import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuthStore } from "../../stores/useAuthStore";
import server from "../../services/server";
import type { StoreWithRating } from "../../types/types";
import StoreCard from "./StoreCard";

const MyStores: React.FC = () => {
  const { user } = useAuthStore();
  const [stores, setStores] = useState<StoreWithRating[]>([]);

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
            <StoreCard store={store} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default MyStores;
