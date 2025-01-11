import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Search from "./pages/search/Search";
import Login from "./pages/LoginPage/Login";
import Store from "./pages/StorePage/Store";
import VipSearch from "./pages/VipSearch/Laptop/VipSearch";
import VipStore from "./pages/VipSearch/Store/Store";

// VIP Route Protection
const VipRoute = ({ element }) => {
  const isVip = localStorage.getItem("isVip") === "true";
  const isLoggedIn = !!localStorage.getItem("user");

  if (!isLoggedIn || !isVip) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store />} />
        <Route path="/laptop" element={<Search />} />

        {/* Protected VIP Routes */}
        <Route
          path="/vip-search"
          element={<VipRoute element={<VipSearch />} />}
        />
        <Route
          path="/vip-store"
          element={<VipRoute element={<VipStore />} />}
        />

        {/* Catch all other routes and redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;