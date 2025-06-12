export interface UserCreateInput {
  Username: string;
  Email: string;
  Password: string;
}

export interface UserCreatedResponse {
  userId: string;
  message: string;
}

export interface LoginInput {
  Email: string;
  Password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  userName: string;
  email: string;
}