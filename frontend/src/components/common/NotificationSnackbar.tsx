import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useUIStore } from "../../stores/useUIStore";

const NotificationSnackbar: React.FC = () => {
  const { snackbar, hideSnackbar } = useUIStore();

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={hideSnackbar}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={hideSnackbar}
        severity={snackbar.severity}
        variant="filled"
        elevation={6}
        sx={{
          width: "100%",
          color: "#fff",
          "& .MuiAlert-icon": {
            color: "#fff",
          },
        }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
