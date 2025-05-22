import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import * as api from "../api/auth";

const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async (currentToken) => {
    if (currentToken) {
      try {
        const userData = await api.getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to fetch current user or token invalid", error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorage = (event) => {
      if (event.key === "token") {
        const newToken = event.newValue;
        setToken(newToken);
        if (newToken) {
          fetchCurrentUser(newToken);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    try {
      const data = await api.loginUser(credentials);
      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.registerUser(userData);
      if (data.token && data.user) {
        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem("token", data.token);
      }
      return data;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    api.logoutUser();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        setUser,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
