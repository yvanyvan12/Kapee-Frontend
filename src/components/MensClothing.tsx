// MensClothing.tsx
import React from "react";

interface MensClothingProps {
  selectedCategory: string;
}

const MensClothing: React.FC<MensClothingProps> = ({ selectedCategory }) => {
  const subcategories = ["Shirts", "Pants", "Jackets", "T-Shirts"];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-4">{selectedCategory}</h1>
        <div className="w-20 h-1 bg-yellow-400 mb-8"></div>
      </div>

      {/* Subcategories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {subcategories.map((sub, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <h3 className="font-semibold text-black">{sub}</h3>
          </div>
        ))}
      </div>

      {/* Dummy products */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="p-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Product {item}
              </h3>
              <p className="text-gray-600 mb-4">
                High quality {selectedCategory.toLowerCase()} item
              </p>
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
};

export default MensClothing;
