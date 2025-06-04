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
