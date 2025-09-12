import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Search,
  Shuffle,
} from "lucide-react";
import cam from '../assets/cam.jpg';
import xbox from '../assets/xbox.jpg';
import virtualreality from '../assets/virtualreality.jpg';
import applewatch from '../assets/applewatch.jpeg';
import head from '../assets/head.jpeg';

// ✅ Product type
interface Product {
  id: number;
  name: string;
  category: string;
  price: number | string;
  originalPrice?: number;
  discount?: string;
  badge?: string;
  badgeColor?: string;
  image: string;
}

// ✅ Sample product data
const bestSellingProducts: Product[] = [
  {
    id: 1,
    name: "Apple Watch Series 5",
    category: "ELECTRONICS",
    price: "$499.00 - $599.00",
    discount: "17% OFF",
    badgeColor: "bg-green-500",
    image:applewatch,
  },
  {
    id: 2,
    name: "Microsoft Xbox One Wireless Controller",
    category: "ELECTRONICS",
    price: 25,
    originalPrice: 45,
    discount: "44% OFF",
    badgeColor: "bg-green-500",
    image: xbox,
  },
  {
    id: 3,
    name: "JBL On-Ear Headphones",
    category: "ELECTRONICS",
    price: 124,
    badge: "FEATURED",
    badgeColor: "bg-orange-500",
    image: head,
  },
  {
    id: 4,
    name: "Samsung Virtual Reality Headset",
    category: "ELECTRONICS",
    price: 18,
    image: virtualreality,
  },
  {
    id: 5,
    name: "Apple Watch Series 5 Black Milanese Loop",
    category: "ELECTRONICS",
    price: 599,
    image: applewatch,
  },
  {
    id: 6,
    name: "Samsung Gear 360 Camera",
    category: "ELECTRONICS",
    price: 29,
    originalPrice: 48,
    discount: "40% OFF",
    badgeColor: "bg-green-500",
    image: cam,
  },
];

const BestSellingProducts: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const itemsPerPage = 4;
  const visibleProducts = bestSellingProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const next = () => {
    if (startIndex + itemsPerPage < bestSellingProducts.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <div className="bg-white p-6 mb-8 rounded-xl shadow max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase border-b-2 border-yellow-400 pb-2">
          Best Selling Products
        </h2>
        <button className="text-sm font-semibold text-black bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500">
          View All
        </button>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 relative hover:shadow-md transition"
          >
            {/* Badge */}
            {(product.discount || product.badge) && (
              <span
                className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded ${product.badgeColor}`}
              >
                {product.discount || product.badge}
              </span>
            )}

            {/* Wishlist */}
            <button className="absolute top-3 right-3 text-gray-500 hover:text-red-500">
              <Heart size={18} />
            </button>

            {/* Image */}
            <div className="h-32 flex items-center justify-center mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full"
              />
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500">{product.category}</p>
            <h3 className="font-semibold text-gray-800 truncate">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-lg font-bold text-gray-800">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm line-through text-gray-500">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-2 rounded flex justify-center">
                <Shuffle size={16} />
              </button>
              <button className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-2 rounded flex justify-center">
                <ShoppingCart size={16} />
              </button>
              <button
                onClick={() => setSelectedProduct(product)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-2 rounded flex justify-center"
              >
                <Search size={16} />
              </button>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        {startIndex > 0 && (
          <button
            onClick={prev}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {startIndex + itemsPerPage < bestSellingProducts.length && (
          <button
            onClick={next}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* ✅ Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <div className="text-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="mx-auto h-40 mb-4"
              />
              <h2 className="text-lg font-bold">{selectedProduct.name}</h2>
              <p className="text-gray-500">{selectedProduct.category}</p>
              <div className="mt-2">
                <span className="text-xl font-bold text-yellow-500">
                  ${selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-sm line-through ml-2 text-gray-500">
                    ${selectedProduct.originalPrice}
                  </span>
                )}
              </div>
              <button className="mt-4 bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-lg font-semibold">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSellingProducts;
