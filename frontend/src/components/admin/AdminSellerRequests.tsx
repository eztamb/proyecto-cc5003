import React, { useCallback, useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import server from "../../services/server";
import type { SellerRequest } from "../../types/types";
import { useUIStore } from "../../stores/useUIStore";

const AdminSellerRequests: React.FC = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const { showSnackbar } = useUIStore();

  const loadRequests = useCallback(async () => {
    try {
      const data = await server.getSellerRequests();
      setRequests(data);
    } catch {
      showSnackbar("Error al cargar solicitudes", "error");
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    try {
      await server.updateSellerRequestStatus(id, status);
      showSnackbar(`Solicitud ${status === "approved" ? "aprobada" : "rechazada"}`, "success");
      loadRequests(); // Recargar lista
    } catch {
      showSnackbar("Error al procesar la solicitud", "error");
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Solicitudes de Vendedor
      </Typography>
      <Paper sx={{ my: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>RUT</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay solicitudes pendientes
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.user.username}</TableCell>
                  <TableCell>{req.fullName}</TableCell>
                  <TableCell>{req.rut}</TableCell>
                  <TableCell>{req.email}</TableCell>
                  <TableCell>{req.description}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAction(req.id, "approved")}
                      >
                        <CheckIcon />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        <CloseIcon />
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminSellerRequests;
