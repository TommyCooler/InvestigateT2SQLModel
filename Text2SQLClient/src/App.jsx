import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/search/Search";
import Login from "./pages/LoginPage/Login";
import Store from "./pages/StorePage/Store";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/store" element={<Store />} />
        <Route path="/laptop" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
