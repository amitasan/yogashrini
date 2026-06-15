// src/pages/Training.jsx
import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../inc/Navbar";
import Footer from "../inc/Footer";
import "./Training.css";
import { GiLotus } from "react-icons/gi";

/* Simple accessible modal (React-controlled, no bootstrap js) */
function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      // trap focus: move focus to dialog
      setTimeout(() => dialogRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="react-modal" ref={dialogRef} tabIndex="-1">
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button className="btn-close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <NavLink to="/contact" className="btn btn-primary" onClick={onClose}>Contact To Buy</NavLink>
        </div>
      </div>
    </div>
  );
}

export default function Training() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);

  async function getproduct() {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch("http://localhost:2000/product/sel");
      if (!resp.ok) throw new Error(`Server error: ${resp.status}`);
      const data = await resp.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getproduct(); }, []);

  return (
    <>
      <Navbar />

      <main className="container mainarea" role="main">
        {/* Hero */}
        <section className="intro" aria-labelledby="training-hero-title">
          <div className="intro-inner">
            <div>
              <h2 id="training-hero-title">Welcome to Our Training Programs</h2>
              <p>
                Explore our range of training products — online & offline classes, workshops, and YTT programs
                designed to help you grow. Click any card for details or contact us to enroll.
              </p>
              <div style={{ marginTop: 12 }}>
                <NavLink to="/training" className="btn btn-primary" style={{ marginRight: 8 }}>All Programs</NavLink>
                <NavLink to="/contact" className="btn btn-outline-success">Contact</NavLink>
              </div>
            </div>

            <div className="intro-badge" aria-hidden="true">
              <GiLotus size={56} style={{ color: "var(--yoga-primary, #FF2D6F)" }} />
              <div className="muted">Authentic Yoga Education</div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section aria-labelledby="products-title" style={{ marginTop: 28 }}>
          <div className="d-flex align-items-center mb-3">
            <h3 id="products-title" style={{ margin: 0 }}>Training Products</h3>
            <div className="small-muted" style={{ marginLeft: 12 }}>{products.length} items</div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" aria-hidden="true" />
              <div className="mt-2">Loading products...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-5"><h5>No products found.</h5></div>
          ) : (
            <div className="row">
              {products.map((p) => {
                const id = p._id ?? Math.random().toString(36).slice(2, 9);
                return (
                  <div className="col-lg-4 col-md-6 mb-4" key={id}>
                    <article
                      className="training-item card h-100"
                      role="article"
                      tabIndex="0"
                      aria-labelledby={`title-${id}`}
                      onKeyDown={(e) => { if (e.key === "Enter") setActiveProduct(p); }}
                    >
                      <img
                        src={p.pimg ? `http://localhost:2000/product_img/${p.pimg}` : "/placeholder.png"}
                        className="card-img-top"
                        alt={p.pname || "Product image"}
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        style={{ objectFit: "cover", height: "220px" }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h4 id={`title-${id}`} className="card-title">{p.pname || "Untitled Product"}</h4>
                        <p className="card-text price-tag">Rs: {p.pprice ?? "N/A"}</p>

                        <div className="mt-auto d-flex gap-2">
                          <NavLink to="/contact" className="btn btn-primary w-100">Contact To Buy</NavLink>

                          <button
                            type="button"
                            className="btn btn-outline-success w-100"
                            onClick={() => setActiveProduct(p)}
                            aria-haspopup="dialog"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Product Modal (React-controlled) */}
      <Modal
        open={!!activeProduct}
        onClose={() => setActiveProduct(null)}
        title={activeProduct ? activeProduct.pname : ""}
      >
        {activeProduct && (
          <div className="row">
            <div className="col-md-5">
              <img
                src={activeProduct.pimg ? `http://localhost:2000/product_img/${activeProduct.pimg}` : "/placeholder.png"}
                alt={activeProduct.pname}
                className="img-fluid rounded"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
              />
            </div>
            <div className="col-md-7">
              <h5>Price: Rs {activeProduct.pprice ?? "N/A"}</h5>
              <p>{activeProduct.pdetails || "No details available."}</p>
              {/* Add more fields if present */}
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
}
