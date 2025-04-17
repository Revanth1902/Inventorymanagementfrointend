import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://inventorymanagementbackend-pn44.onrender.com/api/products"
      );
      const data = Array.isArray(res.data.products) ? res.data.products : [];
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      fetchProducts(); // If query is empty, fetch all
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `https://inventorymanagementbackend-pn44.onrender.com/api/products/search?q=${trimmedQuery}`
      );
      // FIX: Accessing correct field 'results' instead of 'products'
      const data = Array.isArray(res.data.results) ? res.data.results : [];
      setProducts(data);
    } catch (err) {
      console.error("Error searching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    setLoading(true);
    try {
      await axios.delete(
        `https://inventorymanagementbackend-pn44.onrender.com/api/products/${id}`
      );
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Product Inventory</h2>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-7 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or supplier"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="col-md-2 mb-2">
          <button
            className="btn btn-primary w-100"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        <div className="col-md-3 mb-2">
          <button
            className="btn btn-secondary w-100"
            onClick={handleClearSearch}
            disabled={loading || !query}
          >
            Clear Search
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-responsive">
        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        )}

        {!loading && (
          <table className="table table-bordered table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Supplier</th>
                <th>Sales</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id}>
                    <td>{prod.name}</td>
                    <td>{prod.supplier}</td>
                    <td>{prod.sales}</td>
                    <td>${prod.price}</td>
                    <td>{prod.quantity}</td>
                    <td>
                      <Link
                        className="btn btn-info btn-sm me-1 mb-1"
                        to={`/products/${prod._id}`}
                      >
                        View
                      </Link>
                      <Link
                        className="btn btn-warning btn-sm me-1 mb-1"
                        to={`/edit/${prod._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm mb-1"
                        onClick={() => handleDelete(prod._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProductList;
