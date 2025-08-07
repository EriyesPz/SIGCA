import { db } from "./db";

export async function createSession(
  userId: string,
  token: string,
  userAgent: string,
  ip: string,
  expiresAt: Date
) {
  return db.sessions.create({
    data: {
      UserId: userId,
      Token: token,
      UserAgent: userAgent,
      IpAddress: ip,
      ExpiresAt: expiresAt,
    },
  });
}

export const getAllSessionLogs = async () => {
  const sessions = await db.sessions.findMany({
    include: {
      Users: {
        select: {
          Id: true,
          Email: true,
          Name: true,
          User: true,
        },
      },
    },
    orderBy: {
      CreatedAt: "desc",
    },
  });

  return sessions.map((s) => ({
    sessionId: s.Id,
    token: s.Token,
    userAgent: s.UserAgent,
    ipAddress: s.IpAddress,
    createdAt: s.CreatedAt,
    expiresAt: s.ExpiresAt,
    user: {
      id: s.Users.Id,
      email: s.Users.Email,
      name: s.Users.Name,
      username: s.Users.User,
    },
  }));
};
