import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    setUserRole(savedRole || "");

    API.get("/products/")
      .then((res) => setProducts(res.data))
      .catch(() => {
        alert("Please login first");
        window.location.href = "/";
      });
  }, []);

  const handleApprove = (productId) => {
    API.post(`/products/${productId}/approve/`)
      .then(() => {
        alert("Product Approved!");
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, status: "APPROVED" } : p
          )
        );
      })
      .catch(() =>
        alert("Error: You might not have permission to approve this product.")
      );
  };

  const canApprove = (role) => ["ADMIN", "APPROVER"].includes(role);

  return (
    <Layout title="Business Dashboard">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h3>Your Products</h3>
        <button
          onClick={() => navigate("/add-product")}
          className="btn btn-primary"
        >
          + New Product
        </button>
      </div>

      {products.map((product) => (
        <div
          key={product.id}
          className="card"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: "0 0 5px 0" }}>{product.name}</h4>
            <p style={{ margin: 0, color: "#64748b" }}>${product.price}</p>
            <p
              style={{
                marginTop: "4px",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Created by {product.created_by_name} in {product.business_name}
            </p>
          </div>

          <span
            className={`badge badge-${product.status.toLowerCase()}`}
            style={{ textTransform: "capitalize" }}
          >
            {product.status.toLowerCase()}
          </span>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => navigate(`/products/${product.id}/edit`)}
              className="btn"
              style={{ background: "#e2e8f0", color: "#1e293b" }}
            >
              Edit
            </button>

            {canApprove(userRole) && product.status !== "APPROVED" && (
              <button
                onClick={() => handleApprove(product.id)}
                className="btn btn-primary"
              >
                Approve
              </button>
            )}
          </div>
        </div>
      ))}
    </Layout>
  );
}

export default Dashboard;