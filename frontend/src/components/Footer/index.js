import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-2">🛍️</span>
              <h3 className="text-xl font-bold">ProductHub</h3>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your one-stop destination for discovering amazing products. 
              We provide a seamless shopping experience with intelligent search 
              and comprehensive product catalogs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-xl">📷</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-300 hover:text-white transition-colors duration-200">
                  📚 API Documentation
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-gray-300 hover:text-white transition-colors duration-200">
                  📊 Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Empty column for layout balance */}
          <div></div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ProductHub. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Contact Us
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Info */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="text-center text-gray-400 text-xs">
            <p>Built with React, Node.js, and Express</p>
            <p className="mt-1">Powered by intelligent search and virtualization</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 