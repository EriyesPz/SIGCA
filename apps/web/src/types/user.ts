export type UserType = {
  Id: string;
  Email: string;
  User: string;
  IsActive: boolean;
  CreatedAt: string;
  Roles: {
    Id: string;
    Name: string;
  }[];
  LastSessionAt: string | null;
  LastSessionIp: string | null;
  LastSessionUserAgent: string | null;
};
