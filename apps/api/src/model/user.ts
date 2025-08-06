import { db } from "./db";

export async function findUserByEmail(email: string) {
  return db.users.findUnique({
    where: { Email: email },
  });
}

export async function createUser(
  email: string,
  userName: string,
  password: string
) {
  return db.users.create({
    data: { Email: email, User: userName, Password: password },
  });
}

export async function updateUserPassword(email: string, newPassword: string) {
  return db.users.update({
    where: { Email: email },
    data: { Password: newPassword },
  });
}

export async function getUsers() {
  const users = await db.users.findMany({
    select: {
      Id: true,
      Email: true,
      User: true,
      IsActive: true,
      CreatedAt: true,
      UserRoles: {
        select: {
          Roles: {
            select: {
              Id: true,
              Name: true,
            },
          },
        },
      },
      Sessions: {
        orderBy: {
          CreatedAt: "desc",
        },
        take: 1,
        select: {
          CreatedAt: true,
          IpAddress: true,
          UserAgent: true,
        },
      },
    },
  });

  return users.map((user) => ({
    Id: user.Id,
    Email: user.Email,
    User: user.User,
    IsActive: user.IsActive,
    CreatedAt: user.CreatedAt,
    Roles: user.UserRoles.map((ur) => ({Name: ur.Roles.Name, Id: ur.Roles.Id})),
    LastSessionAt: user.Sessions[0]?.CreatedAt ?? null,
    LastSessionIp: user.Sessions[0]?.IpAddress ?? null,
    LastSessionUserAgent: user.Sessions[0]?.UserAgent ?? null,
  }));
}
