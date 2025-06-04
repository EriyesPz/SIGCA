import { db } from "./db";

export async function findUserByEmail(email: string) {
  return db.users.findUnique({
    where: { Email: email },
  });
}

export async function createUser(email: string) {
  return db.users.create({
    data: { Email: email },
  });
}
