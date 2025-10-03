import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Search,
  Shuffle,
} from "lucide-react";

// Real product interface matching your database
interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const BestSellingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<{[key: string]: boolean}>({});

  const itemsPerPage = 4;

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch real products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/products");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Best selling products loaded:", data);
        
        // Get all products and take first 8 for best selling
        const productsData = data.data || [];
        setProducts(productsData.slice(0, 8)); // Show up to 8 products
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart via API
  const addToCart = async (product: Product) => {
    setLoadingProducts(prev => ({ ...prev, [product._id]: true }));
    
    try {
      const token = getToken();
      
      if (!token) {
        alert("Please login to add items to cart");
        return;
      }

      const response = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert(`${product.name} added to cart successfully!`);
      } else {
        console.error("Add to cart failed:", responseData);
        alert(responseData.message || "Failed to add item to cart");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check if your server is running.");
    } finally {
      setLoadingProducts(prev => ({ ...prev, [product._id]: false }));
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Navigate to shop page
  const viewAllProducts = () => {
    window.location.href = '/shop';
  };

  // Get visible products for current page
  const visibleProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const next = () => {
    if (startIndex + itemsPerPage < products.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  // Check if product is new (added in last 7 days)
  const isNewProduct = (createdAt: string) => {
    const productDate = new Date(createdAt);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return productDate > weekAgo;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 mb-8 rounded-xl shadow max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase border-b-2 border-yellow-400 pb-2">
            Best Selling Products
          </h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white p-6 mb-8 rounded-xl shadow max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase border-b-2 border-yellow-400 pb-2">
            Best Selling Products
          </h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
          <p className="text-sm text-gray-400 mt-2">Add some products to your database to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 mb-8 rounded-xl shadow max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase border-b-2 border-yellow-400 pb-2">
          Best Selling Products
        </h2>
        <button 
          onClick={viewAllProducts}
          className="text-sm font-semibold text-black bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
        >
          View All
        </button>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {visibleProducts.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 relative hover:shadow-md transition"
          >
            {/* Badge for new products */}
            {isNewProduct(product.createdAt) && (
              <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                NEW
              </span>
            )}

            {/* Wishlist */}
            <button 
              onClick={() => toggleWishlist(product._id)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart 
                size={18} 
                className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : ''}
              />
            </button>

            {/* Image */}
            <div className="h-32 flex items-center justify-center mb-4 bg-gray-100 rounded">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-xs text-gray-500 text-center ${product.imageUrl ? 'hidden' : ''}`}>
                {product.name}
              </span>
            </div>

            {/* Info */}
            <p className="text-xs text-gray-500 uppercase">{product.category}</p>
            <h3 className="font-semibold text-gray-800 truncate" title={product.name}>
              {product.name}
            </h3>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>

            {/* Price */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-lg font-bold text-gray-800">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 mt-4">
              <button 
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-2 rounded flex justify-center transition-colors"
                title="Compare"
              >
                <Shuffle size={16} />
              </button>
              <button 
                onClick={() => addToCart(product)}
                disabled={loadingProducts[product._id]}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-800 p-2 rounded flex justify-center transition-colors"
                title={loadingProducts[product._id] ? "Adding..." : "Add to Cart"}
              >
                {loadingProducts[product._id] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                ) : (
                  <ShoppingCart size={16} />
                )}
              </button>
              <button
                onClick={() => setSelectedProduct(product)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 p-2 rounded flex justify-center transition-colors"
                title="Quick View"
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
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            title="Previous"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {startIndex + itemsPerPage < products.length && (
          <button
            onClick={next}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
            title="Next"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Product count indicator */}
      {products.length > itemsPerPage && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i * itemsPerPage)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(startIndex / itemsPerPage) === i 
                    ? 'bg-yellow-400' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl font-bold"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="h-48 flex items-center justify-center mb-4 bg-gray-100 rounded-lg">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-500">{selectedProduct.name}</span>
                )}
              </div>
              
              <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
              <p className="text-gray-500 uppercase text-sm mb-2">{selectedProduct.category}</p>
              <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
              
              <div className="mb-4">
                <span className="text-2xl font-bold text-yellow-500">
                  ${selectedProduct.price.toFixed(2)}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => addToCart(selectedProduct)}
                  disabled={loadingProducts[selectedProduct._id]}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {loadingProducts[selectedProduct._id] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button 
                  onClick={() => toggleWishlist(selectedProduct._id)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart 
                    size={20} 
                    className={wishlist.includes(selectedProduct._id) ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSellingProducts;