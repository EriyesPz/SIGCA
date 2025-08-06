export interface Role {
  id: string;
  name: string;
  permissions?: Permission[];
  createdAt?: Date;
}
export interface Permission {
  id: string;
  name: string;
  createdAt?: Date;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface RolePermission {
  roleId: string;
  permissionId: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  createdAt: Date;
  roles?: Role[];
}
