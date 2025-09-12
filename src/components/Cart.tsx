import React, { useState } from "react";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowLeft, CreditCard, Truck } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  discount?: string | null;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  quantity?: number;
}

interface CartProps {
  cartItems: Product[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClose?: () => void;
  showAsModal?: boolean;
}

const Cart: React.FC<CartProps> = ({ 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClose,
  showAsModal = false 
}) => {
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const promoDiscount = isPromoApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + shipping - promoDiscount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setIsPromoApplied(true);
    }
  };

  const CartContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} className="text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-sm text-gray-500">{cartItems.length} items</p>
          </div>
        </div>
        {showAsModal && onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <ShoppingBag size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          {showAsModal && onClose && (
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                              disabled={item.quantity === 1}
                              className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-gray-900">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${(item.originalPrice * (item.quantity || 1)).toFixed(2)}
                            </span>
                          )}
                          <div className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Section */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Promo Code</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code (try: SAVE10)"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isPromoApplied}
                />
                <button
                  onClick={applyPromoCode}
                  disabled={isPromoApplied || !promoCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
              </div>
              {isPromoApplied && (
                <div className="mt-2 text-sm text-green-600 font-medium">
                  ✓ Promo code applied! 10% discount
                </div>
              )}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="border-t bg-gray-50 p-6">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <Truck size={16} />
                  Shipping
                  {subtotal > 100 && <span className="text-green-600 text-sm">(Free!)</span>}
                </span>
                <span>${shipping.toFixed(2)}</span>
              </div>

              {isPromoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount (10%)</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 100 && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <p>Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <CreditCard size={20} />
                Proceed to Checkout
              </button>
              
              {showAsModal && onClose && (
                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Continue Shopping
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (showAsModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
          <CartContent />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Shop</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <CartContent />
        </div>
      </div>
    </div>
  );
};

// Example usage component showing integration with shop
const CartExample: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([
    {
      id: 1,
      name: "Men Aviator Sunglasses",
      category: "ACCESSORIES",
      price: 50.00,
      originalPrice: 60.00,
      discount: "17% Off",
      rating: 4,
      reviews: 1,
      image: "/api/placeholder/300/300",
      description: "Classic aviator sunglasses with UV protection",
      colors: ["Black", "Silver"],
      sizes: ["One Size"],
      quantity: 2
    },
    {
      id: 2,
      name: "Wireless Bluetooth Headphones",
      category: "ELECTRONICS",
      price: 120.00,
      originalPrice: 150.00,
      discount: "20% Off",
      rating: 5,
      reviews: 23,
      image: "/api/placeholder/300/300",
      description: "Premium wireless headphones with noise cancellation",
      colors: ["Black", "White"],
      sizes: ["One Size"],
      quantity: 1
    }
  ]);

  const [showCartModal, setShowCartModal] = useState(false);

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="p-4">
      {/* Cart trigger button */}
      <button
        onClick={() => setShowCartModal(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Cart as full page */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Cart as Full Page:</h2>
        <Cart 
          cartItems={cart} 
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />
      </div>

      {/* Cart as modal */}
      {showCartModal && (
        <Cart 
          cartItems={cart} 
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClose={() => setShowCartModal(false)}
          showAsModal={true}
        />
      )}
    </div>
  );
};

export default CartExample;