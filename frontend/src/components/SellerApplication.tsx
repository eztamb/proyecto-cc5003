import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import server from "../services/server";
import { useUIStore } from "../stores/useUIStore";
import { useNavigate } from "react-router-dom";

const SellerApplication: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { showSnackbar } = useUIStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await server.createSellerRequest({ fullName, rut, email, description });
      showSnackbar("Solicitud enviada con éxito. Espera la aprobación.", "success");
      navigate("/");
    } catch {
      const msg = "Error al enviar la solicitud";
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          ¡Solicita ser Vendedor!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Nombre Completo"
            margin="normal"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            fullWidth
            label="RUT"
            margin="normal"
            required
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <TextField
            fullWidth
            label="Correo de Contacto"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Cuéntanos de ti y tu negocio"
            multiline
            rows={4}
            margin="normal"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            Solicitar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SellerApplication;
