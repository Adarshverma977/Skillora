
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "skillora-token";
const USER_KEY = "skillora-user";

const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken);
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback(({ token: authToken, user: authUser }) => {
    try {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    } catch (error) {
      console.error("Unable to save authentication data:", error);
      throw error;
    }

    setToken(authToken);
    setUser(authUser);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((currentUser) => {
      const updatedUser = {
        ...(currentUser || {}),
        ...updates,
      };

      try {
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Unable to save user data:", error);
      }

      return updatedUser;
    });
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Unable to clear authentication data:", error);
    }

    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      updateUser,
      logout,
    }),
    [token, user, login, updateUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
