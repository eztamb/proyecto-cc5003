import React from "react";
import { Card, CardContent, Typography, Box, Rating, IconButton, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageWithFallback from "../common/ImageWithFallback";
import type { StoreItem } from "../../types/types";

interface ProductCardProps {
  item: StoreItem;
  showStoreInfo?: boolean;
  onEdit?: (item: StoreItem) => void;
  onDelete?: (itemId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  item,
  showStoreInfo = false,
  onEdit,
  onDelete,
}) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <ImageWithFallback
        type="item"
        src={item.picture}
        alt={item.name}
        sx={{ objectFit: "cover", width: "100%", height: "220px" }}
      />

      {/* Action Buttons Overlay (Admin/Seller) */}
      {(onEdit || onDelete) && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "rgba(0,0,0,0.6)",
            borderRadius: 1,
            p: 0.5,
          }}
        >
          {onEdit && (
            <IconButton size="small" onClick={() => onEdit(item)} sx={{ color: "white" }}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {onDelete && (
            <IconButton size="small" onClick={() => onDelete(item.id)} sx={{ color: "#ff8888" }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      )}

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
