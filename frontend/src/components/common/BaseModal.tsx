import React, { type ReactNode } from "react";
import { Modal, Box, Typography } from "@mui/material";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: number | string;
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 400,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, maxWidth }}>
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default BaseModal;
