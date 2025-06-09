import { getApiUrl } from "./client";
import type {
  UserCreateInput,
  UserCreatedResponse,
  LoginInput,
  LoginResponse,
} from "./types";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";

const createUser = async (
  user: UserCreateInput
): Promise<UserCreatedResponse> => {
  const response = await fetch(`${getApiUrl()}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: user.Username,
      email: user.Email,
      password: user.Password,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Error creating user: ${response.statusText}`);
  }

  return await response.json();
};

const loginUser = async (user: LoginInput): Promise<LoginResponse> => {
  const response = await fetch(`${getApiUrl()}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.Email,
      password: user.Password,
    }),
    credentials: "include",
  })
  if (!response.ok) {
    throw new Error(`Error logging in: ${response.statusText}`);
  }
  return await response.json();
};

const sendOtpEmail = async (email: string): Promise<void> => {
  const response = await fetch(`${getApiUrl()}/forgot-password/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error(`Error sending OTP email: ${response.statusText}`);
  }
  return await response.json();
}

export const useCreateUser = (): UseMutationResult<
  UserCreatedResponse,
  Error,
  UserCreateInput
> => {
  return useMutation({
    mutationFn: createUser,
  });
};

export const useLoginUser = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginInput
> => {
  return useMutation({
    mutationFn: loginUser,
  });
}

export const useSendOtpEmail = (): UseMutationResult<void, Error, string> => {
  return useMutation({
    mutationFn: sendOtpEmail,
  });
};