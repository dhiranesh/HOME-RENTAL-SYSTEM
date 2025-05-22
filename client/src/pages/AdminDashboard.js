import React, { useEffect, useState, useContext } from "react";
import { useAuth } from "../context/AuthContext";
// import { getAllUsers, updateUserRole, deleteUser } from '../api/user'; // Assuming these API functions exist
// import { getAllProperties, deleteProperty } from '../api/property'; // Assuming these API functions exist
// import { getAllBookings, updateBookingStatus } from '../api/booking'; // Assuming these API functions exist
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";

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

const TrashIcon = (props) => (
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
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const CheckIcon = (props) => (
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
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const AdminDashboard = () => {
  const { user, token, isLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && user && user.role !== "admin") {
      // Redirect if not admin, handled by Navigate component below
      return;
    }
    if (token && user && user.role === "admin") {
      const fetchData = async () => {
        setLoadingData(true);
        setError("");
        try {
          // Placeholder: Replace with actual API calls
          // const usersData = await getAllUsers(token);
          // const propertiesData = await getAllProperties(); // May not need token if public GET
          // const bookingsData = await getAllBookings(token); // Or a specific admin endpoint
          // setUsers(usersData || []);
          // setProperties(propertiesData || []);
          // setBookings(bookingsData || []);
          console.log("Fetching admin data...");
          // Mock data for now
          setUsers([
            {
              _id: "1",
              name: "Test User",
              email: "user@example.com",
              role: "user",
            },
          ]);
          setProperties([
            { _id: "p1", title: "Sample Property", status: "approved" },
          ]);
          setBookings([
            { _id: "b1", property: "p1", user: "1", status: "pending" },
          ]);
        } catch (err) {
          console.error("Failed to fetch admin data:", err);
          setError(err.message || "Failed to load data. Please try again.");
        }
        setLoadingData(false);
      };
      fetchData();
    }
  }, [user, token, isLoading]);

  if (isLoading || loadingData) {
    return <div>Loading dashboard...</div>;
  }

  if (!user) {
    // If not logged in at all, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
    // Or a more specific "Access Denied" page
  }

  // Admin-only dashboard content
  return (
    <>
      <Navbar showAdminDashboardLink={true} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="mb-8 p-4 bg-indigo-100 rounded shadow flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-indigo-800 mb-1">
              Welcome, {user.name}!
            </h2>
            <p className="text-indigo-700">
              You are logged in as <span className="font-bold">admin</span>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-block bg-indigo-700 text-white px-3 py-1 rounded text-sm font-semibold">
              Admin
            </span>
          </div>
        </div>
        {/* Admin-only content separator */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">
            Admin Controls
          </h2>
          <p className="mb-4 text-gray-700">
            This section is only visible to admins. Here you can manage users,
            properties, and bookings. Regular users will never see this
            dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-indigo-600">
              <h3 className="text-lg font-semibold mb-2">User Management</h3>
              <p className="text-gray-600 mb-2">
                View, promote, or remove users from the platform.
              </p>
              <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                Admin Only
              </span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
              <h3 className="text-lg font-semibold mb-2">
                Property Management
              </h3>
              <p className="text-gray-600 mb-2">
                Approve, edit, or delete property listings.
              </p>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                Admin Only
              </span>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-t-4 border-yellow-600">
              <h3 className="text-lg font-semibold mb-2">Booking Management</h3>
              <p className="text-gray-600 mb-2">
                Oversee and manage all bookings on the platform.
              </p>
              <span className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                Admin Only
              </span>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u._id} className="p-3 bg-gray-100 rounded shadow">
                  <p>
                    <strong>Name:</strong> {u.name} (<strong>Email:</strong>{" "}
                    {u.email}) - <strong>Role:</strong> {u.role}
                  </p>
                  <div className="mt-2">
                    <select
                      defaultValue={u.role}
                      onChange={(e) =>
                        handleUpdateUserRole(u._id, e.target.value)
                      }
                      className="mr-2 p-1 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      <TrashIcon className="inline-block w-4 h-4 mr-1 -mt-1" />{" "}
                      Delete User
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found.</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Property Management</h2>
          {properties.length > 0 ? (
            <ul className="space-y-2">
              {properties.map((p) => (
                <li key={p._id} className="p-3 bg-gray-100 rounded shadow">
                  <p>
                    <strong>Title:</strong> {p.title} - <strong>Status:</strong>{" "}
                    {p.status}
                  </p>
                  <div className="mt-2">
                    {p.status !== "approved" && (
                      <button
                        onClick={() => handleApproveProperty(p._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                      >
                        <CheckIcon className="inline-block w-4 h-4 mr-1 -mt-1" />{" "}
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProperty(p._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      <TrashIcon className="inline-block w-4 h-4 mr-1 -mt-1" />{" "}
                      Delete Property
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No properties found.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
          {bookings.length > 0 ? (
            <ul className="space-y-2">
              {bookings.map((b) => (
                <li key={b._id} className="p-3 bg-gray-100 rounded shadow">
                  <p>
                    <strong>Booking ID:</strong> {b._id} -{" "}
                    <strong>Property ID:</strong> {b.property} -{" "}
                    <strong>User ID:</strong> {b.user} -{" "}
                    <strong>Status:</strong> {b.status}
                  </p>
                  <div className="mt-2">
                    {b.status === "pending" && (
                      <button
                        onClick={() => handleConfirmBooking(b._id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                      >
                        Confirm Booking
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelBookingByAdmin(b._id)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings found.</p>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminDashboard;
