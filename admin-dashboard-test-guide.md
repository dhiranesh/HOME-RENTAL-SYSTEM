# Automated Admin Dashboard Manual Test Guide

This document provides step-by-step instructions to manually test the Admin Dashboard functionality in the Home Rental App.

## Prerequisites

1. The server is running
2. You have admin credentials (email: `admin@gamil.com`, password: `password123` or your own admin credentials)
3. You have at least one test user, property, and booking in the system

## Test Cases

### 1. User Management Tests

#### 1.1. View All Users

1. Login as admin
2. Navigate to Admin Dashboard (`/admin/dashboard`)
3. Verify the "User Management" section is visible and displays a list of users
4. Each user should have:
   - Name
   - Email
   - Role (user or admin)
   - Delete button

✅ **Expected Result**: All users are displayed with their information

#### 1.2. Delete User

1. From the users list, find a test user
2. Click "Delete User" button
3. Confirm the deletion if prompted
4. Wait for the operation to complete

✅ **Expected Result**: User is removed from the list and a success message is displayed

### 2. Property Management Tests

#### 2.1. View All Properties

1. Navigate to the "Property Management" section of the Admin Dashboard
2. Verify that properties are displayed with:
   - Title
   - Status
   - Approve button (if not approved)
   - Delete button

✅ **Expected Result**: All properties are displayed with their information

#### 2.2. Approve Property

1. Find a property with status other than "approved"
2. Click "Approve" button
3. Wait for the operation to complete

✅ **Expected Result**: Property status changes to "approved" and the Approve button disappears

#### 2.3. Delete Property

1. Find a property to delete (preferably a test property)
2. Click "Delete Property" button
3. Confirm the deletion if prompted
4. Wait for the operation to complete

✅ **Expected Result**: Property is removed from the list and a success message is displayed

### 3. Booking Management Tests

#### 3.1. View All Bookings

1. Navigate to the "Booking Management" section of the Admin Dashboard
2. Verify that bookings are displayed with:
   - Booking ID
   - Property ID
   - User ID
   - Status
   - Confirm button (if status is "pending")
   - Cancel Booking button

✅ **Expected Result**: All bookings are displayed with their information

#### 3.2. Confirm Booking

1. Find a booking with "pending" status
2. Click "Confirm Booking" button
3. Wait for the operation to complete

✅ **Expected Result**: Booking status changes to "confirmed" and the Confirm button disappears

#### 3.3. Cancel Booking

1. Find a booking to cancel (preferably a test booking)
2. Click "Cancel Booking" button
3. Wait for the operation to complete

✅ **Expected Result**: Booking status changes to "cancelled"

## Troubleshooting Common Issues

### UI Issues

1. **Navbar not updating**: Make sure you're using the shared Navbar component and not a custom one.
2. **Admin Dashboard not visible**: Verify you're logged in as admin user and the user's role in the token is "admin".
3. **Not redirected after login**: Check the navigation logic in `LoginPage.js` and ensure it's redirecting correctly.

### API Issues

1. **Unauthorized access**: Check that your token is valid and not expired. Try logging in again.
2. **Cannot modify resources**: Verify that you're logged in as admin and the token includes the admin role.

### Server-Side Issues

1. **API errors**: Check server console for error messages.
2. **Database connection**: Ensure MongoDB is running and accessible.

## API Endpoints Reference

### User Management

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Property Management

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `DELETE /api/properties/:id` - Delete property (admin or owner only)

### Booking Management

- `GET /api/bookings` - Get all bookings (admin only)
- `PUT /api/bookings/:id/status` - Update booking status (admin or owner only)
  - Body: `{ "status": "Confirmed" }` or `{ "status": "Cancelled" }`
