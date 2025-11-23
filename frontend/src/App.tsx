import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import StoreList from "./components/StoreList";
import StoreDetails from "./components/StoreDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserList from "./components/UserList";
import StoreForm from "./components/StoreForm";
import ProductSearch from "./components/ProductSearch";
import SellerApplication from "./components/SellerApplication";
import AdminSellerRequests from "./components/AdminSellerRequests";
import MyStores from "./components/MyStores";
import { CircularProgress, Box } from "@mui/material";
import { useAuthStore } from "./stores/useAuthStore";
import NotificationSnackbar from "./components/NotificationSnackbar";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#dd4646ff",
    },
    secondary: {
      main: "#e38e6aff",
    },
    background: {
      default: "#292928ff",
      paper: "#303030ff",
    },
    text: {
      primary: "#efe3e3ff",
      secondary: "#c0aaa0ff",
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#1a202c",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationSnackbar />
      <Router>
        <div className="App">
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<StoreList />} />
            <Route path="/store/:storeId" element={<StoreDetails />} />
            <Route path="/product-search" element={<ProductSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Rutas Admin */}
            <Route
              path="/users"
              element={user?.role === "admin" ? <UserList /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/requests"
              element={user?.role === "admin" ? <AdminSellerRequests /> : <Navigate to="/" />}
            />

            {/* Rutas Vendedor o Admin */}
            <Route
              path="/new-store"
              element={
                user?.role === "admin" || user?.role === "seller" ? (
                  <StoreForm />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/edit-store/:storeId"
              element={
                user?.role === "admin" || user?.role === "seller" ? (
                  <StoreForm />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/my-stores"
              element={
                user?.role === "admin" || user?.role === "seller" ? (
                  <MyStores />
                ) : (
                  <Navigate to="/" />
                )
              }
            />

            {/* Rutas Reviewer */}
            <Route
              path="/become-seller"
              element={user?.role === "reviewer" ? <SellerApplication /> : <Navigate to="/" />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
