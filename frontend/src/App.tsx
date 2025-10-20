import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import StoreList from "./components/StoreList";
import StoreDetails from "./components/StoreDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";
import auth from "./services/auth";
import type { User } from "./types/types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch {
        // no user logged in
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<StoreList user={user} setUser={setUser} />} />
          <Route path="/store/:storeId" element={<StoreDetails user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
