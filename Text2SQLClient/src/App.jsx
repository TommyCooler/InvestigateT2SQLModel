import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/search/Search";
import Login from "./pages/LoginPage/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
