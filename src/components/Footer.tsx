// Footer.tsx
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaFlickr,
  FaRss,
  FaYoutube,
} from "react-icons/fa";
import { MdHome, MdPhone, MdEmail, MdAccessTime } from "react-icons/md";

// Import payment card images from assets
import visaImg from "../assets/Visa.png";
import paypalImg from "../assets/Paypal.png";
import discoverImg from "../assets/Discover.png";
import maestroImg from "../assets/Maestro.png";
import mastercardImg from "../assets/Mastercard.png";
import amexImg from "../assets/American express.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-white pt-12 pb-6">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo & Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">kapee.</h2>
          <p className="text-sm mb-4">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MdHome className="text-lg" /> Lorem Ipsum, 2046 Lorem Ipsum
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-lg" /> 576-245-2478
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-lg" /> info@kapee.com
            </li>
            <li className="flex items-center gap-2">
              <MdAccessTime className="text-lg" /> Mon - Fri / 9:00 AM - 6:00 PM
            </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">INFORMATION</h3>
          <ul className="text-sm space-y-2">
            <li>About Us</li>
            <li>Store Location</li>
            <li>Contact Us</li>
            <li>Shipping & Delivery</li>
            <li>Latest News</li>
            <li>Our Sitemap</li>
          </ul>
        </div>

        {/* Our Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4">OUR SERVICE</h3>
          <ul className="text-sm space-y-2">
            <li>Privacy Policy</li>
            <li>Terms of Sale</li>
            <li>Customer Service</li>
            <li>Delivery Information</li>
            <li>Payments</li>
            <li>Saved Cards</li>
          </ul>
        </div>

        {/* My Account */}
        <div>
          <h3 className="text-lg font-semibold mb-4">MY ACCOUNT</h3>
          <ul className="text-sm space-y-2">
            <li>My Account</li>
            <li>My Shop</li>
            <li>My Cart</li>
            <li>Checkout</li>
            <li>My Wishlist</li>
            <li>Tracking Order</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="-ml-20">
          <h3 className="text-lg font-semibold mb-4">NEWSLETTER</h3>
          <p className="text-sm mb-2">
            Subscribe to our mailing list to get the new updates!
          </p>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <span className="px-3 text-white">
              <MdEmail />
            </span>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-2 py-2 text-sm outline-none"
            />
            <button className="bg-yellow-500 text-white px-4 py-2 font-semibold text-sm">
              SIGN UP
            </button>
          </div>
          {/* Social Icons */}
          <div className="flex gap-2 mt-4">
            <FaFacebookF className="w-7 h-7 text-white bg-[#3b5998] p-1" />
            <FaTwitter className="w-7 h-7 text-white bg-[#000000] p-1" />
            <FaLinkedinIn className="w-7 h-7 text-white bg-[#0e76a8] p-1" />
            <FaInstagram className="w-7 h-7 text-white bg-[#E1306C] p-1" />
            <FaFlickr className="w-7 h-7 text-white bg-[#ff0084] p-1" />
            <FaRss className="w-7 h-7 text-white bg-[#f26522] p-1" />
            <FaYoutube className="w-7 h-7 text-white bg-[#ff0000] p-1" />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-200 pt-4 text-sm text-white flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
        <span>Kapee © 2025 by PressLayouts All Rights Reserved.</span>
        <div className="flex gap-3 mt-2 md:mt-0">
          <img src={visaImg} alt="Visa" className="h-7" />
          <img src={paypalImg} alt="PayPal" className="h-7" />
          <img src={discoverImg} alt="Discover" className="h-7" />
          <img src={maestroImg} alt="Maestro" className="h-7" />
          <img src={mastercardImg} alt="Mastercard" className="h-7" />
          <img src={amexImg} alt="American Express" className="h-7" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;