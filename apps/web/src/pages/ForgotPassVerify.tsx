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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/client";

type ResetForm = {
  email: string;
  otp: string;
  newPassword: string;
};

export const ForgotPasswordVerify = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ResetForm) => {
      const response = await fetch(`${getApiUrl()}/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Error al restablecer la contraseña");
      }

      return await response.json();
    },
    onSuccess: () => {
      console.log("Contraseña actualizada");
      navigate("/login");
    },
    onError: (error) => {
      console.error("Error:", error.message);
    },
  });

  const onSubmit = (data: ResetForm) => {
    mutate(data);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verificar OTP
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa el código recibido por correo y establece una nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                disabled={isPending}
                {...register("email", { required: "El correo es obligatorio" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">Código OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                disabled={isPending}
                {...register("otp", { required: "El OTP es obligatorio" })}
              />
              {errors.otp && (
                <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isPending}
                {...register("newPassword", {
                  required: "La contraseña es obligatoria",
                  pattern: {
                    value:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/,
                    message:
                      "Debe tener 8+ caracteres, una mayúscula, un número y un símbolo especial",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Verificando..." : "Restablecer Contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
