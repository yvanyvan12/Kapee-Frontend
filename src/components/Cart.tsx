// src/components/Cart.tsx - Fixed version with correct API endpoints and navigation to Order
import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CartData {
  _id: string;
  userId: string;
  items: {
    productId: {
      _id: string;
      name: string;
      price: number;
      description: string;
      imageUrl?: string;
      category: string;
      createdAt: string;
      updatedAt: string;
    };
    quantity: number;
    _id: string;
  }[];
  totalItems: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

const Cart: React.FC = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [updatingItems, setUpdatingItems] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate(); // Added navigate

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = getToken();
      if (!token) {
        setError("Please login to view your cart");
        setLoading(false);
        return;
      }

      console.log("Fetching cart with token:", token.substring(0, 20) + "...");

      const response = await fetch("http://localhost:3000/cart/get", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Cart response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Cart data received:", data);
        
        if (data.success && data.data) {
          setCartData(data.data);
        } else {
          setCartData(null);
        }

      } else {
        const errorData = await response.json();
        console.log("Cart error:", errorData);
        setError(errorData.message || "Failed to fetch cart items");
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setError("Network error. Please check if your server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setUpdatingItems(prev => ({ ...prev, [productId]: true }));

    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/cart/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        }),
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update item");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:3000/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to remove item");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      alert("Promo code applied! 10% discount");
    } else {
      alert("Invalid promo code");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
              <a href="/" className="hover:text-gray-700">Home</a>
              <ChevronRight size={16} />
              <a href="/shop" className="hover:text-gray-700">Shop</a>
              <ChevronRight size={16} />
              <span className="text-gray-800">Cart</span>
            </nav>
          </div>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
            <a href="/" className="hover:text-gray-700">Home</a>
            <ChevronRight size={16} />
            <a href="/shop" className="hover:text-gray-700">Shop</a>
            <ChevronRight size={16} />
            <span className="text-gray-800">Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => {
                  setError("");
                  fetchCartItems();
                }}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {(!cartData || cartData.items.length === 0) && !loading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <a
              href="/"
              className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </a>
          </div>
        ) : cartData && cartData.items.length > 0 ? (
          <div>
            {/* Cart Header */}
            <div className="flex items-center mb-8">
              <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                <ShoppingBag size={24} className="text-yellow-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                <p className="text-gray-600">{cartData.totalItems} items</p>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cartData.items.map((item) => {
                const product = item.productId;
                const isUpdating = updatingItems[product._id];
                
                return (
                  <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-500 text-center p-2">
                            {product.name}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                            <span className="text-sm text-gray-500 ml-2">each</span>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateCartQuantity(product._id, item.quantity - 1)}
                                disabled={isUpdating}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button
                                onClick={() => updateCartQuantity(product._id, item.quantity + 1)}
                                disabled={isUpdating}
                                className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(product._id)}
                              disabled={isUpdating}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code & Total */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={applyPromoCode}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded transition"
                >
                  Apply
                </button>
              </div>
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-lg font-semibold text-gray-800">
                  Total: ${cartData.totalPrice.toFixed(2)}
                </p>
                <button
                  onClick={() => navigate("/order")} // ✅ Navigate to Order page
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
                >
                  Proceed to Order
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Cart;
