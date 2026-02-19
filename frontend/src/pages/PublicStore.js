import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function PublicStore() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/public/")
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Error fetching public products:", err)
      );
  }, []);

  return (
    <Layout title="Marketplace">
      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        Browse approved products from our business partners.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {products.length === 0 ? (
          <div className="card">
            <p>No products are currently available for sale.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="card">
              <h3 style={{ margin: "0 0 8px 0" }}>{product.name}</h3>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                {product.description}
              </p>
              <p
                style={{
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginTop: "12px",
                }}
              >
                ${product.price}
              </p>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                Sold by: {product.business_name}
              </span>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default PublicStore;

