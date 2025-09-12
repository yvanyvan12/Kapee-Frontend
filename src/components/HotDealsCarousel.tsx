import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Search } from 'lucide-react';
import airpods from '../assets/airpods.jpg';
import cam from '../assets/cam.jpg';
import xbox from '../assets/xbox.jpg';
import applewatch from '../assets/applewatch.jpeg';
import jbl from '../assets/jbl.jpeg';
import head from '../assets/head.jpeg';
import iphone11 from '../assets/iphone11.jpg';
import s20 from '../assets/s20.jpeg';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  featured?: boolean;
  badge?: string;
  bgColor?: string;
  badgeColor?: string;
}

// Sample data for Hot Deals
const hotDealsProducts: Product[] = [
  {
    id: 1,
    name: "Microsoft Xbox One Wireless Controller",
    category: "ELECTRONICS",
    price: 25.00,
    originalPrice: 45.00,
    discount: "44% OFF",
    image: xbox,
    badge: "44% OFF",
    bgColor: "bg-red-500",
  },
  {
    id: 2,
    name: "Sony PlayStation 5 DualSense Controller",
    category: "ELECTRONICS",
    price: 55.00,
    originalPrice: 70.00,
    discount: "21% OFF",
    image: xbox,
    badge: "21% OFF",
    bgColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Nintendo Switch Pro Controller",
    category: "ELECTRONICS",
    price: 45.00,
    originalPrice: 70.00,
    discount: "36% OFF",
    image: xbox,
    badge: "36% OFF",
    bgColor: "bg-green-500",
  }
];

// Sample data for Featured Products
const featuredProductsData: Product[] = [
  {
    id: 1,
    name: "Apple iPhone 11 Pro Max",
    category: "ELECTRONICS",
    price: 199.00,
    originalPrice: 254.00,
    discount: "22% OFF",
    image: iphone11,
    badge: "22% OFF",
    badgeColor: "bg-red-500",
  },
  {
    id: 2,
    name: "Apple Watch Series 5",
    category: "ELECTRONICS",
    price: 499.00,
    originalPrice: 599.00,
    discount: "17% OFF",
    image: applewatch,
    badge: "17% OFF",
    badgeColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "JBL Wireless Bluetooth Speaker",
    category: "ELECTRONICS",
    price: 96.00,
    image: jbl,
    featured: true,
    badge: "FEATURED",
    badgeColor: "bg-green-500",
  },
  {
    id: 4,
    name: "JBL On-Ear Headphones",
    category: "ELECTRONICS",
    price: 124.00,
    image: head,
    featured: true,
    badge: "FEATURED",
    badgeColor: "bg-purple-500",
  },
  {
    id: 5,
    name: "Apple AirPods with Wireless Charging Case",
    category: "ELECTRONICS",
    price: 85.00,
    image: airpods,
    featured: true,
    badge: "FEATURED",
    badgeColor: "bg-pink-500",
  },
  {
    id: 6,
    name: "Samsung Galaxy S20 8GB RAM",
    category: "ELECTRONICS",
    price: 250.00,
    image: s20,
    badge: "NEW",
    badgeColor: "bg-yellow-500",
  },
  {
    id: 7,
    name: "Samsung Gear 360 Camera",
    category: "ELECTRONICS",
    price: 29.00,
    originalPrice: 48.00,
    discount: "40% OFF",
    image:cam,
    badge: "40% OFF",
    badgeColor: "bg-orange-500",
  },
  {
    id: 8,
    name: "Apple Watch Series 5 Black",
    category: "ELECTRONICS",
    price: 599.00,
    image: applewatch,
    badge: "PREMIUM",
    badgeColor: "bg-black",
  }
];

// Hot Deals Carousel Component
const HotDealsCarousel: React.FC<{products: Product[]; onProductClick?: (product: Product) => void;}> = ({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const currentProduct = products[currentIndex];

  // Countdown timer (static for demo)
  const countdown = { days: 453, hours: 1, minutes: 40, seconds: 10 };

  return (
    <div className="bg-white border-2 border-yellow-400 rounded-2xl p-6 shadow-lg relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 border-b-2 border-yellow-400 pb-1">HOT DEALS</h3>
      </div>

      <div className="relative">
        {/* Navigation Arrows */}
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

        {/* Product Display */}
        <div className="mx-8">
          <div className="relative">
            {currentProduct.badge && (
              <div className={`absolute top-2 left-2 ${currentProduct.bgColor || 'bg-green-500'} text-white text-xs font-bold px-2 py-1 rounded z-10`}>
                {currentProduct.badge}
              </div>
            )}
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10">
              <Heart size={20} />
            </button>

            <div className="bg-gray-50 rounded-xl p-4 mb-4 flex items-center justify-center">
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name} 
                className="w-full h-32 object-contain rounded-lg"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{currentProduct.category}</p>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">{currentProduct.name}</h4>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-lg font-bold text-gray-800">${currentProduct.price.toFixed(2)}</span>
              {currentProduct.originalPrice && (
                <span className="text-sm text-gray-500 line-through">${currentProduct.originalPrice.toFixed(2)}</span>
              )}
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
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1"
              onClick={() => onProductClick?.(currentProduct)}
            >
              <ShoppingCart size={16} />
              <span>ADD TO CART</span>
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors">
              <Search size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Product Indicators */}
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
        </div>
      </div>

      {/* Sale Badge */}
      <div className="absolute -bottom-4 -left-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center transform -rotate-12 shadow-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">85</div>
          <div className="text-xs">%</div>
        </div>
      </div>
    </div>
  );
};

// Featured Products Carousel Component
const FeaturedProductsCarousel: React.FC<{products: Product[]; onProductClick?: (product: Product) => void;}> = ({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

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

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold text-gray-800">FEATURED PRODUCTS</h2>
          <div className="w-16 h-1 bg-yellow-400"></div>
        </div>
        <div className="flex items-center space-x-4">
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
          <button className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
            VIEW ALL
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={() => onProductClick?.(product)}
          >
            <div className="relative p-4">
              {product.badge && (
                <div className={`absolute top-2 left-2 ${product.badgeColor || 'bg-gray-500'} text-white text-xs font-bold px-2 py-1 rounded z-10`}>
                  {product.badge}
                </div>
              )}
              <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10">
                <Heart size={20} />
              </button>

              <div className="bg-gray-50 rounded-lg mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = iphone11;
                  }}
                />
              </div>
            </div>

            <div className="p-4 pt-0">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className="font-semibold text-gray-800 mb-2 text-sm hover:text-yellow-600 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-800">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel Indicators */}
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
    </div>
  );
};

// Main Demo Component
const ProductCarouselDemo: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Here you could open a modal or navigate to product details
    console.log('Selected product:', product);
  };

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
              products={featuredProductsData} 
              onProductClick={handleProductClick}
            />
          </div>
        </div>

        {/* Selected Product Display */}
        {selectedProduct && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Selected Product:</h3>
            <p className="text-gray-600">{selectedProduct.name} - ${selectedProduct.price.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarouselDemo;
