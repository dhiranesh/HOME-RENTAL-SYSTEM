// filepath: c:\Users\dhira\OneDrive\Desktop\other\final house rental website\home-rental-app\client\src\pages\HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    title: "Don't roam around!",
    subtitle: "Find your desired house within 100 hours with 5 easy steps.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=800&q=80",
    title: "Best Properties",
    subtitle: "Choose from the best properties in your city.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    title: "Easy Booking",
    subtitle: "Book your dream home in just a few clicks.",
  },
];

const HomePage = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme()?.theme || "light";

  const goToSlide = (idx) => setCurrent(idx);
  const goToPrev = () =>
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const goToNext = () =>
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Hero Section with Slider */}
      <section className="flex flex-col items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-lg relative bg-white">
          <img
            src={slides[current].image}
            alt="slide"
            className="w-full h-[28rem] object-cover" // Increased height
          />
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
          >
            <span className="text-2xl">&#8592;</span>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
          >
            <span className="text-2xl">&#8594;</span>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {slides[current].title}
            </h1>
            <p className="text-lg text-gray-200">{slides[current].subtitle}</p>
          </div>
        </div>
        {/* Search Bar UI (non-functional) */}
        <div className="mt-8 bg-white rounded-xl shadow flex flex-col md:flex-row items-center gap-4 px-6 py-4 w-full max-w-2xl">
          <div className="flex-1">
            <div className="text-sm text-gray-500 font-semibold mb-1">
              Location
            </div>
            <div className="font-medium text-gray-800">Jaipur, Rajasthan</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 font-semibold mb-1">
              Property Type
            </div>
            <div className="font-medium text-gray-800">All</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-500 font-semibold mb-1">
              Categories
            </div>
            <div className="font-medium text-gray-800">All</div>
          </div>
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-lg text-lg transition"
            disabled
          >
            Search
          </button>
        </div>
      </section>

      {/* Bottom Content */}
      <section className="max-w-4xl mx-auto mt-16 mb-12 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-700">
          Why Choose RENTROOMO?
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We make finding your next home easy, fast, and secure. Browse the best
          properties, book online, and move in with confidence. Our platform is
          trusted by thousands of happy renters and owners.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2 text-orange-400">🏠</div>
            <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
            <p className="text-gray-500">
              Choose from hundreds of verified properties in top locations.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2 text-orange-400">🔒</div>
            <h3 className="font-semibold text-lg mb-2">Secure & Easy</h3>
            <p className="text-gray-500">
              Book and pay securely online with full support at every step.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-4xl mb-2 text-orange-400">💬</div>
            <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
            <p className="text-gray-500">
              Our team is always here to help you with any questions or issues.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
