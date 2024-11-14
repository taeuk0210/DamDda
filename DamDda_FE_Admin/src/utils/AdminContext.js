import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "./ApiClient";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [isLogin, setLogin] = useState(false);
  const [adminId, setAdminId] = useState("");

  useEffect(() => {}, []);

  const login = ({ accessToken, refreshToken, _adminId }) => {
    if (accessToken) {
      setAuthToken(accessToken);
      sessionStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
    }
    if (_adminId) {
      setAdminId(_adminId);
    }
    setTimeout(() => setLogin(true), 500);
  };

  const logout = () => {
    setAuthToken(null);
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    setLogin(false);
  };

  return (
    <AdminContext.Provider
      value={{ login, logout, isLogin, setLogin, adminId, setAdminId }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
export const useAdmin = () => useContext(AdminContext);
