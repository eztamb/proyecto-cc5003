import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Typography, Button, Rating, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { StoreWithDetails } from "../../types/types";

interface StoreHeroProps {
  store: StoreWithDetails;
}

const StoreHero: React.FC<StoreHeroProps> = ({ store }) => {
  const navigate = useNavigate();

  // Lógica simple para manejar el background image sin usar el componente img directamente
  // pero usando la misma lógica de fallback si la url falla o está vacía.
  const bgImage = store.images && store.images[0] ? store.images[0] : "/images/placeholder.png";

  return (
    <Box sx={{ position: "relative", height: { xs: 300, md: 400 }, color: "white" }}>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Overlay oscuro para mejorar legibilidad del texto */}
      <Box
        sx={{ position: "absolute", width: "100%", height: "100%", bgcolor: "rgba(0,0,0,0.6)" }}
      />

      <Container
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          py: 4,
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ position: "absolute", top: 16, left: 16 }}
        >
          Volver
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Typography
            variant="h2"
            component="h1"
            fontWeight="bold"
            sx={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            {store.name}
          </Typography>

          {store.junaeb && (
            <Chip
              label="Acepta Junaeb"
              color="success"
              sx={{ color: "white", fontWeight: "bold", boxShadow: 2 }}
            />
          )}
        </Box>

        <Typography variant="h6" sx={{ mb: 1, textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>
          {store.description}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Rating value={store.averageRating} precision={0.1} readOnly />
          <Typography sx={{ ml: 1.5, fontWeight: "bold" }}>
            {store.averageRating.toFixed(1)} ({store.reviews.length} reseñas)
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default StoreHero;
