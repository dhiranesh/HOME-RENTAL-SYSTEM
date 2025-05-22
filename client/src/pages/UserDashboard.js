import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getAllProperties } from "../api/property";
import { PropertyCard } from "../components/PropertyCard";
import { getMyBookings } from "../api/booking";
import { getUserReviews } from "../api/review";

// SVG components to replace any potential Heroicon usage
const UserIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const HomeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const UserDashboard = () => {
  const { user, token, isLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user || !token) {
      navigate("/login", { replace: true });
      return;
    }
    setLoadingData(true);
    const fetchData = async () => {
      try {
        // Fetch all properties
        let response;
        try {
          response = await getAllProperties();
        } catch (err) {
          setError("Failed to load properties.");
          setAllProperties([]);
        }
        if (response) {
          if (response.properties && Array.isArray(response.properties)) {
            setAllProperties(response.properties);
          } else if (Array.isArray(response)) {
            setAllProperties(response);
          } else if (typeof response === "object") {
            const possibleArrays = Object.values(response).filter((val) =>
              Array.isArray(val)
            );
            if (possibleArrays.length > 0) {
              const propertiesArray = possibleArrays.reduce((a, b) =>
                a.length > b.length ? a : b
              );
              setAllProperties(propertiesArray);
            } else {
              setAllProperties([]);
            }
          } else {
            setAllProperties([]);
          }
        }
        // Fetch bookings
        let bookingsData;
        try {
          bookingsData = await getMyBookings(token);
        } catch (err) {
          setError("Failed to load bookings.");
          setBookings([]);
        }
        if (bookingsData && Array.isArray(bookingsData.bookings)) {
          setBookings(bookingsData.bookings);
        } else if (bookingsData && Array.isArray(bookingsData)) {
          setBookings(bookingsData);
        } else {
          setBookings([]);
        }
        // Fetch reviews
        let reviewsData;
        try {
          reviewsData = await getUserReviews(user._id, token);
        } catch (err) {
          setError("Failed to load reviews.");
          setReviews([]);
        }
        if (reviewsData && Array.isArray(reviewsData)) {
          setReviews(reviewsData);
        } else {
          setReviews([]);
        }
        setError("");
      } catch (err) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, [user, token, isAuthenticated, isLoading, navigate]);

  if (isLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleCancelBooking = (bookingId) => {
    // TODO: Implement cancel booking logic with API call and refresh bookings
    alert("Cancel booking feature coming soon.");
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <div>
          <Link
            to="/rent-your-place"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            List Your Property
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded mb-4">
          Error: {error}
        </p>
      )}
      {/* All Properties Section */}{" "}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Properties</h2>
        {allProperties && allProperties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProperties.map((property) => {
              // Handle both old schema (title/pricePerNight) and new schema (name/price)
              const propertyName =
                property.name || property.title || "Unnamed Property";

              // Handle location which might be a string or an object with coordinates
              let propertyLocation = "Location not specified";
              if (typeof property.location === "string") {
                propertyLocation = property.location;
              } else if (property.address && property.address.city) {
                propertyLocation = `${property.address.city}, ${
                  property.address.country || ""
                }`;
              } else if (
                property.location &&
                property.location.type === "Point"
              ) {
                propertyLocation = `Coordinates: ${property.location.coordinates[1]}, ${property.location.coordinates[0]}`;
              }

              const propertyPrice =
                property.price || property.pricePerNight || 0;
              const propertyImage =
                property.image ||
                (property.images && property.images.length > 0
                  ? property.images[0].url || property.images[0]
                  : "https://placehold.co/300x200/EFEFEF/999999?text=No+Image");

              return (
                <div
                  key={property._id}
                  className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg"
                  onClick={() => handleViewProperty(property._id)}
                >
                  <img
                    src={propertyImage}
                    alt={propertyName}
                    className="w-full h-48 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-xl font-semibold">{propertyName}</h3>
                  <p className="text-gray-600">{propertyLocation}</p>
                  <p className="text-lg font-bold text-indigo-600">
                    ${propertyPrice} / night
                  </p>
                  <p className="text-sm text-gray-500">
                    {property.bedrooms || "?"} bed • {property.bathrooms || "?"}{" "}
                    bath
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No properties found or still loading...</p>
        )}
      </section>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Bookings Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
          {Array.isArray(bookings) && bookings.length > 0 ? (
            <ul className="space-y-3">
              {bookings.map((booking) => (
                <li key={booking._id} className="p-3 border rounded-md">
                  <p>
                    <strong>Property:</strong> {booking.propertyTitle}
                  </p>
                  <p>
                    <strong>Dates:</strong>{" "}
                    {booking.startDate
                      ? new Date(booking.startDate).toLocaleDateString()
                      : "?"}{" "}
                    -{" "}
                    {booking.endDate
                      ? new Date(booking.endDate).toLocaleDateString()
                      : "?"}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {booking.status || "pending"}
                    </span>
                  </p>
                  {booking.status !== "cancelled" &&
                    booking.status !== "completed" && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      >
                        Cancel Booking
                      </button>
                    )}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no bookings.</p>
          )}
          <Link
            to="/"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Find a place to stay &rarr;
          </Link>
        </section>

        {/* My Reviews Section */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li key={review._id} className="p-3 border rounded-md">
                  <p>
                    <strong>Property:</strong> {review.propertyTitle}
                  </p>
                  <p>
                    <strong>Rating:</strong> {review.rating}/5
                  </p>
                  <p>
                    <strong>Comment:</strong> {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not submitted any reviews.</p>
          )}
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <Link
            to="/profile/edit"
            className="mt-3 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Edit Profile &rarr;
          </Link>
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
