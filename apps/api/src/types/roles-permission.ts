export type RoleWithPermissions = {
  Id: string;
  Name: string;
  Description?: string | null;
  Permissions: {
    Id: string;
    Name: string;
    Description?: string | null;
  }[];
};
