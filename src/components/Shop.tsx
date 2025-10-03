import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Grid, List, ChevronDown, X, Eye } from 'lucide-react';

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

interface Category {
  name: string;
  count: number;
}

// Utility function to get placeholder image
const getPlaceholderImage = (productName: string, category: string) => {
  const encodedName = encodeURIComponent(productName);
  const encodedCategory = encodeURIComponent(category);
  return `https://via.placeholder.com/400x300/f3f4f6/6b7280?text=${encodedName}`;
};

const EcommerceShop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [loadingProducts, setLoadingProducts] = useState<{[key: string]: boolean}>({});

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
        console.log("Products loaded:", data);
        
        const productsData = data.data || [];
        setProducts(productsData);
        
        // Generate categories from products
        const categoryMap = new Map<string, number>();
        productsData.forEach((product: Product) => {
          const category = product.category;
          categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
        });
        
        const categoriesData = Array.from(categoryMap.entries()).map(([name, count]) => ({
          name,
          count
        }));
        
        setCategories(categoriesData);
        
        // Set price range based on actual product prices
        if (productsData.length > 0) {
          const prices = productsData.map((p: Product) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);
        }
        
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Network error. Please check if your server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart via API
  const addToCart = async (product: Product) => {
    setLoadingProducts(prev => ({ ...prev, [product._id]: true }));
    
    try {
      const token = getToken();
      console.log("Token found:", token ? "Yes" : "No");
      
      if (!token) {
        alert("Please login to add items to cart");
        return;
      }

      console.log("Adding to cart:", { productId: product._id, quantity: 1 });

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

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        alert(`${product.name} added to cart successfully!`);
      } else {
        console.error("Add to cart failed:", responseData);
        alert(responseData.message || "Failed to add item to cart");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check if your server is running on http://localhost:3000");
    } finally {
      setLoadingProducts(prev => ({ ...prev, [product._id]: false }));
    }
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Shop</h1>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>Shop</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Shop</h1>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span>Home</span>
              <span className="mx-2">/</span>
              <span>Shop</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchProducts}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Shop</h1>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Shop</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">PRODUCT CATEGORIES</h3>
                <ChevronDown size={18} />
              </div>
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setSelectedCategory('')}
                >
                  <span className={`text-sm ${selectedCategory === '' ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                    All Categories
                  </span>
                  <span className="text-xs text-gray-400">({products.length})</span>
                </div>
                {categories.map(category => (
                  <div 
                    key={category.name}
                    className="flex items-center justify-between cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <span className={`text-sm ${selectedCategory === category.name ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {category.name}
                    </span>
                    <span className="text-xs text-gray-400">({category.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">FILTER BY PRICE</h3>
                <ChevronDown size={18} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>-</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min={products.length > 0 ? Math.min(...products.map(p => p.price)) : 0} 
                  max={products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000} 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
                <button 
                  onClick={() => {
                    if (products.length > 0) {
                      setPriceRange([Math.min(...products.map(p => p.price)), Math.max(...products.map(p => p.price))]);
                    }
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Reset Price Filter
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} Products of {products.length} Products
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span>Show:</span>
                  <select className="border rounded px-3 py-1">
                    <option>12</option>
                    <option>24</option>
                    <option>48</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <select 
                    className="border rounded px-3 py-1"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default">Default sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid - FIXED */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('');
                    if (products.length > 0) {
                      setPriceRange([Math.min(...products.map(p => p.price)), Math.max(...products.map(p => p.price))]);
                    }
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300">
                    {/* FIXED IMAGE SECTION */}
                    <div className="relative overflow-hidden">
                      <div className="w-full h-64 bg-gray-100 relative">
                        {/* Remove debug info and fix image display */}
                        {product.imageUrl && product.imageUrl.trim() !== '' ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onLoad={() => console.log('Image loaded successfully:', product.imageUrl)}
                            onError={(e) => {
                              console.log('Image failed to load:', product.imageUrl);
                              // Replace failed image with placeholder
                              (e.target as HTMLImageElement).src = getPlaceholderImage(product.name, product.category);
                            }}
                          />
                        ) : (
                          <img
                            src={getPlaceholderImage(product.name, product.category)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                      
                      {/* FIXED Hover Buttons with proper z-index and visibility */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                            disabled={loadingProducts[product._id]}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium shadow-lg"
                          >
                            {loadingProducts[product._id] ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <ShoppingCart size={16} />
                            )}
                            {loadingProducts[product._id] ? 'Adding...' : 'Add to Cart'}
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              openProductModal(product);
                            }}
                            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Wishlist Button - Fixed positioning */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product._id);
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors z-10"
                      >
                        <Heart 
                          size={16} 
                          className={wishlist.includes(product._id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                        />
                      </button>

                      {/* New Product Badge */}
                      {new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium z-10">
                          NEW
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1 uppercase">{product.category}</div>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FIXED Product Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Fixed Modal Image */}
                <div>
                  <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                    {selectedProduct.imageUrl && selectedProduct.imageUrl.trim() !== '' ? (
                      <img 
                        src={selectedProduct.imageUrl} 
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getPlaceholderImage(selectedProduct.name, selectedProduct.category);
                        }}
                      />
                    ) : (
                      <img
                        src={getPlaceholderImage(selectedProduct.name, selectedProduct.category)}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-2 uppercase">{selectedProduct.category}</div>
                  
                  <div className="flex items-center gap-2 my-4">
                    <span className="text-3xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Product ID:</h4>
                    <p className="text-sm text-gray-500 font-mono">{selectedProduct._id}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Added:</h4>
                    <p className="text-sm text-gray-500">{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setShowModal(false);
                    }}
                    disabled={loadingProducts[selectedProduct._id]}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingProducts[selectedProduct._id] ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add these styles to your global CSS or as a style tag */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EcommerceShop;