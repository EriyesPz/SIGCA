// src/pages/Protected.tsx
import { useAuth } from "@/components/providers/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  children: React.ReactElement;
  roles?: string[];         // al menos uno de estos roles
  anyOf?: string[];         // al menos uno de estos permisos
  allOf?: string[];         // todos estos permisos
  redirectTo?: string;      // destino si no autorizado
};

export const ProtectedRoute = ({
  children,
  roles,
  anyOf,
  allOf,
  redirectTo = "/",
}: Props) => {
  const { isAuthenticated, hasRole, hasAnyPermission, hasAllPermissions } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login", { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (roles && roles.length && !hasRole(roles)) {
    navigate(redirectTo, { replace: true });
    return null;
  }
  if (anyOf && anyOf.length && !hasAnyPermission(anyOf)) {
    navigate(redirectTo, { replace: true });
    return null;
  }
  if (allOf && allOf.length && !hasAllPermissions(allOf)) {
    navigate(redirectTo, { replace: true });
    return null;
  }

  return children;
};
