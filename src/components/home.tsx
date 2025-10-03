// src/components/home.tsx - Complete Updated Version with Image Fixes
import React, { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import ProductCarouselDemo from "./HotDealsCarousel";
import BestSellingProducts from "./bestSellingProducts";
import Freeshipping from "./Freeshipping";
import Shop from "./Shop.tsx";
import Blogs from "./Blogs.tsx";
import heroImg1 from "../assets/electronics-slider-1.png";
import heroImg2 from "../assets/electronics-slider-2.png";
import heroImg3 from "../assets/electronics-slider-1.png";

interface Category {
  name: string;
  subcategories?: string[];
}

interface NavigationItem {
  name: string;
  id: string;
}

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

interface HeroSlide {
  title: string;
  subtitle: string;
  img: string;
  discount: string;
  buttonText: string;
}

/* ---------- data ---------- */
const heroSlides: HeroSlide[] = [
  {
    title: "WIRELESS CHARGING STAND",
    subtitle: "BEST SMARTPHONE",
    img: heroImg1,
    discount: "Up To 70% Off",
    buttonText: "BUY NOW",
  },
  {
    title: "HEADPHONES",
    subtitle: "PREMIUM AUDIO",
    img: heroImg2,
    discount: "Min. 40-80% Off",
    buttonText: "SHOP NOW",
  },
  {
    title: "SMARTWATCH",
    subtitle: "LATEST TECHNOLOGY",
    img: heroImg3,
    discount: "Up To 50% Off",
    buttonText: "BUY NOW",
  },
];

const categories: Category[] = [
  { name: "Men's Clothing", subcategories: ["Shirts", "Pants", "Jackets", "T-Shirts"] },
  { name: "Women's Clothing", subcategories: ["Dresses", "Tops", "Skirts", "Jackets"] },
  { name: "Accessories", subcategories: ["Belts", "Hats", "Sunglasses", "Scarves"] },
  { name: "Electronics", subcategories: ["Laptops", "Phones", "Headphones", "Speakers"] },
  { name: "Jewellery", subcategories: ["Necklaces", "Rings", "Bracelets", "Earrings"] },
  { name: "Bags & Backpacks", subcategories: ["Handbags", "Backpacks", "Wallets", "Travel Bags"] },
  { name: "Watches", subcategories: ["Smart Watches", "Analog", "Digital", "Luxury"] },
];

const navigationItems: NavigationItem[] = [
  { name: "HOME", id: "home" },
  { name: "SHOP", id: "shop" },
  { name: "PAGES", id: "pages" },
  { name: "BLOG", id: "blog" },
  { name: "ELEMENTS", id: "elements" },
  { name: "BUY NOW", id: "buy-now" },
];

// Utility function to get placeholder image
const getPlaceholderImage = (productName: string, category: string) => {
  const encodedName = encodeURIComponent(productName);
  return `https://via.placeholder.com/400x400/f3f4f6/6b7280?text=${encodedName}`;
};

/* ---------- Hero component ---------- */
const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center overflow-hidden">
      <div className="container mx-auto px-8 flex items-center justify-between">
        <div className="flex-1 text-black">
          <p className="text-yellow-300 font-semibold mb-4 text-4xl">
            {heroSlides[currentSlide].subtitle}
          </p>
          <h1 className="text-6xl font-bold mb-4 leading-tight">
            {heroSlides[currentSlide].title}
          </h1>
          <p className="text-3xl font-light mb-8">{heroSlides[currentSlide].discount}</p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
            {heroSlides[currentSlide].buttonText}
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={heroSlides[currentSlide].img}
            alt={heroSlides[currentSlide].title}
            className="w-[28rem] h-[28rem] object-contain drop-shadow-2xl transition-all duration-500"
          />
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-yellow-400 transition-colors"
      >
        <ChevronLeft size={40} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-yellow-400 transition-colors"
      >
        <ChevronRight size={40} />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "bg-yellow-400" : "bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------- main component ---------- */
const KapeeStore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeNavItem, setActiveNavItem] = useState<string>("home");
  const [expandedCategory, setExpandedCategory] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loadingProducts, setLoadingProducts] = useState<{[key: string]: boolean}>({});
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Check if user is logged in
  const checkLoginStatus = () => {
    const token = getToken();
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    
    if (token && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setUserRole(storedUserRole || "user");
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setUserRole("");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    setCartCount(0);
    setShowUserDropdown(false);
    
    // Redirect to home
    window.location.href = "/";
  };

  // Navigate to dashboard or profile
  const handleUserMenuClick = () => {
    if (userRole === "admin") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/profile";
    }
  };

  // Fetch real products from database
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      
      if (response.ok) {
        const data = await response.json();
        console.log("Products loaded:", data);
        
        // Take first 4 products for featured section
        const products = data.data || [];
        setFeaturedProducts(products.slice(0, 4));
      } else {
        console.error("Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  // Add item to cart via API
  const addToCart = async (productId: string, quantity: number = 1) => {
     setLoadingProducts(prev => ({ ...prev, [productId]: true }));    
    try {
      const token = getToken();
      console.log("Token found:", token ? "Yes" : "No");
      
      if (!token) {
        alert("Please login to add items to cart");
        setLoadingProducts(prev => ({ ...prev, [productId]: false }));
        return;
      }

      console.log("Adding to cart:", { productId, quantity });

      const response = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
        }),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (response.ok) {
        alert("Item added to cart successfully!");
        fetchCartCount(); // Update cart count
      } else {
        console.error("Add to cart failed:", responseData);
        alert(responseData.message || "Failed to add item to cart");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check if your server is running on http://localhost:3000");
    } finally {
      setLoadingProducts(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch("http://localhost:3000/cart/get", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Cart data:", data); // Debug log
        
        // Updated to match new backend response structure
        if (data.success && data.data && data.data.items) {
          const count = data.data.items.reduce((total: number, item: any) => total + item.quantity, 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      }
    } catch (err) {
      console.log("Failed to fetch cart count:", err);
      setCartCount(0);
    }
  };

  // Load products, cart count, and check login status on component mount
  useEffect(() => {
    checkLoginStatus();
    fetchProducts();
    fetchCartCount();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveNavItem("category");
    if (expandedCategory === categoryName) {
      setExpandedCategory("");
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const navigateToCart = () => {
    window.location.href = '/cart';
  };

  /* ---------- main content render ---------- */
  const renderMainContent = () => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      return (
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">{selectedCategory}</h1>
            <div className="w-20 h-1 bg-yellow-400 mb-8"></div>
          </div>

          {category?.subcategories && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {category.subcategories.map((sub, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-black">{sub}</h3>
                </div>
              ))}
            </div>
          )}

          {/* Show real products for this category - FIXED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts
              .filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase())
              .map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
                  {/* FIXED IMAGE SECTION */}
                  <div className="h-48 relative overflow-hidden bg-gray-100">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = getPlaceholderImage(product.name, product.category);
                        }}
                      />
                    ) : (
                      <img
                        src={getPlaceholderImage(product.name, product.category)}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product._id)}
                        disabled={loadingProducts[product._id]}
                        className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        {loadingProducts[product._id] ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }

    switch (activeNavItem) {
      case "home":
        return (
          <>
            <HeroSection />

            {/* FIXED Featured Products Section with Real Products */}
            <div className="py-16 bg-gray-50">
              <div className="container mx-auto px-8">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Featured Products</h2>
                
                {productsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p>Loading products...</p>
                  </div>
                ) : featuredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No products found. Make sure your backend is running.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group"
                        onClick={() => openProductModal(product)}
                      >
                        <div className="p-6 h-96 flex flex-col justify-between">
                          <div className="text-black">
                            <p className="text-yellow-500 font-semibold text-sm mb-2 uppercase">
                              {product.category}
                            </p>
                            <h3 className="text-xl font-bold mb-2 leading-tight">
                              {product.name}
                            </h3>
                            <p className="text-sm mb-6 line-clamp-3">{product.description}</p>
                          </div>

                          {/* FIXED IMAGE SECTION WITH HOVER STABILITY */}
                          <div className="flex-1 flex items-center justify-center mb-4">
                            <div className="w-32 h-32 relative overflow-hidden rounded-lg bg-gray-100">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.src = getPlaceholderImage(product.name, product.category);
                                  }}
                                />
                              ) : (
                                <img
                                  src={getPlaceholderImage(product.name, product.category)}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-center">
                              <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                            </div>
                            <button
                              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                              disabled={loadingProducts[product._id]}
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product._id);
                              }}
                            >
                              {loadingProducts[product._id] ? "ADDING..." : "ADD TO CART"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case "shop":
        return (
          <div className="p-8">
            <Shop />
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Shop All Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer" onClick={() => handleCategoryClick(category.name)}>
                  <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4"></div>
                  <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case "blog":
        return (
          <div className="p-8">
            <Blogs />
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Latest Blog Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((post) => (
                <article key={post} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-300"></div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl text-gray-800 mb-3">Fashion Trends {post}</h3>
                    <p className="text-gray-600 mb-4">Discover the latest fashion trends and styling tips for the modern wardrobe...</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Sept 3, 2025</span>
                      <button className="text-yellow-600 hover:text-yellow-700 font-semibold">Read More</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{activeNavItem.toUpperCase()}</h1>
            <p className="text-gray-600 text-lg">Content for {activeNavItem} section coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 lg:hidden">
                <Menu size={24} />
              </button>
              <div className="text-3xl font-bold text-gray-800">kapee.</div>
            </div>

            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, categories, brands, sku..."
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-l-lg focus:outline-none focus:border-yellow-400"
                />
                <select className="absolute right-0 top-0 h-full px-4 border-l border-gray-300 bg-white text-gray-600">
                  <option>All Categories</option>
                </select>
              </div>
              <button className="bg-gray-800 text-white px-6 py-2 rounded-r-lg hover:bg-gray-700 transition-colors">
                <Search size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Authentication Section */}
              <div className="hidden md:block text-sm">
                <div className="text-gray-500">HELLO,</div>
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="font-semibold text-gray-800 hover:text-yellow-600 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <span>{userName.toUpperCase()}</span>
                      <User size={16} />
                    </button>
                    
                    {/* User Dropdown */}
                    {showUserDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-2">
                          <div className="px-3 py-2 text-sm text-gray-500 border-b">
                            {userRole === "admin" ? "Administrator" : "User"}
                          </div>
                          <button
                            onClick={handleUserMenuClick}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center space-x-2"
                          >
                            <User size={16} />
                            <span>{userRole === "admin" ? "Dashboard" : "Profile"}</span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded flex items-center space-x-2"
                          >
                            <LogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="font-semibold text-gray-800 hover:text-yellow-600 transition-colors cursor-pointer"
                  >
                    SIGN IN
                  </button>
                )}
              </div>

              <button className="relative text-gray-600 hover:text-gray-800">
                <Heart size={24} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <button 
                className="relative text-gray-600 hover:text-gray-800" 
                onClick={navigateToCart}
              >
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              <div className="hidden md:block text-sm font-semibold">
                Cart<br />${(cartCount * 149.99).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex items-center bg-yellow-400 px-4 py-2 rounded text-gray-800 font-semibold hover:bg-yellow-500 transition-colors mr-8">
              <Menu size={16} className="mr-2" />
              SHOP BY CATEGORIES
            </button>

            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNavItem(item.id);
                    setSelectedCategory("");
                  }}
                  className={`font-semibold transition-colors ${
                    activeNavItem === item.id ? "text-yellow-600" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
          <div className="p-4">
            {categories.map((category, index) => (
              <div key={index} className="mb-2">
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedCategory === category.name ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <ChevronRight size={16} className={`transition-transform duration-200 ${expandedCategory === category.name ? "rotate-90" : ""}`} />
                </button>

                {expandedCategory === category.name && category.subcategories && (
                  <div className="mt-2 ml-4 space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <button key={subIndex} className="block w-full text-left p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded">
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="flex-1">{renderMainContent()}</main>
      </div>

      {/* FIXED Product Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-800 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* FIXED MODAL IMAGE SECTION */}
                <div className="relative overflow-hidden rounded-xl bg-gray-100">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = getPlaceholderImage(selectedProduct.name, selectedProduct.category);
                      }}
                    />
                  ) : (
                    <img
                      src={getPlaceholderImage(selectedProduct.name, selectedProduct.category)}
                      alt={selectedProduct.name}
                      className="w-full h-80 object-cover"
                    />
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-yellow-600 font-semibold text-sm mb-2">{selectedProduct.category}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.name}</h3>
                    <p className="text-lg text-gray-600 font-medium mb-4">{selectedProduct.description}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-3xl font-bold text-gray-800">${selectedProduct.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
                      disabled={loadingProducts[selectedProduct._id]}
                      onClick={() => addToCart(selectedProduct._id)}
                    >
                      {loadingProducts[selectedProduct._id] ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductCarouselDemo />
      <BestSellingProducts />
      <Freeshipping />
    </div>
  );
};

export default KapeeStore;