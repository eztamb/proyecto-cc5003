import React from "react";
import { Button, CircularProgress, type ButtonProps } from "@mui/material";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({ loading, children, disabled, ...props }) => {
  return (
    <Button disabled={loading || disabled} {...props}>
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default LoadingButton;
