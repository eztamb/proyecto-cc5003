import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardActionArea, CardContent, Typography, Box, Chip, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { StoreWithRating } from "../../types/types";
import ImageWithFallback from "../common/ImageWithFallback";

interface StoreCardProps {
  store: StoreWithRating;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", width: "100%" }}>
      <CardActionArea
        onClick={() => navigate(`/store/${store.id}`)}
        sx={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "flex-start" }}
      >
        <ImageWithFallback
          type="store"
          src={store.images[0]}
          alt={store.name}
          sx={{
            objectFit: "cover",
            width: "100%",
            height: "300px",
          }}
        />
        <CardContent sx={{ flexGrow: 1, width: "100%" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography gutterBottom variant="h5" component="div">
              {store.name}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {store.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              {store.location}
            </Typography>
          </Box>

          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            {/* Contenedor para Categoría y Junaeb */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Chip label={store.storeCategory} size="small" variant="outlined" />
              {store.junaeb && (
                <Chip
                  label="Junaeb"
                  size="small"
                  color="success"
                  variant="filled"
                  sx={{ fontWeight: "bold", color: "white" }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating value={store.averageRating || 0} precision={0.1} readOnly size="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                ({store.averageRating?.toFixed(1) || "0.0"})
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default StoreCard;
