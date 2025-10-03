import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Search } from 'lucide-react';

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

// Hot Deals Carousel Component
const HotDealsCarousel: React.FC<{products: Product[]; onProductClick?: (product: Product) => void;}> = ({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<{[key: string]: boolean}>({});

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
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

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-lg relative">
        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-yellow-400 pb-1 mb-4">HOT DEALS</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No hot deals available</p>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  // Calculate discount percentage if it's a newer product (simplified logic)
  const isNewProduct = new Date(currentProduct.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const discountPercentage = isNewProduct ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 50) + 20;

  // Countdown timer (static for demo)
  const countdown = { days: 453, hours: 1, minutes: 40, seconds: 10 };

  return (
    <div className="bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-yellow-400 pb-1">HOT DEALS</h3>
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
        {products.length > 1 && (
          <>
            <button
              onClick={prevProduct}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button
              onClick={nextProduct}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </>
        )}

        {/* Product Display */}
        <div className="mx-8">
          <div className="relative">
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
              {discountPercentage}% OFF
            </div>
            <button 
              onClick={() => toggleWishlist(currentProduct._id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
            >
              <Heart 
                size={20} 
                className={wishlist.includes(currentProduct._id) ? 'fill-red-500 text-red-500' : ''}
              />
            </button>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-center h-32">
              {currentProduct.imageUrl ? (
                <img 
                  src={currentProduct.imageUrl} 
                  alt={currentProduct.name} 
                  className="max-h-full max-w-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-xs text-gray-500 text-center ${currentProduct.imageUrl ? 'hidden' : ''}`}>
                {currentProduct.name}
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1 uppercase">{currentProduct.category}</p>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2" title={currentProduct.name}>
              {currentProduct.name}
            </h4>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-lg font-bold text-gray-800">${currentProduct.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">
                ${(currentProduct.price * (1 + discountPercentage / 100)).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 mb-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-500">{countdown.days}</div>
              <div className="text-xs text-gray-500">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{countdown.hours}</div>
              <div className="text-xs text-gray-500">Hrs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{countdown.minutes}</div>
              <div className="text-xs text-gray-500">Mins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">{countdown.seconds}</div>
              <div className="text-xs text-gray-500">Secs</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button 
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
              onClick={() => addToCart(currentProduct)}
              disabled={loadingProducts[currentProduct._id]}
            >
              {loadingProducts[currentProduct._id] ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
              ) : (
                <ShoppingCart size={16} />
              )}
              <span>{loadingProducts[currentProduct._id] ? 'ADDING...' : 'ADD TO CART'}</span>
            </button>
            <button 
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
              onClick={() => onProductClick?.(currentProduct)}
            >
              <Search size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Product Indicators */}
          {products.length > 1 && (
            <div className="flex justify-center space-x-1 mt-4">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-yellow-400' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sale Badge */}
      <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center transform -rotate-12 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{discountPercentage}</div>
          <div className="text-xs">%</div>
        </div>
      </div>
    </div>
  );
};

// Featured Products Carousel Component
const FeaturedProductsCarousel: React.FC<{products: Product[]; onProductClick?: (product: Product) => void;}> = ({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<{[key: string]: boolean}>({});
  const itemsPerPage = 4;

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
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

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const nextProducts = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= products.length ? 0 : prevIndex + itemsPerPage
    );
  };

  const prevProducts = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, products.length - itemsPerPage) : Math.max(0, prevIndex - itemsPerPage)
    );
  };

  const viewAllProducts = () => {
    window.location.href = '/shop';
  };

  const getBadgeForProduct = (product: Product) => {
    const isNewProduct = new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const isRecentProduct = new Date(product.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    if (isNewProduct) {
      return { text: 'NEW', color: 'bg-green-500' };
    } else if (isRecentProduct) {
      return { text: 'FEATURED', color: 'bg-blue-500' };
    } else if (product.price > 100) {
      return { text: 'PREMIUM', color: 'bg-purple-500' };
    }
    return null;
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  if (products.length === 0) {
    return (
      <div className="bg-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-800">FEATURED PRODUCTS</h2>
            <div className="w-16 h-1 bg-yellow-400"></div>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">No featured products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold text-gray-800">FEATURED PRODUCTS</h2>
          <div className="w-16 h-1 bg-yellow-400"></div>
        </div>
        <div className="flex items-center space-x-4">
          {products.length > itemsPerPage && (
            <>
              <button 
                onClick={prevProducts}
                className="bg-white border border-gray-300 hover:border-yellow-400 p-2 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button 
                onClick={nextProducts}
                className="bg-white border border-gray-300 hover:border-yellow-400 p-2 rounded-lg transition-colors"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </>
          )}
          <button 
            onClick={viewAllProducts}
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            VIEW ALL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product) => {
          const badge = getBadgeForProduct(product);
          return (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
              onClick={() => onProductClick?.(product)}
            >
              <div className="relative p-4">
                {badge && (
                  <div className={`absolute top-2 left-2 ${badge.color} text-white text-xs font-bold px-2 py-1 rounded z-10`}>
                    {badge.text}
                  </div>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                >
                  <Heart 
                    size={20} 
                    className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>

                <div className="bg-gray-50 rounded-lg mb-4 h-32 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="max-h-full max-w-full object-contain rounded-lg"
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

                {/* Add to cart button on hover */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  disabled={loadingProducts[product._id]}
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <div className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {loadingProducts[product._id] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800"></div>
                    ) : (
                      <ShoppingCart size={16} />
                    )}
                    <span>{loadingProducts[product._id] ? 'Adding...' : 'Add to Cart'}</span>
                  </div>
                </button>
              </div>

              <div className="p-4 pt-0">
                <p className="text-xs text-gray-500 mb-1 uppercase">{product.category}</p>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm hover:text-yellow-600 transition-colors line-clamp-2" title={product.name}>
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Indicators */}
      {products.length > itemsPerPage && (
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-3 h-3 rounded-full transition-colors ${
                Math.floor(currentIndex / itemsPerPage) === index ? 'bg-yellow-400' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Demo Component
const ProductCarouselDemo: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch real products from database
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/products");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Carousel products loaded:", data);
        
        const productsData = data.data || [];
        setProducts(productsData);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    console.log('Selected product:', product);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mr-4"></div>
            <span className="text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  // Get first 3 products for hot deals and remaining for featured
  const hotDealsProducts = products.slice(0, 3);
  const featuredProducts = products.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Hot Deals Sidebar */}
          <div className="lg:col-span-1">
            <HotDealsCarousel 
              products={hotDealsProducts} 
              onProductClick={handleProductClick}
            />
          </div>

          {/* Featured Products Main Area */}
          <div className="lg:col-span-3">
            <FeaturedProductsCarousel 
              products={featuredProducts} 
              onProductClick={handleProductClick}
            />
          </div>
        </div>

        {/* Selected Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
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
                
                <h3 className="font-bold text-xl text-gray-800 mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-500 uppercase text-sm mb-2">{selectedProduct.category}</p>
                <p className="text-gray-600 text-sm mb-4">{selectedProduct.description}</p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-yellow-500">${selectedProduct.price.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarouselDemo;