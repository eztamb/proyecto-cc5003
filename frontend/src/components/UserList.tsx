import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../services/server";
import type { User } from "../types/types";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuthStore } from "../stores/useAuthStore";
import ConfirmDialog from "./ConfirmDialog";

const UserList: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await server.getAllUsers();
        setUsers(userList);
      } catch {
        setError("Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: "admin" | "reviewer") => {
    try {
      await server.updateUserRole(userId, newRole);
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      setError("Error al cambiar el rol del usuario");
    }
  };

  const handleDeleteClick = (id: string) => {
    setUserIdToDelete(id);
  };

  const confirmDeleteUser = async () => {
    if (!userIdToDelete) return;

    try {
      await server.deleteUser(userIdToDelete);
      setUsers(users.filter((u) => u.id !== userIdToDelete));
      setUserIdToDelete(null);
    } catch {
      setError("Error al eliminar el usuario");
      setUserIdToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" className="mt-4">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          Administrar Usuarios
        </Typography>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")}>
          Volver
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as "admin" | "reviewer")}
                    disabled={u.id === user?.id}
                  >
                    <MenuItem value="reviewer">Reviewer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteClick(u.id)}
                    disabled={u.id === user?.id}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={!!userIdToDelete}
        title="Eliminar Usuario"
        content="¿Estás seguro de que quieres eliminar este usuario? Perderá acceso al sistema."
        onClose={() => setUserIdToDelete(null)}
        onConfirm={confirmDeleteUser}
      />
    </Container>
  );
};

export default UserList;
