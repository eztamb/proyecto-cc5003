import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import auth from "../services/auth";
import type { User } from "../types/types";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";

interface LoginProps {
  setUser: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const loggedInUser = await auth.login({ username, password });
      setUser(loggedInUser);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && (
            <Alert severity="error" className="w-full mt-2">
              {error}
            </Alert>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
          </Button>
          <Link component={RouterLink} to="/signup" variant="body2">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
