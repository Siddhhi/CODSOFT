import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    setAuthStatus(!!storedUser);
    if (storedUser) {
      setUserRole(JSON.parse(storedUser).role);
    }
  }, []);

  const userLogin = (authData) => {
    localStorage.setItem("currentUser", JSON.stringify(authData));
    localStorage.setItem("authToken", authData.token);
    localStorage.setItem("userRole", authData.user.role);
    setCurrentUser(authData);
    setAuthStatus(true);
    setUserRole(authData.user.role);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setCurrentUser(null);
    setAuthStatus(false);
    setUserRole(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        authStatus,
        userLogin,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
