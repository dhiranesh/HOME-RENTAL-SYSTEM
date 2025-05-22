import React from 'react';

// Footer component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12 text-center shadow-inner">
      <p>&copy; {new Date().getFullYear()} Home Rental App. All rights reserved.</p>
      {/* <p>Footer Component</p> */}
    </footer>
  );
};

export default Footer;
