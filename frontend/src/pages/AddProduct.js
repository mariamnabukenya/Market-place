import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    API.post("/products/", formData)
      .then(() => {
        alert("Product successfully created as Draft!");
        navigate("/dashboard");
      })
      .catch(() => {
        setError("Failed to create product. Please check your permissions.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout title="List New Product">
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="btn"
            style={{
              background: "transparent",
              color: "#2563eb",
              padding: 0,
            }}
          >
            ← Back
          </button>
        </div>

        <div className="card">
          {error && (
            <p style={{ color: "#b91c1c", marginBottom: "12px" }}>{error}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Product Name
              </label>
              <input
                type="text"
                placeholder="e.g. High-End Laptop"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Description
              </label>
              <textarea
                placeholder="Provide details about the item..."
                required
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Price ($)
              </label>
              <input
                type="number"
                placeholder="0.00"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "14px" }}
            >
              {loading ? "Processing..." : "Submit for Approval"}
            </button>

            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "15px",
                textAlign: "center",
              }}
            >
              Note: New products are saved as <b>Draft</b> and must be approved
              by an Approver or Admin before appearing in the public store.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default AddProduct;