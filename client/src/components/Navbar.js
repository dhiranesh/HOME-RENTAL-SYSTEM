import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Replace Heroicons with inline SVG components
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

const UserCircleIcon = (props) => (
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
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const UserPlusIcon = (props) => (
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
      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
    />
  </svg>
);

const ShoppingBagIcon = (props) => (
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
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);

const ArrowRightOnRectangleIcon = (props) => (
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
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
);

const ArrowLeftOnRectangleIcon = (props) => (
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
      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
    />
  </svg>
);

const HomeModernIcon = (props) => (
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
      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819"
    />
  </svg>
);

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const linkStyle =
    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out";
  const activeLinkStyle = "bg-indigo-700 text-white";
  const inactiveLinkStyle =
    "text-indigo-100 hover:bg-indigo-500 hover:text-white";

  return (
    <nav className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="flex-shrink-0 flex items-center text-xl font-bold tracking-tight text-white"
            >
              <HomeIcon className="h-7 w-7 mr-2" />
              <span>HomeScape</span>
            </Link>
            {/* Show Admin Dashboard link for admin users only */}
            {isAuthenticated && user && user.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkStyle} ml-4 ${
                    isActive
                      ? activeLinkStyle
                      : "bg-yellow-400 text-indigo-900 hover:bg-yellow-500"
                  }`
                }
              >
                Admin Dashboard
              </NavLink>
            )}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `${linkStyle} ${
                      isActive ? activeLinkStyle : inactiveLinkStyle
                    }`
                  }
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1.5" /> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `${linkStyle} ${
                      isActive ? activeLinkStyle : inactiveLinkStyle
                    }`
                  }
                >
                  <UserPlusIcon className="h-5 w-5 mr-1.5" /> Sign Up
                </NavLink>
              </>
            )}
            {isAuthenticated && user && (
              <>
                <NavLink
                  to="/dashboard"
                  title={user.name}
                  className={({ isActive }) =>
                    `${linkStyle} ${
                      isActive ? activeLinkStyle : inactiveLinkStyle
                    }`
                  }
                >
                  <UserCircleIcon className="h-5 w-5 mr-1.5" /> Dashboard
                </NavLink>
                <NavLink
                  to="/rent-your-place"
                  className={({ isActive }) =>
                    `${linkStyle} ${
                      isActive ? activeLinkStyle : inactiveLinkStyle
                    }`
                  }
                >
                  <HomeModernIcon className="h-5 w-5 mr-1.5" /> List Property
                </NavLink>
                <NavLink
                  to="/purchases"
                  className={({ isActive }) =>
                    `${linkStyle} ${
                      isActive ? activeLinkStyle : inactiveLinkStyle
                    }`
                  }
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-1.5" /> My Purchases
                </NavLink>
                <button
                  onClick={logout}
                  className={`${linkStyle} ${inactiveLinkStyle} bg-red-500 hover:bg-red-600 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-2`}
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1.5" /> Logout
                </button>
              </>
            )}
          </div>
          {/* Mobile menu button (optional, for future enhancement) */}
          {/* <div className="-mr-2 flex md:hidden">
            <button type="button" className="bg-indigo-600 inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. Heroicon name: menu */}
          {/* <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg> */}
          {/* Icon when menu is open. Heroicon name: x */}
          {/* <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg> */}
          {/* </button>
          </div> */}
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state (optional, for future enhancement) */}
      {/* <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={({ isActive }) => `${linkStyle} block ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => `${linkStyle} block ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>
                Sign Up
              </NavLink>
            </>
          )}
          {isAuthenticated && user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `${linkStyle} block ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>
                Dashboard
              </NavLink>
              <NavLink to="/rent-your-place" className={({ isActive }) => `${linkStyle} block ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>
                List Your Property
              </NavLink>
              <NavLink to="/purchases" className={({ isActive }) => `${linkStyle} block ${isActive ? activeLinkStyle : inactiveLinkStyle}`}>
                My Purchases
              </NavLink>
              <button onClick={logout} className={`${linkStyle} block w-full text-left bg-red-500 hover:bg-red-600`}>
                Logout
              </button>
            </>
          )}
        </div>
      </div> */}
    </nav>
  );
};

export default Navbar;
