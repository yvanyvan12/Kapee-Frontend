import React from "react";
import airpods from '../assets/airpods.jpg';
import cam from '../assets/cam.jpg';
import xbox from '../assets/xbox.jpg';
import virtualreality from '../assets/virtualreality.jpg';
import applewatch from '../assets/applewatch.jpeg';
import jbl from '../assets/jbl.jpeg';
import head from '../assets/head.jpeg';
import iphone11 from '../assets/iphone11.jpg';

interface Product {
  id: number;
  name: string;
  price: number | string;
  originalPrice?: number;
  image: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

// ✅ Sample Data
const featuredProducts: Product[] = [
  { id: 1, name: "Apple AirPods with Wireless Case", price: 85.00, 
    image: airpods },
  { id: 2, name: "JBL Wireless Bluetooth Speaker", price: 96.00, 
    image: jbl },
  { id: 3, name: "JBL On-Ear Headphones", price: 124.00,
     image: head },
];

const recentProducts: Product[] = [
  { id: 1, name: "Apple iPhone 11 Pro Max 256GB", price: 199.00, originalPrice: 254.00, 
    image: iphone11 },
  {
    id: 2, 
    name: "Apple AirPods with Wireless Case",
    price: 85.00,  
    image: airpods 
  },
  { 
    id: 3, 
    name: "Apple Watch Series 5", 
    price: "499.00 - 599.00", 
    image: applewatch 
  },
];

const onSaleProducts: Product[] = [
  { id: 1, name: "Apple iPhone 11 Pro Max 256GB", price: 199.00, originalPrice: 254.00, 
    image: iphone11 },
  { id: 2, name: "Apple Watch Series 5", price: "499.00 - 599.00", 
    image: applewatch },
  { id: 3, name: "Samsung Gear 360 Camera", price: 29.00, originalPrice: 48.00, 
    image: cam },
];

const topRatedProducts: Product[] = [
  { id: 1, name: "Samsung Virtual Reality Headset", price: 18.00,
     image: virtualreality },
  { id: 2, name: "Microsoft Xbox One Wireless Controller", price: 25.00, originalPrice: 45.00,
     image: xbox },
  { id: 3, name: "Apple Watch Series 5 Black Milanese Loop", price: 599.00, 
    image: applewatch },
];

// ✅ Reusable Section Component
const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  return (
    <div className="bg-white">
      <h3 className="text-lg font-bold uppercase border-b-2 border-yellow-400 pb-2 mb-6 text-gray-800">
        {title}
      </h3>
      <ul className="space-y-5">
        {products.map((product) => (
          <li key={product.id} className="flex items-start space-x-4">
            {/* Image Container */}
            <div className="flex-shrink-0">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-16 h-16 object-cover rounded-lg bg-gray-50 p-1" 
              />
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 leading-tight mb-2 line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {typeof product.price === 'string' && product.price.includes('-') 
                    ? `$${product.price}` 
                    : `$${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}`
                  }
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-gray-400">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ✅ Main Component
const ProductTabs: React.FC = () => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 bg-white p-8 rounded-lg shadow-sm max-w-7xl mx-auto">
        <ProductSection title="Featured" products={featuredProducts} />
        <ProductSection title="Recent" products={recentProducts} />
        <ProductSection title="On Sale" products={onSaleProducts} />
        <ProductSection title="Top Rated" products={topRatedProducts} />
      </div>
    </div>
  );
};

export default ProductTabs;