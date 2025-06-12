import React, { useContext } from "react";
import { useCookies } from "react-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
  userName: string | null;
  email: string | null;
}

const authContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  token: null,
  userName: null,
  email: null,
});

export const useAuth = () => {
  return useContext(authContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["token", "userName", "email"]);

  const login = (token: string) => {
    setCookie("token", token, { path: "/" });
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    removeCookie("userName", { path: "/" });
    removeCookie("email", { path: "/" });
  };

  return (
    <authContext.Provider
      value={{
        isAuthenticated: !!cookies.token,
        login,
        logout,
        token: cookies.token || null,
        userName: cookies.userName || null,
        email: cookies.email || null,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
