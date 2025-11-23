import React from "react";
import { Box, CircularProgress } from "@mui/material";

const PageLoader: React.FC = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      width: "100%",
    }}
  >
    <CircularProgress />
  </Box>
);

export default PageLoader;
