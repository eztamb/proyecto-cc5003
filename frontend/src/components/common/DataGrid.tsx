import { Grid, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface DataGridProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string;
}

export const DataGrid = <T extends { id: string | number }>({
  items,
  renderItem,
  emptyMessage = "No se encontraron datos.",
}: DataGridProps<T>) => {
  if (items.length === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography align="center" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item.id}>
          {renderItem(item)}
        </Grid>
      ))}
    </Grid>
  );
};
