import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    supplier: "",
    sales: 0,
    price: 0,
    quantity: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://inventorymanagementbackend-pn44.onrender.com/api/products",
      product
    );
    navigate("/products");
  };

  return (
    <div>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        {["name", "description", "supplier", "sales", "price", "quantity"].map(
          (field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={
                  field === "sales" || field === "price" || field === "quantity"
                    ? "number"
                    : "text"
                }
                name={field}
                value={product[field]}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          )
        )}
        <button className="btn btn-success">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
