import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getApiUrl } from "./client";
import {
  type Permission,
  type Role,
  type RoleWithPermissions,
} from "../types/roles-permisions";

const getRoles = async () => {
  const response = await fetch(`${getApiUrl}/roles`);
  if (!response.ok) {
    throw new Error(`Error fetching cargo: ${response.statusText}`);
  }
  return response.json();
};

export const useGetRoles = (): UseQueryResult<Role[], Error> => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getPermissions = async () => {
  const response = await fetch(`${getApiUrl()}/permissions`);
  if (!response.ok) {
    throw new Error(`Error al obtener permisos: ${response.statusText}`);
  }
  return response.json();
};

export const useGetPermissions = (): UseQueryResult<Permission[], Error> => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getRolesWithPermissions = async () => {
  const response = await fetch(`${getApiUrl()}/roles-permissions`);
  if (!response.ok) {
    throw new Error(
      `Error al obtener roles con permisos: ${response.statusText}`
    );
  }
  return response.json();
};

export const useGetRolesWithPermissions = (): UseQueryResult<
  RoleWithPermissions[],
  Error
> => {
  return useQuery({
    queryKey: ["roles-with-permissions"],
    queryFn: getRolesWithPermissions,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
