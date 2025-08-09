// api/users.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "./client";

/* ================== Tipos ================== */
export type Role = { Id: string; Name: string; Description?: string | null };
export type Permission = {
  Id: string;
  Name: string;
  Description?: string | null;
};

export type UserListItem = {
  Id: string;
  Email: string;
  Name: string | null;
  User: string;
  IsActive: boolean;
  CreatedAt: string; // ISO
  Roles: Role[];
  LastSessionAt: string | null;
  LastSessionIp: string | null;
  LastSessionUserAgent: string | null;
};

export type UserFull = {
  Id: string;
  Email: string;
  Name: string | null;
  User: string;
  IsActive: boolean;
  CreatedAt: string;
  Roles: Role[];
  Permissions: Permission[];
};

/* ================== Helper ================== */
async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json();
}

/* ================== Queries ================== */

// GET /users  (ya lo tenías; lo dejo aquí centralizado)
export const listUsers = async (): Promise<UserListItem[]> => {
  return request<UserListItem[]>(`${getApiUrl()}/users`);
};

export const useListUsers = () =>
  useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
    refetchOnWindowFocus: false,
    retry: 1,
  });

// GET /users/:userId
export const getUserDetails = async (userId: string): Promise<UserFull> => {
  return request<UserFull>(`${getApiUrl()}/users/${userId}`);
};

export const useUserDetails = (userId?: string) =>
  useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(userId!),
    enabled: !!userId,
    refetchOnWindowFocus: false,
  });

// GET /users/:userId/permissions
export const getUserPermissions = async (
  userId: string
): Promise<Permission[]> => {
  return request<Permission[]>(`${getApiUrl()}/users/${userId}/permissions`);
};

export const useUserPermissions = (userId?: string) =>
  useQuery({
    queryKey: ["user:permissions", userId],
    queryFn: () => getUserPermissions(userId!),
    enabled: !!userId,
  });

/* ================== Mutations ================== */

// POST /users  (crear usuario con roles)
type CreateUserWithRolesInput = {
  email: string;
  userName: string;
  password: string;
  roles: string[]; // p.ej. ["digitador", "supervisor"]
};

export const createUserWithRoles = async (data: CreateUserWithRolesInput) => {
  return request<UserFull>(`${getApiUrl()}/users`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const useCreateUserWithRoles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUserWithRoles,
    onSuccess: (created) => {
      // refrescar lista y detalles
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", created.Id] });
      qc.invalidateQueries({ queryKey: ["user:permissions", created.Id] });
    },
  });
};

// POST /users/:userId/roles (AGREGAR roles SIN reemplazar)
export const addRolesToUser = async (userId: string, roles: string[]) => {
  return request<UserFull>(`${getApiUrl()}/users/${userId}/roles`, {
    method: "POST",
    body: JSON.stringify({ roles }),
  });
};

export const useAddRolesToUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      addRolesToUser(userId, roles),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", updated.Id] });
      qc.invalidateQueries({ queryKey: ["user:permissions", updated.Id] });
    },
  });
};

// PUT /users/:userId/roles (REEMPLAZAR todos los roles)
export const replaceUserRoles = async (userId: string, roles: string[]) => {
  return request<UserFull>(`${getApiUrl()}/users/${userId}/roles`, {
    method: "PUT",
    body: JSON.stringify({ roles }),
  });
};

export const useReplaceUserRoles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      replaceUserRoles(userId, roles),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", updated.Id] });
      qc.invalidateQueries({ queryKey: ["user:permissions", updated.Id] });
    },
  });
};

export type RoleOpsInput = {
  /** Reemplaza TODOS los roles por estos IDs (puede ser [] para dejarlos sin roles) */
  setRoleIds?: string[];
  /** Agrega estos roles (ignora duplicados) */
  addRoleIds?: string[];
  /** Quita estos roles si existen */
  removeRoleIds?: string[];
};

export type PatchUserInput = {
  Email?: string;
  Name?: string | null;
  User?: string;
  Password?: string | null; // ya con hash si aplica
  IsActive?: boolean;
  Avatar?: string | null;
  roleOps?: RoleOpsInput;
};

/** Llama a PATCH /users/:userId con los campos opcionales y/o roleOps */
export const patchUser = async (
  userId: string,
  data: PatchUserInput
): Promise<UserFull> => {
  // limpiamos undefineds para que el backend no reciba claves vacías
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) clean[k] = v;
  }
  return request<UserFull>(`${getApiUrl()}/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(clean),
  });
};

export const usePatchUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: PatchUserInput }) =>
      patchUser(userId, data),
    onSuccess: (updated) => {
      // refrescar lista y detalles/permissions del usuario afectado
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", updated.Id] });
      qc.invalidateQueries({ queryKey: ["user:permissions", updated.Id] });
    },
  });
};
