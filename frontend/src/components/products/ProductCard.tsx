import React from "react";
import { Card, CardContent, Typography, Box, Rating } from "@mui/material";
import { Link } from "react-router-dom";
import ImageWithFallback from "../common/ImageWithFallback";
import type { StoreItem } from "../../types/types";

interface ProductCardProps {
  item: StoreItem;
  showStoreInfo?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, showStoreInfo = false }) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ImageWithFallback
        type="item"
        height="200"
        src={item.picture}
        alt={item.name}
        sx={{ objectFit: "cover", width: "100%" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div">
          {item.name}
        </Typography>

        {!showStoreInfo && item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {item.description}
          </Typography>
        )}

        <Typography variant="h5" color="primary" fontWeight="bold">
          ${item.price.toLocaleString("es-cl")}
        </Typography>

        {showStoreInfo && (
          <Box mt={2} pt={2} borderTop="1px solid #444">
            <Typography variant="subtitle2" color="text.secondary">
              Vendido en:
            </Typography>
            <Link
              to={`/store/${item.store.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography variant="subtitle1" sx={{ "&:hover": { textDecoration: "underline" } }}>
                {item.store.name}
              </Typography>
            </Link>
            {item.storeRating !== undefined && (
              <Box display="flex" alignItems="center">
                <Rating value={item.storeRating} precision={0.1} readOnly size="small" />
                <Typography variant="caption" ml={1}>
                  ({item.storeRating})
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
