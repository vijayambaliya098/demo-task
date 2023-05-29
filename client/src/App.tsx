import Layout from "./components/Layout";
import { Navigate, Route, Routes } from "react-router-dom";
import Products from "./pages/Products";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Layout>
  );
}

export default App;
