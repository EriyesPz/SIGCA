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
  Avatar?: string | null;
  LastSessionAt: string | null;
  LastSessionIp: string | null;
  LastSessionUserAgent: string | null;
};
