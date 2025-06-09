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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@/components/ui/input-otp";
import { useForm, Controller } from "react-hook-form";
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
    control,
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
            Cambiar contraseña
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
              <Controller
                name="otp"
                control={control}
                rules={{ required: "El OTP es obligatorio" }}
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {[...Array(3)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      {[...Array(3)].map((_, index) => (
                        <InputOTPSlot key={index + 3} index={index + 3} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
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
