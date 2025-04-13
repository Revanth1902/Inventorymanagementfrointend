import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://inventorymanagementbackend-pn44.onrender.com/api/products"
      );
      // Correctly accessing the 'products' field
      const data = Array.isArray(res.data.products) ? res.data.products : [];
      setProducts(data);
    } catch (err) {
      console.error(err);
      setProducts([]); // fallback
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://inventorymanagementbackend-pn44.onrender.com/api/products/search?q=${query}`
      );
      // Correctly accessing the 'products' field for search
      const data = Array.isArray(res.data.products) ? res.data.products : [];
      setProducts(data);
    } catch (err) {
      console.error(err);
      setProducts([]); // fallback
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://inventorymanagementbackend-pn44.onrender.com/api/products/${id}`
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h2 className="text-center mb-4">Product Inventory</h2>
      <div className="row mb-3">
        <div className="col-md-9 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or supplier"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="table-responsive">
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
            {products.map((prod) => (
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
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
