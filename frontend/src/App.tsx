import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, type JSX } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Box } from "@mui/material";

import MainLayout from "./components/layout/MainLayout";
import StoreList from "./components/stores/StoreList";
import StoreDetails from "./components/stores/StoreDetails";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import UserList from "./components/admin/UserList";
import StoreForm from "./components/stores/StoreForm";
import ProductSearch from "./components/products/ProductSearch";
import SellerApplication from "./components/sellers/SellerApplication";
import AdminSellerRequests from "./components/admin/AdminSellerRequests";
import MyStores from "./components/stores/MyStores";
import NotificationSnackbar from "./components/common/NotificationSnackbar";
import { useAuthStore } from "./stores/useAuthStore";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#dd4646ff" },
    secondary: { main: "#e38e6aff" },
    background: { default: "#292928ff", paper: "#303030ff" },
    text: { primary: "#efe3e3ff", secondary: "#c0aaa0ff" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
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
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const ProtectedRoute = ({
    children,
    allowedRoles,
  }: {
    children: JSX.Element;
    allowedRoles?: string[];
  }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationSnackbar />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<MainLayout />}>
            <Route path="/" element={<StoreList />} />
            <Route path="/store/:storeId" element={<StoreDetails />} />
            <Route path="/product-search" element={<ProductSearch />} />

            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminSellerRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/new-store"
              element={
                <ProtectedRoute allowedRoles={["admin", "seller"]}>
                  <StoreForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-store/:storeId"
              element={
                <ProtectedRoute allowedRoles={["admin", "seller"]}>
                  <StoreForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-stores"
              element={
                <ProtectedRoute allowedRoles={["admin", "seller"]}>
                  <MyStores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/become-seller"
              element={
                <ProtectedRoute allowedRoles={["reviewer"]}>
                  <SellerApplication />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
