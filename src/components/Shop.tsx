import { useState } from 'react';
import { Heart, ShoppingCart, Grid, List, ChevronDown, Star, X, Eye } from 'lucide-react';
import image1 from '../assets/image.png';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';
import image6 from '../assets/image6.jpg';
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
}

const EcommerceShop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [viewMode, setViewMode] = useState<string>('grid');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);


  const categories = [
    { name: 'Accessories', count: 7 },
    { name: 'Bags & Backpacks', count: 4 },
    { name: 'Beauty & Care', count: 2 },
    { name: 'Jewellery', count: 4 },
    { name: 'Men', count: 7 },
    { name: 'Shoes', count: 4 },
    { name: 'Watches', count: 4 },
    { name: 'Women', count: 9 }
  ];

  const products = [
    {
      id: 1,
      name: 'Men Aviator Sunglasses',
      category: 'SOCKS, SUNGLASSES',
      price: 50.00,
      originalPrice: 60.00,
      discount: '17% Off',
      rating: 4,
      reviews: 1,
      image: image1,
      description: 'Classic aviator sunglasses with UV protection and premium metal frame.',
      colors: ['Black', 'Silver', 'Gold'],
      sizes: ['One Size']
    },
    {
      id: 2,
      name: 'Light Blue Solid Low Rise Skinny Fit Jeans',
      category: 'JEANS',
      price: 89.00,
      originalPrice: 96.00,
      discount: '7% Off',
      rating: 2,
      reviews: 1,
      image: image2,
      description: 'Comfortable skinny fit jeans perfect for casual wear.',
      colors: ['Light Blue', 'Dark Blue', 'Black'],
      sizes: ['28', '30', '32', '34', '36']
    },
    {
      id: 3,
      name: 'Unisex Tan Solid Cabin Trolley Bag',
      category: 'TROLLEY BAG',
      price: 278.00,
      originalPrice: null,
      discount: null,
      rating: 3,
      reviews: 1,
      image: image3,
      description: 'Durable cabin trolley bag with 4 wheels and TSA lock.',
      colors: ['Tan', 'Black', 'Navy'],
      sizes: ['Cabin Size']
    },
    {
      id: 4,
      name: 'Wireless Bluetooth Headphones',
      category: 'ACCESSORIES',
      price: 120.00,
      originalPrice: 150.00,
      discount: '20% Off',
      rating: 5,
      reviews: 23,
      image: image4,
      description: 'Premium wireless headphones with noise cancellation.',
      colors: ['Black', 'White', 'Silver'],
      sizes: ['One Size']
    },
    {
      id: 5,
      name: 'Leather Crossbody Bag',
      category: 'BAGS & BACKPACKS',
      price: 85.00,
      originalPrice: 100.00,
      discount: '15% Off',
      rating: 4,
      reviews: 12,
      image: image5,
      description: 'Elegant leather crossbody bag for everyday use.',
      colors: ['Brown', 'Black', 'Cognac'],
      sizes: ['Medium']
    },
    {
      id: 6,
      name: 'Smart Fitness Watch',
      category: 'WATCHES',
      price: 199.00,
      originalPrice: 249.00,
      discount: '20% Off',
      rating: 5,
      reviews: 45,
      image: image6,
      description: 'Advanced fitness tracking with heart rate monitoring.',
      colors: ['Black', 'Silver', 'Rose Gold'],
      sizes: ['S/M', 'L/XL']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const toggleWishlist = (productId: number) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    console.log('Adding to cart:', product.name);
    // TODO: Implement cart functionality
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star 
          key={star} 
          size={14} 
          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      <span className="text-sm text-gray-500 ml-1">({reviews})</span>
    </div>
  );

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
                  min="0" 
                  max="500" 
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    $35
                  </span>
                </div>
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
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Hover Buttons */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors transform -translate-y-2 group-hover:translate-y-0"
                        >
                          <ShoppingCart size={18} />
                         <Link to="/Cart">Add to Cart</Link> 
                        </button>
                        <Link 
                          to="/Cart" 
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors transform -translate-y-2 group-hover:translate-y-0"
                        >
                          View Cart
                        </Link>
                        <button 
                          onClick={() => openProductModal(product)}
                          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors transform -translate-y-2 group-hover:translate-y-0"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart 
                        size={18} 
                        className={wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button>

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {product.discount}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    
                    <StarRating rating={product.rating} reviews={product.reviews} />
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <span className="text-sm text-green-600 font-medium">{product.discount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
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
                <div>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-2">{selectedProduct.category}</div>
                  <StarRating rating={selectedProduct.rating} reviews={selectedProduct.reviews} />
                  
                  <div className="flex items-center gap-2 my-4">
                    <span className="text-3xl font-bold text-gray-900">${selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">${selectedProduct.originalPrice}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Colors:</h4>
                    <div className="flex gap-2">
                      {selectedProduct.colors.map(color => (
                        <button key={color} className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Sizes:</h4>
                    <div className="flex gap-2">
                      {selectedProduct.sizes.map(size => (
                        <button key={size} className="border px-3 py-1 rounded text-sm hover:bg-gray-50">
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      setShowModal(false);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcommerceShop;