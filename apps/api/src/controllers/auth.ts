import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { markOTPAsUsed, saveOTP, validateOTP } from "../model/otp";
import { findUserByEmail, createUser, updateUserPassword } from "../model/user";
import { createSession } from "../model/session";
import { sendOtpEmail } from "../utils/email";
import bcrypt from "bcrypt";
import { getUserWithRolesAndPermissions } from "../model/user";

export async function requestOtp(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await saveOTP(email, otp, expiresAt);
  await sendOtpEmail(email, otp);

  res.json({ message: "OTP enviado al correo" });
  return;
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, userName, roles } = req.body;
  if (!email || !password || !userName) {
    res.status(400).json({ error: "Email y contraseña requeridos" });
    return;
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: "El usuario ya existe" });
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser(email, userName, hashed);

  res.status(201).json({ message: "Usuario registrado", userId: user.Id });
  return;
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Credenciales requeridas" });
    return;
  }

  const user = await findUserByEmail(email);
  if (!user || !user.Password) {
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    return;
  }

  const valid = await bcrypt.compare(password, user.Password);
  if (!valid) {
    res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    return;
  }

  // 🔥 obtener roles y permisos efectivos
  const full = await getUserWithRolesAndPermissions(user.Id);
  const roles = full?.Roles?.map((r) => r.Id) ?? [];
  const permissions = full?.Permissions?.map((p) => p.Id) ?? [];

  const token = jwt.sign(
    // 👇 ahora sí van embebidos en el JWT
    { sub: user.Id, email: user.Email, roles, permissions },
    process.env.JWT_SECRET!,
    { expiresIn: "96h" }
  );

  await createSession(
    user.Id,
    token,
    req.headers["user-agent"] || "",
    req.ip || "",
    new Date(Date.now() + 3600 * 1000)
  );

  res.cookie("token", token, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 3600 * 1000,
  });

  res.json({
    message: "Inicio de sesión exitoso",
    userId: user.Id,
    userName: user.User,
    email: user.Email,
    token,
    roles,
    permissions,
  });
}

export async function sendPasswordResetOtp(
  req: Request,
  res: Response
): Promise<void> {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: "Email requerido" });
    return;
  }

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await saveOTP(email, otp, expiresAt);
  await sendOtpEmail(email, otp);

  res.json({
    message: "OTP enviado al correo para recuperación de contraseña",
  });
  return;
}

export async function resetPasswordWithOtp(
  req: Request,
  res: Response
): Promise<void> {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    res.status(400).json({ error: "Faltan campos obligatorios" });
    return;
  }

  const otpRecord = await validateOTP(email, otp);
  if (!otpRecord) {
    res.status(401).json({ error: "OTP inválido o expirado" });
    return;
  }

  await markOTPAsUsed(otpRecord.Id);

  const hashed = await bcrypt.hash(newPassword, 10);
  await updateUserPassword(email, hashed);

  res.json({ message: "Contraseña restablecida correctamente" });
  return;
}
