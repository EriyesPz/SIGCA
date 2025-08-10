import React, { useContext, useMemo } from "react";
import { useCookies } from "react-cookie";

type AuthLogin = {
  token: string;
  userName: string;
  email: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (payload: AuthLogin) => void;
  logout: () => void;

  token: string | null;
  userName: string | null;
  email: string | null;

  roles: string[];
  permissions: string[];

  hasRole: (r: string | string[]) => boolean;
  hasPermission: (p: string) => boolean;
  hasAnyPermission: (ps: string[]) => boolean;
  hasAllPermissions: (ps: string[]) => boolean;
}

const authContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: () => {},
  logout: () => {},
  token: null,
  userName: null,
  email: null,
  roles: [],
  permissions: [],
  hasRole: () => false,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
});

export const useAuth = () => useContext(authContext);

/** Decodifica el payload del JWT (base64url) de forma segura en el navegador */
function decodeJwtPayload<T = any>(token?: string | null): T | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    // padding
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), "=");
    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

const COOKIE_KEYS = ["token", "userName", "email"] as const;
type CookieName = (typeof COOKIE_KEYS)[number];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [cookies, setCookie, removeCookie] = useCookies<CookieName>([
    ...COOKIE_KEYS,
  ]);

  const noEncode = { path: "/", encode: (v: string) => v };

  const login = ({ token, userName, email }: AuthLogin) => {
    setCookie("token", token, noEncode);
    setCookie("userName", userName, noEncode);
    setCookie("email", email, noEncode);
  };

  const logout = () => {
    ([...COOKIE_KEYS] as CookieName[]).forEach((k) =>
      removeCookie(k, { path: "/" })
    );
  };

  const token = (cookies.token as string) ?? null;

  // Derivar roles/permissions/exp directo del JWT
  const { roles, permissions, isExpired } = useMemo(() => {
    type Payload = {
      roles?: string[];
      permissions?: string[];
      exp?: number; // seconds
    };
    const p = decodeJwtPayload<Payload>(token) || {};
    const expMs = p.exp ? p.exp * 1000 : undefined;
    return {
      roles: Array.isArray(p.roles) ? p.roles : [],
      permissions: Array.isArray(p.permissions) ? p.permissions : [],
      isExpired: expMs ? Date.now() >= expMs : false,
    };
  }, [token]);

  // Si el token está expirado, no te autenticamos
  const isAuthenticated = !!token && !isExpired;
  const isAdmin = roles.includes("admin");

  const hasRole = (r: string | string[]) =>
    isAdmin
      ? true
      : Array.isArray(r)
      ? r.some((x) => roles.includes(x))
      : roles.includes(r);

  const hasPermission = (p: string) => isAdmin || permissions.includes(p);
  const hasAnyPermission = (ps: string[]) =>
    isAdmin || ps.some((p) => permissions.includes(p));
  const hasAllPermissions = (ps: string[]) =>
    isAdmin || ps.every((p) => permissions.includes(p));

  // (Opcional) logs durante desarrollo
  console.log("[AUTH]", { isAuthenticated, isAdmin, roles, permissionsCount: permissions.length });

  return (
    <authContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        login,
        logout,
        token,
        userName: (cookies.userName as string) ?? null,
        email: (cookies.email as string) ?? null,
        roles,
        permissions,
        hasRole,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
