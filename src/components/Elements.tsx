import React from 'react';

const Elements: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-10">Elements</h1>
      <nav className="mt-5">
        <ul className="flex flex-wrap justify-center space-x-10">
          <li className="text-lg">
            <a href="#" className="text-gray-800 hover:text-blue-500">Home</a>
          </li>
          <li className="text-lg">
            <a href="#" className="text-gray-800 hover:text-blue-500">Elements</a>
          </li>
        </ul>
      </nav>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 max-w-6xl">
        {[
          "Typography",
          "Headings",
          "Buttons",
          "Social Buttons",
          "Progress Bar",
          "Info Box",
          "Instagram",
          "Tabs",
          "Talks",
          "Accordion",
          "Blog Listing",
          "Products Grid Carousel",
          "Products With Banner",
          "Products Categories",
          "Image Gallery",
          "Recently Viewed Products",
          "Testimonials",
          "Counter",
          "Countdown Timer",
          "Hot Deal Products",
          "Products Widgets",
          "Portfolio Listing",
          "Portfolio Carousel",
          "Products Categories Thumbnail",
          "Team",
          "Tours",
        ].map((element) => (
          <div key={element} className="text-center">
            <a href="#" className="text-lg text-gray-800 hover:text-blue-500">
              {element}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Elements;