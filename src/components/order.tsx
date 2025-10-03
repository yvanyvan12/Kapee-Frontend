// src/components/Checkout.tsx - Connected to backend
import React, { useState, useEffect } from 'react';
import { ChevronRight, Truck, Shield, CheckCircle, ArrowLeft, DollarSign } from 'lucide-react';

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
    };
    quantity: number;
    _id: string;
  }[];
  totalItems: number;
  totalPrice: number;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [shippingCost, setShippingCost] = useState(0);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Please login to proceed with checkout");
        return;
      }

      const response = await fetch("http://localhost:3000/cart/get", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.items.length > 0) {
          setCartData(data.data);
          // Calculate shipping based on cart total
          const shipping = data.data.totalPrice > 50 ? 0 : 9.99;
          setShippingCost(shipping);
        } else {
          setError("Your cart is empty. Please add items before checkout.");
        }
      } else {
        setError("Failed to load cart data");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate shipping address
  const validateShippingAddress = (): boolean => {
    return !!(
      shippingAddress.fullName && 
      shippingAddress.address && 
      shippingAddress.city && 
      shippingAddress.state && 
      shippingAddress.zipCode && 
      shippingAddress.phone
    );
  };

  // Go to payment step
  const proceedToPayment = () => {
    if (validateShippingAddress()) {
      setCurrentStep(2);
      setError('');
    } else {
      setError("Please fill in all required fields");
    }
  };

  // Place order - Simple request to backend
  const placeOrder = async () => {
    if (!validateShippingAddress()) {
      setError("Please complete shipping address");
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const token = getToken();
      
      if (!token) {
        setError("Authentication required. Please login.");
        setProcessing(false);
        return;
      }

      // Simple POST request - backend handles everything from cart
      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [] // Backend reads from cart, so this can be empty
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Order placed:", result);
        
        setOrderId(result.data._id);
        setOrderSuccess(true);
        setCurrentStep(3);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Order error:", err);
      setError("Network error. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !cartData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <a 
            href="/cart"
            className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Cart
          </a>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your order #{orderId.slice(-8)} has been confirmed.
          </p>
          <p className="text-sm text-green-600 mb-4 font-medium">
            Payment: Cash on Delivery - Pay when you receive your order
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You'll receive a confirmation call shortly.
          </p>
          <div className="space-y-3">
            <a 
              href="/orders"
              className="w-full block bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-6 rounded-lg"
            >
              View Orders
            </a>
            <a 
              href="/"
              className="w-full block border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartData?.totalPrice || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            <a href="/cart" className="text-yellow-600 hover:text-yellow-700 flex items-center">
              <ArrowLeft size={20} className="mr-1" />
              Back to Cart
            </a>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center mt-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep ? 'bg-yellow-400 text-gray-800' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step === 3 && orderSuccess ? (
                    <CheckCircle size={16} />
                  ) : (
                    step
                  )}
                </div>
                <span className={`ml-2 text-sm ${step <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>
                  {step === 1 && 'Shipping'}
                  {step === 2 && 'Payment'}
                  {step === 3 && 'Confirmation'}
                </span>
                {step < 3 && (
                  <ChevronRight size={16} className="mx-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <Truck size={24} className="text-yellow-600 mr-3" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={shippingAddress.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="10001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <button
                  onClick={proceedToPayment}
                  className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-2 rounded-lg"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <DollarSign size={24} className="text-yellow-600 mr-3" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>

                {/* Shipping Address Summary */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Delivering to:</p>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-800">{shippingAddress.fullName}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
                    <p>{shippingAddress.phone}</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm mt-2"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Cash on Delivery */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <DollarSign size={24} className="text-green-600 mr-3" />
                    <div>
                      <span className="font-semibold text-green-800">Cash on Delivery</span>
                      <p className="text-sm text-green-600 mt-1">Pay ${total.toFixed(2)} when you receive your order</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-2 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={processing}
                    className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-800 font-semibold px-6 py-2 rounded-lg flex items-center"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              {cartData && (
                <>
                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartData.items.map((item) => (
                      <div key={item._id} className="flex items-center space-x-3 text-sm">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.productId.imageUrl ? (
                            <img
                              src={item.productId.imageUrl}
                              alt={item.productId.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">{item.productId.name[0]}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 line-clamp-1">{item.productId.name}</p>
                          <p className="text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.productId.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Notice */}
                  <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-sm text-green-700">
                      <DollarSign size={16} className="mr-2" />
                      <span>Cash on Delivery</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <Shield size={16} className="mr-2" />
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;