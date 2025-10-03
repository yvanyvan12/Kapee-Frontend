"use client";

import React, { useState, useEffect } from "react";

interface Product {
  _id?: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sales?: number;
  status: "active" | "inactive";
  image?: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Partial<Product>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product: initialProduct,
  onSave,
}) => {
  const [product, setProduct] = useState<Product>({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    stock: 0,
    status: "active",
    image: "",
  });

  useEffect(() => {
    if (initialProduct) setProduct(initialProduct);
    else
      setProduct({
        name: "",
        category: "",
        price: 0,
        cost: 0,
        stock: 0,
        status: "active",
        image: "",
      });
  }, [initialProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {product._id ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="border px-2 py-1 rounded"
            required
          />
    
          <input
            type="text"
            placeholder="Category"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className="border px-2 py-1 rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            className="border px-2 py-1 rounded"
            required
          />
          <input
            type="number"
            placeholder="Cost"
            value={product.cost}
            onChange={(e) => setProduct({ ...product, cost: Number(e.target.value) })}
            className="border px-2 py-1 rounded"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
            className="border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={product.image || ""}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <select
            value={product.status}
            onChange={(e) =>
              setProduct({ ...product, status: e.target.value as "active" | "inactive" })
            }
            className="border px-2 py-1 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {product._id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
