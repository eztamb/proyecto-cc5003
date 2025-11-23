import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Divider,
} from "@mui/material";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { signup, login } = useAuthStore();

  const handleGuestLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      await signup({ username, password });
      await login({ username, password });

      navigate("/");
    } catch (err: unknown) {
      const isAxiosLikeError = (error: unknown): error is { response: { status?: number } } =>
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object";

      if (isAxiosLikeError(err) && err.response.status === 400) {
        setError("El nombre de usuario ya existe");
      } else {
        setError("Error al crear la cuenta. Intenta de nuevo.");
      }
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
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
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirmar Contraseña"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Alert severity="error" className="w-full mt-2">
              {error}
            </Alert>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
          </Button>
          <Link component={RouterLink} to="/login" variant="body2">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </Link>
          <Divider sx={{ my: 2 }}>O</Divider>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGuestLogin}
            disabled={loading}
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
