/* export type RoleWithPermissions = {
  Id: string;
  Name: string;
  Description?: string | null;
  Permissions: {
    Id: string;
    Name: string;
    Description?: string | null;
  }[];
}; */

export type Permission = {
  Id: string;
  Name: string;
  Description: string;
};

export type Role = {
  Id: string;
  Name: string;
  Description: string;
};

export type RoleWithPermissions = Role & {
  Permissions: Permission[];
};