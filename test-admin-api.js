/**
 * Admin Dashboard API Test Script
 *
 * This script tests the admin dashboard API endpoints using Axios:
 * - User Management: Get all users, get user by ID, delete user
 * - Property Management: Get all properties, get property by ID, delete property
 * - Booking Management: Get all bookings, confirm booking, cancel booking
 *
 * How to run:
 * 1. Make sure server is running
 * 2. Run: node test-admin-api.js
 */

const axios = require("axios");
const API_URL = "http://localhost:5000/api"; // Change if your server runs on a different port
let token = null;
let userId = null;
let propertyId = null;
let bookingId = null;

// Store test results
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
};

// Helper function to handle tests and log results consistently
const runTest = async (name, testFn) => {
  testResults.total++;
  console.log(`\n🧪 TESTING: ${name}`);
  try {
    await testFn();
    console.log(`✅ PASSED: ${name}`);
    testResults.passed++;
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(
      `   Error: ${error.response?.data?.message || error.message}`
    );
    testResults.failed++;
  }
};

// Login as admin to get token
const loginAsAdmin = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@gamil.com",
      password: "password123",
    });
    token = response.data.token;
    console.log("Admin login successful, got token");
    return token;
  } catch (error) {
    console.error(
      "Failed to login as admin:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

// 1. USER MANAGEMENT TESTS
const testGetAllUsers = async () => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/users`, config);

  if (!response.data || !Array.isArray(response.data)) {
    throw new Error("Expected an array of users");
  }

  console.log(`Found ${response.data.length} users`);
  // Save first user ID for future tests
  if (response.data.length > 0) {
    userId = response.data[0]._id;
    console.log(`Using user ID: ${userId} for further tests`);
  }
};

const testGetUserById = async () => {
  if (!userId) {
    throw new Error("No user ID available for test");
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/users/${userId}`, config);

  console.log(`Retrieved user: ${response.data.name} (${response.data.email})`);
};

const testDeleteUser = async () => {
  if (!userId) {
    throw new Error("No user ID available for test");
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_URL}/users/${userId}`, config);

  console.log(
    `Delete user response: ${
      response.data.message || JSON.stringify(response.data)
    }`
  );
};

// 2. PROPERTY MANAGEMENT TESTS
const testGetAllProperties = async () => {
  // Properties endpoint might be public
  const response = await axios.get(`${API_URL}/properties`);

  if (
    !response.data ||
    (!Array.isArray(response.data) && !response.data.properties)
  ) {
    throw new Error("Expected properties data");
  }

  const properties = Array.isArray(response.data)
    ? response.data
    : response.data.properties;
  console.log(`Found ${properties.length} properties`);

  // Save first property ID for future tests
  if (properties.length > 0) {
    propertyId = properties[0]._id;
    console.log(`Using property ID: ${propertyId} for further tests`);
  }
};

const testGetPropertyById = async () => {
  if (!propertyId) {
    throw new Error("No property ID available for test");
  }

  const response = await axios.get(`${API_URL}/properties/${propertyId}`);
  console.log(
    `Retrieved property: ${response.data.title || response.data.name}`
  );
};

const testDeleteProperty = async () => {
  if (!propertyId) {
    throw new Error("No property ID available for test");
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(
    `${API_URL}/properties/${propertyId}`,
    config
  );

  console.log(
    `Delete property response: ${
      response.data.message || JSON.stringify(response.data)
    }`
  );
};

// 3. BOOKING MANAGEMENT TESTS
const testGetAllBookings = async () => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}/bookings`, config);

  if (!response.data || !Array.isArray(response.data)) {
    throw new Error("Expected an array of bookings");
  }

  console.log(`Found ${response.data.length} bookings`);
  // Save first booking ID for future tests
  if (response.data.length > 0) {
    bookingId = response.data[0]._id;
    console.log(`Using booking ID: ${bookingId} for further tests`);
  }
};

const testConfirmBooking = async () => {
  if (!bookingId) {
    throw new Error("No booking ID available for test");
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(
    `${API_URL}/bookings/${bookingId}/status`,
    { status: "Confirmed" },
    config
  );

  console.log(`Booking confirmed with status: ${response.data.status}`);
};

const testCancelBooking = async () => {
  if (!bookingId) {
    throw new Error("No booking ID available for test");
  }

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(
    `${API_URL}/bookings/${bookingId}/status`,
    { status: "Cancelled" },
    config
  );

  console.log(`Booking cancelled with status: ${response.data.status}`);
};

// Run all tests in sequence
const runAllTests = async () => {
  console.log("🚀 Starting Admin API Tests");

  try {
    await loginAsAdmin();

    // User tests
    await runTest("Get All Users", testGetAllUsers);
    await runTest("Get User By ID", testGetUserById);
    // Only uncomment when you actually want to delete a user
    // await runTest('Delete User', testDeleteUser);

    // Property tests
    await runTest("Get All Properties", testGetAllProperties);
    await runTest("Get Property By ID", testGetPropertyById);
    // Only uncomment when you actually want to delete a property
    // await runTest('Delete Property', testDeleteProperty);

    // Booking tests
    await runTest("Get All Bookings", testGetAllBookings);
    if (bookingId) {
      await runTest("Confirm Booking", testConfirmBooking);
      await runTest("Cancel Booking", testCancelBooking);
    }

    // Print test summary
    console.log("\n📊 TEST SUMMARY");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
  } catch (error) {
    console.error("Tests aborted due to error:", error.message);
  }
};

runAllTests();
