<<<<<<< HEAD
# Home Rental Web Application

This is a full-featured Home Rental Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js).

## Features

*   **User Authentication:** Secure user registration and login with JWT.
*   **Property Listings:** Create, read, update, and delete property listings.
*   **Image Uploads:** Property image uploads handled via Cloudinary.
*   **Search and Filtering:** Search properties by keywords, location, and filter by price, type, amenities, etc.
*   **Booking System:** Users can book properties for specific dates.
*   **Review System:** Users can leave reviews and ratings for properties.
*   **User Dashboards:** Separate dashboards for regular users and property owners.
*   **Admin Dashboard:** Admin panel for managing users and properties.
*   **Interactive Maps:** Google Maps integration to show property locations.
*   **Responsive Design:** UI adaptable to different screen sizes.
*   **GeoJSON for Location:** Properties store location data using GeoJSON for geospatial queries.

## Tech Stack

*   **Frontend:**
    *   React.js
    *   React Router
    *   Axios (for API calls)
    *   Context API (for state management - AuthContext, ThemeContext)
    *   (Potentially other UI libraries like Material-UI, Tailwind CSS - not explicitly specified but common)
*   **Backend:**
    *   Node.js
    *   Express.js
    *   MongoDB (with Mongoose ODM)
    *   JWT (for authentication)
    *   Bcrypt.js (for password hashing)
    *   Cloudinary (for image storage)
    *   Morgan (for HTTP request logging)
    *   Dotenv (for environment variables)
*   **Database:**
    *   MongoDB

## Prerequisites

*   Node.js (v14.x or later recommended)
*   npm or yarn
*   MongoDB (local instance or a cloud-hosted solution like MongoDB Atlas)

## Getting Started

### 1. Clone the Repository (if applicable)

```bash
# git clone <repository-url>
# cd home-rental-app
```

### 2. Environment Variables

Create a `.env` file in the `home-rental-app/server` directory and add the following environment variables. Replace the placeholder values with your actual credentials and settings.

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Google Maps API Key (if used on the backend, otherwise manage on client)
# GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

For the client-side, if you are using Google Maps API, you might need to set it up directly in your client code or via a client-side environment variable (e.g., `REACT_APP_GOOGLE_MAPS_API_KEY` in a `.env` file in the `client` directory).

### 3. Install Dependencies

Navigate to the server and client directories and install the necessary dependencies.

*   **Backend (from `home-rental-app/server` directory):**

    ```bash
    cd server
    npm install
    # or
    # yarn install
    ```

*   **Frontend (from `home-rental-app/client` directory):**

    ```bash
    cd ../client 
    npm install
    # or
    # yarn install
    ```

### 4. Running the Application

*   **Start the Backend Server (from `home-rental-app/server` directory):**

    ```bash
    # Make sure you are in the server directory
    npm run dev # If you have a dev script (e.g., using nodemon)
    # or
    npm start # For production start, or if dev script is named start
    ```
    The server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

*   **Start the Frontend Client (from `home-rental-app/client` directory):**

    ```bash
    # Make sure you are in the client directory
    npm start
    # or
    # yarn start
    ```
    The client development server will typically run on `http://localhost:3000`.

## API Endpoints Overview (Example)

*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Login an existing user
*   `GET /api/auth/me` - Get current logged-in user
*   `GET /api/properties` - Get all properties (with search/filter query params)
*   `POST /api/properties` - Create a new property (protected)
*   `GET /api/properties/:id` - Get a single property
*   `PUT /api/properties/:id` - Update a property (protected, owner/admin)
*   `DELETE /api/properties/:id` - Delete a property (protected, owner/admin)
*   `POST /api/bookings` - Create a new booking (protected)
*   `GET /api/bookings/my-bookings` - Get bookings for the logged-in user (protected)
*   `POST /api/reviews` (or `/api/properties/:propertyId/reviews`) - Add a review (protected)
*   `GET /api/users/profile` - Get user profile (protected)
*   `PUT /api/users/profile` - Update user profile (protected)
*   `GET /api/users` - Get all users (admin)

## Project Structure

```
home-rental-app/
├── client/               # React Frontend
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.js
│       └── index.js
├── server/               # Node.js Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── index.js          # (or server.js - main server file)
├── .env                  # (Example, should be in server/)
├── package.json          # (Root package.json if any, or separate for client/server)
└── README.md
```

---

This README provides a basic template. You can expand it with more details about specific features, deployment instructions, or contribution guidelines as the project evolves.
cd c:\Users\dhira\OneDrive\Desktop\other\final house rental website\home-rental-app\server
npm install
node server-dev.js
cd c:\Users\dhira\OneDrive\Desktop\other\final house rental website\home-rental-app\client
npm install
npm start
=======
# HOME-RENTAL-SYSTEM
MERN STACK
>>>>>>> d1ff25819fe3879814ec0354c140e11ad7479219
