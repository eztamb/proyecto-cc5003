import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Container, Box, TextField, Button, Typography, Link, Divider } from "@mui/material";
import { useAuthStore } from "../../stores/useAuthStore";
import { useUIStore } from "../../stores/useUIStore";
import LoadingButton from "../common/LoadingButton";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showSnackbar } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ username, password });
      showSnackbar("Inicio de sesión exitoso", "success");
      navigate("/");
    } catch {
      showSnackbar("Usuario o contraseña incorrectos", "error");
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 2 }}
            loading={isSubmitting}
          >
            Iniciar Sesión
          </LoadingButton>

          <Link component={RouterLink} to="/signup" variant="body2">
            ¿No tienes cuenta? Regístrate aquí
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

export default Login;
