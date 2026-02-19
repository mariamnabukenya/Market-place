import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import PublicStore from "./pages/PublicStore";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/shop" element={<PublicStore />} />

        {/* Protected Dashboard - Any logged in user can see it */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Add Product - Only Admin, Editor, and Approver can create */}
        <Route
          path="/add-product"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "EDITOR", "APPROVER"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* Protected Edit Product - same roles as add, plus ownership enforced by backend */}
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "EDITOR", "APPROVER"]}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;