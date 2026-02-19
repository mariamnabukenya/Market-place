import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/products/${id}/`)
      .then((res) => {
        setFormData({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load product. You may not have access.");
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    API.put(`/products/${id}/`, formData)
      .then(() => {
        alert("Product updated successfully.");
        navigate("/dashboard");
      })
      .catch(() => {
        setError("Failed to save changes. Check your permissions.");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <Layout title="Edit Product">
        <div className="card">Loading product details…</div>
      </Layout>
    );
  }

  return (
    <Layout title="Edit Product">
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
                rows="4"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
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
              disabled={saving}
              style={{ width: "100%", padding: "14px" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditProduct;

