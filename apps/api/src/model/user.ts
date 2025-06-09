import { db } from "./db";

export async function findUserByEmail(email: string) {
  return db.users.findUnique({
    where: { Email: email },
  });
}

export async function createUser(email: string, userName: string, password: string) {
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