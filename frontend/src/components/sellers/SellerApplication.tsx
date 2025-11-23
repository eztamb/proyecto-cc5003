import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Paper } from "@mui/material";
import server from "../../services/server";
import { useUIStore } from "../../stores/useUIStore";
import { useNavigate } from "react-router-dom";
import { formatRut, validateRut, validateEmail } from "../../utils/validation";

const SellerApplication: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Estado para errores
  const [errors, setErrors] = useState({
    fullName: "",
    rut: "",
    email: "",
    description: "",
  });

  const { showSnackbar } = useUIStore();
  const navigate = useNavigate();

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Formatear mientras escribe
    const formatted = formatRut(e.target.value);
    setRut(formatted);
    // Limpiar error si empieza a corregir
    if (errors.rut) setErrors({ ...errors, rut: "" });
  };

  const validateForm = () => {
    const newErrors = { fullName: "", rut: "", email: "", description: "" };
    let isValid = true;

    if (fullName.trim().length < 5) {
      newErrors.fullName = "El nombre debe tener al menos 5 caracteres.";
      isValid = false;
    }

    if (!validateRut(rut)) {
      newErrors.rut = "RUT inválido.";
      isValid = false;
    }

    if (!validateEmail(email)) {
      newErrors.email = "Correo electrónico inválido.";
      isValid = false;
    }

    if (description.trim().length < 20) {
      newErrors.description = "La descripción es muy corta (mínimo 20 caracteres).";
      isValid = false;
    } else if (description.length > 500) {
      newErrors.description = "La descripción no puede exceder 500 caracteres.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showSnackbar("Por favor corrige los errores antes de enviar.", "warning");
      return;
    }

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
            error={!!errors.fullName}
            helperText={errors.fullName}
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            fullWidth
            label="RUT"
            margin="normal"
            required
            value={rut}
            onChange={handleRutChange}
            error={!!errors.rut}
            helperText={errors.rut || "Formato: 12.345.678-9"}
            inputProps={{ maxLength: 12 }}
          />
          <TextField
            fullWidth
            label="Correo de Contacto"
            type="email"
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
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
            error={!!errors.description}
            helperText={errors.description || `${description.length}/500 caracteres`}
            inputProps={{ maxLength: 500 }}
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
