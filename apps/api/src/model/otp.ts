import { db } from "./db";

export const saveOTP = async (email: string, otp: string, expiresAt: Date) => {
  return db.emailOTPs.create({
    data: {
      Email: email,
      Otp: otp,
      ExpiresAt: expiresAt,
    },
  });
};

export const validateOTP = async (email: string, otp: string) => {
  return db.emailOTPs.findFirst({
    where: {
      Email: email,
      Otp: otp,
      Used: false,
      ExpiresAt: { gt: new Date() },
    },
    orderBy: {
      ExpiresAt: "desc",
    },
  });
};

export const markOTPAsUsed = async (id: string) => {
  return db.emailOTPs.update({
    where: { Id: id },
    data: { Used: true },
  });
};
