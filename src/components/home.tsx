import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingCart,  ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';

import ProductCarouselDemo from "./HotDealsCarousel";
import BestSellingProducts from './bestSellingProducts';
import Freeshipping from './Freeshipping';
import Shop from "./Shop.tsx";
import Blogs from "./Blogs.tsx";
import Elements from "./Elements";
import image1 from '../assets/image.png';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
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

interface ProductCard {
  id: number;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
  textColor: string;
}

interface HeroSlide {
  title: string;
  subtitle: string;
  img: string;
  discount: string;
  buttonText: string;
}

const heroSlides: HeroSlide[] = [
  {
    title: "WIRELESS CHARGING STAND",
    subtitle: "BEST SMARTPHONE",
    img: heroImg1,
    discount: "Up To 70% Off",
    buttonText: "BUY NOW"
  },
  {
    title: "HEADPHONES",
    subtitle: "PREMIUM AUDIO",
    img: heroImg2,
    discount: "Min. 40-80% Off",
    buttonText: "SHOP NOW"
  },
  {
    title: "SMARTWATCH",
    subtitle: "LATEST TECHNOLOGY",
    img: heroImg3,
    discount: "Up To 50% Off",
    buttonText: "BUY NOW"
  }
];

const featuredProducts: ProductCard[] = [
  {
    id: 1,
    title: "WIRELESS SPEAKER",
    subtitle: "DIGITAL SMART",
    discount: "MIN. 30-75% OFF",
    image: image1,
    textColor: "text-gray-800"
  },
  {
    id: 2,
    title: "WATCH CHARGER",
    subtitle: "DIGITAL SMART",
    discount: "UP TO 75% OFF",
    image: image2,
    textColor: "text-gray-800"
  },
  {
    id: 3,
    title: "SMARTPHONE",
    subtitle: "LATEST MODEL",
    discount: "UP TO 60% OFF",
    image: image3,
    textColor: "text-white"
  },
  {
    id: 4,
    title: "HEADPHONES",
    subtitle: "PREMIUM AUDIO",
    discount: "MIN. 40-80% OFF",
    image: image4,
    textColor: "text-white"
  }
];

const categories: Category[] = [
  { name: "Men's Clothing", 
    subcategories: ["Shirts", "Pants", "Jackets", "T-Shirts"] },
  {
     name: "Women's Clothing", 
    subcategories: ["Dresses", "Tops", "Skirts", "Jackets"]
   },
  { name: "Accessories", subcategories: ["Belts", "Hats", "Sunglasses", "Scarves"] },
  { name: "Shoes", subcategories: ["Sneakers", "Boots", "Sandals", "Formal"] },
  { name: "Jewellery", subcategories: ["Necklaces", "Rings", "Bracelets", "Earrings"] },
  { name: "Bags & Backpacks", subcategories: ["Handbags", "Backpacks", "Wallets", "Travel Bags"] },
  { name: "Watches", subcategories: ["Smart Watches", "Analog", "Digital", "Luxury"] },
  { name: "Dresses", subcategories: ["Casual", "Formal", "Party", "Summer"] }
];

const navigationItems: NavigationItem[] = [
  { name: "HOME", id: "home" },
  { name: "SHOP", id: "shop" },
  { name: "PAGES", id: "pages" },
  { name: "BLOG", id: "blog" },
  { name: "ELEMENTS", id: "elements" },
  { name: "BUY NOW", id: "buy-now" }
];

// Hero Section Component - moved outside of the main component
const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
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
        {/* Left Text */}
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

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroSlides[currentSlide].img}
            alt={heroSlides[currentSlide].title}
            className="w-[28rem] h-[28rem] object-contain drop-shadow-2xl transition-all duration-500"
          />
        </div>
      </div>

      {/* Arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? 'bg-yellow-400' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

const KapeeStore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeNavItem, setActiveNavItem] = useState<string>('home');
  const [expandedCategory, setExpandedCategory] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductCard | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveNavItem('category');
    if (expandedCategory === categoryName) {
      setExpandedCategory('');
    } else {
      setExpandedCategory(categoryName);
    }
  };

  const openProductModal = (product: ProductCard) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };



  const renderMainContent = () => {
    if (selectedCategory) {
      const category = categories.find(cat => cat.name === selectedCategory);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Product {item}</h3>
                  <p className="text-gray-600 mb-4">High quality {selectedCategory.toLowerCase()} item</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-800">$99.99</span>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors">
                      Add to Cart
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
      case 'home':
        return (
          <>
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Products Section */}
            <div className="py-16 bg-gray-50">
              <div className="container mx-auto px-8">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
                  Featured Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden"
                      onClick={() => openProductModal(product)}
                    >
                      <div className="p-6 h-96 flex flex-col justify-between">
                        {/* ✅ Force text color black */}
                        <div className="text-black">
                          <p className="text-yellow-500 font-semibold text-sm mb-2">
                            {product.subtitle}
                          </p>
                          <h3 className="text-xl font-bold mb-2 leading-tight">
                            {product.title}
                          </h3>
                          <p className="text-sm mb-6">{product.discount}</p>
                        </div>

                        {/* ✅ Product image */}
                        <div className="flex-1 flex items-center justify-center mb-4">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="max-h-40 object-contain"
                          />
                        </div>

                        {/* ✅ Button now visible at bottom */}
                        <button
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            openProductModal(product);
                          }}
                        >
                          SHOP NOW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );
        
      case 'shop':
        return (
          <div className="p-8">
            <Shop />
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Shop All Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
                     onClick={() => handleCategoryClick(category.name)}>
                  <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4"></div>
                  <h3 className="font-semibold text-lg text-gray-800">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'blog':
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
            <Elements/>
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
            {/* Logo */}
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 lg:hidden"
              >
                <Menu size={24} />
              </button>
              <div className="text-3xl font-bold text-gray-800">kapee.</div>
            </div>

            {/* Search Bar */}
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

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-sm">
                <div className="text-gray-500">HELLO,</div>
                <div className="font-semibold">SIGN IN</div>
              </div>
              <button className="relative text-gray-600 hover:text-gray-800">
                <Heart size={24} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>
              <button className="relative text-gray-600 hover:text-gray-800">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>
              <div className="hidden md:block text-sm font-semibold">
                Cart<br />$0.00
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center bg-yellow-400 px-4 py-2 rounded text-gray-800 font-semibold hover:bg-yellow-500 transition-colors mr-8"
            >
              <Menu size={16} className="mr-2" />
              SHOP BY CATEGORIES
            </button>
            
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNavItem(item.id);
                    setSelectedCategory('');
                  }}
                  className={`font-semibold transition-colors ${
                    activeNavItem === item.id
                      ? 'text-yellow-600'
                      : 'text-gray-600 hover:text-gray-800'
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
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
          <div className="p-4">
            {categories.map((category, index) => (
              <div key={index} className="mb-2">
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedCategory === category.name
                      ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform duration-200 ${
                      expandedCategory === category.name ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                
                {expandedCategory === category.name && category.subcategories && (
                  <div className="mt-2 ml-4 space-y-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <button
                        key={subIndex}
                        className="block w-full text-left p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {renderMainContent()}
        </main>
      </div>

      {/* Product Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-xl p-8 flex items-center justify-center h-80">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <p className="text-yellow-600 font-semibold text-sm mb-2">{selectedProduct.subtitle}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{selectedProduct.title}</h3>
                    <p className="text-lg text-green-600 font-semibold mb-4">{selectedProduct.discount}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-4">
                      Experience premium quality with this {selectedProduct.title.toLowerCase()}. 
                      Designed with cutting-edge technology and superior craftsmanship for the best user experience.
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-gray-800">$149.99</span>
                      <span className="text-lg text-gray-500 line-through">$599.99</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors">
                      Add to Cart
                    </button>
                    <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
                      Add to Wishlist
                    </button>
                  </div>

                  {/* Product Features */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                        Premium build quality
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                        Advanced technology
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                        1-year warranty included
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                        Free shipping available
                      </li>
                    </ul>
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