import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
import { useAuthStore } from "../stores/useAuthStore";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);

  const handleGuestLogin = () => {
    // No necesitamos hacer nada en el store, user ya es null por defecto
    navigate("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ username, password }); // Usar acción del store
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box className="mt-8 flex flex-col items-center text-center">
        <Typography component="h1" variant="h4" className="font-bold">
          🌯 Iniciar Sesión
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
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
          {error && (
            <Alert severity="error" className="w-full mt-2">
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
          </Button>
          <Link component={RouterLink} to="/signup" variant="body2">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
          <Divider sx={{ my: 2 }}>O</Divider>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGuestLogin}
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

export default Login;
