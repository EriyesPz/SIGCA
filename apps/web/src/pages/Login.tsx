import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useLoginUser } from "@/lib/auth";
import type { LoginResponse, LoginInput } from "@/lib/types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export const Login = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useLoginUser();
  const [cookies, setCookies] = useCookies(["token", "userName", "email"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>();

    useEffect(() => {
    if (cookies.token) {
      navigate("/");
    }
  }, [cookies.token, navigate]);

  const onSubmit = (formData: LoginInput) => {
    mutate(formData, {
      onSuccess: (response: LoginResponse) => {
        setCookies("token", response.token, { path: "/" });
        setCookies("userName", response.userName, { path: "/" });
        setCookies("email", response.email, { path: "/" });
        console.log("Login successful, token:", response.token + " userId:", response.userName);
        navigate("/");
      },
      onError: (error: Error) => {
        console.error("Login failed:", error.message);
      },
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu email y contraseña para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                autoComplete="email"
                disabled={isPending}
                {...register("Email", {
                  required: "El email es obligatorio",
                })}
              />
              {errors.Email && (
                <p className="text-red-500 text-xs mt-1">{errors.Email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isPending}
                {...register("Password", {
                  required: "La contraseña es obligatoria",
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/,
                    message:
                      "Debe tener 8+ caracteres, una mayúscula, un número y un símbolo especial",
                  },
                })}
              />
              {errors.Password && (
                <p className="text-red-500 text-xs mt-1">{errors.Password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Regístrate aquí
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
