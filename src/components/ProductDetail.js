import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://inventorymanagementbackend-pn44.onrender.com/api/products/${id}`
        );
        setProduct(res.data.product); // Accessing the product data from the response
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>
        <strong>Description:</strong> {product.description}
      </p>
      <p>
        <strong>Supplier:</strong> {product.supplier}
      </p>
      <p>
        <strong>Sales:</strong> {product.sales}
      </p>
      <p>
        <strong>Price:</strong> ${product.price}
      </p>
      <p>
        <strong>Quantity:</strong> {product.quantity}
      </p>
      <Link className="btn btn-secondary" to="/products">
        Back
      </Link>
    </div>
  );
};

export default ProductDetail;
