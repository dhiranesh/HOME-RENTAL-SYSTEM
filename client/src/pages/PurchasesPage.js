import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyPurchases, cancelPurchase } from '../api/purchase';
import axios from 'axios';

const PurchasesPage = () => {
  const { token } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/purchases/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Purchases data:', res.data);
        setPurchases(res.data);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setPurchases([]);
      }
      setLoading(false);
    };
    fetchPurchases();
  }, [token]);

  const handleCancel = async (id) => {
    await axios.delete(`/api/purchases/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPurchases(purchases.filter(p => p._id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-2xl p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">My Purchases</h1>
      {purchases.length === 0 ? (
        <p className="text-gray-600">You have not bought any properties yet.</p>
      ) : (        <ul className="divide-y">
          {purchases.map(p => {
            // Handle different property data structures
            const propertyName = p.property?.name || p.property?.title || 'Property';
            const propertyLocation = 
              p.property?.location || 
              (p.property?.address ? `${p.property.address.city}, ${p.property.address.country}` : 'Unknown location');
            const propertyPrice = p.property?.price || p.property?.pricePerNight || 0;
            
            return (
              <li key={p._id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold">{propertyName}</div>
                  <div className="text-gray-500 text-sm">{propertyLocation}</div>
                </div>
                <div className="text-indigo-700 font-bold">${propertyPrice}</div>
                <Link to={`/properties/${p.property._id}`} className="text-blue-600 hover:underline ml-4">View</Link>
                <button onClick={() => handleCancel(p._id)} className="ml-4 text-red-600 hover:underline">Cancel</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PurchasesPage;
