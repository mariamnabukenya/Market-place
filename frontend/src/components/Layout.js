import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="layout-wrapper">
      {/* ===== Sticky Navigation Bar ===== */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="nav-logo">
            Baisoft Market
          </Link>

          <div className="nav-links">
            <Link to="/shop" className="nav-item">
              Public Store
            </Link>

            {token ? (
              <>
                <Link to="/dashboard" className="nav-item">
                  Dashboard
                </Link>

                <div className="nav-divider"></div>

                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Main Content Area ===== */}
      <main className="main-area">
        <div className="container">
          {title && (
            <div className="page-header fade-in">
              <h1>{title}</h1>
              <p className="text-muted">
                Manage your marketplace operations here.
              </p>
            </div>
          )}

          {/* Content Surface */}
          <section className="content-surface fade-in">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Layout;
