import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/:id?" element={<AddProduct />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </Layout>
  );
}

export default App;
