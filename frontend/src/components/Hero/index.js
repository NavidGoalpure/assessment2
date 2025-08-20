import React from 'react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-4">
            🛍️ Discover Amazing Products
          </h1>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Browse through our curated collection of high-quality items. 
            Find exactly what you're looking for with our powerful search and filtering tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold">📦</span>
              <p className="text-sm">Extensive Catalog</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold">🔍</span>
              <p className="text-sm">Smart Search</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <span className="text-2xl font-bold">⚡</span>
              <p className="text-sm">Lightning Fast</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">🚀 Ready to Explore?</h2>
          <p className="text-blue-100 mb-4">
            Start searching below to find exactly what you need. 
            Our intelligent search will help you discover products in seconds!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero; 