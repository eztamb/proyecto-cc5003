import React, { type ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
  actionLink?: string;
  onActionClick?: () => void;
  actionIcon?: ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  actionLabel,
  actionLink,
  onActionClick,
  actionIcon,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
      <Typography variant="h4" component="h1">
        {title}
      </Typography>
      {actionLabel && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          component={actionLink ? Link : "button"}
          to={actionLink ? actionLink : undefined}
          onClick={onActionClick}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
