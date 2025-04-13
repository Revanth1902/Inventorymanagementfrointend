import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    supplier: "",
    sales: 0,
    price: 0,
    quantity: 0,
  });

  // Loading state to track when data is being fetched
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://inventorymanagementbackend-pn44.onrender.com/api/products/${id}`
        );
        // Check if the product data is returned correctly
        console.log(res.data); // This helps to debug if the API is returning the correct data
        setProduct(res.data.product || res.data); // Adjust based on your API structure
        setLoading(false); // Set loading to false after the data is fetched
      } catch (error) {
        console.error(error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://inventorymanagementbackend-pn44.onrender.com/api/products/${id}`,
        product
      );
      navigate("/products");
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // If the data is still loading, show a loading message
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {["name", "description", "supplier", "sales", "price", "quantity"].map(
          (field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">{field}</label>
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
        <button className="btn btn-primary">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
