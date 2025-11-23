import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Link, Divider } from "@mui/material";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import LoadingButton from "../common/LoadingButton";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { signup, login } = useAuthStore();
  const { showSnackbar } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError("");
    setPasswordError("");

    let valid = true;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (username.length < 3) {
      setUsernameError("El usuario debe tener al menos 3 caracteres.");
      valid = false;
    } else if (!usernameRegex.test(username)) {
      setUsernameError("El usuario solo puede contener letras, números y guiones bajos.");
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      valid = false;
    }

    if (password !== confirmPassword) {
      showSnackbar("Las contraseñas no coinciden", "warning");
      return;
    }

    if (!valid) return;

    setIsSubmitting(true);

    try {
      await signup({ username, password });
      await login({ username, password });
      showSnackbar("Cuenta creada con éxito", "success");
      navigate("/");
    } catch {
      showSnackbar("Error al crear la cuenta.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="mt-8 flex flex-col items-center text-center">
        <Typography component="h1" variant="h4" className="font-bold">
          🍔 Crear Cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="w-full mt-4">
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            error={!!passwordError}
            helperText={passwordError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isSubmitting}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 2 }}
            loading={isSubmitting}
          >
            Registrarse
          </LoadingButton>

          <Link component={RouterLink} to="/login" variant="body2">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Link>
          <Divider sx={{ my: 2 }}>O</Divider>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              navigate("/");
              showSnackbar("Bienvenido, invitado", "info");
            }}
            disabled={isSubmitting}
            sx={{ mb: 4 }}
          >
            Continuar como invitado
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
