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
import { useSendOtpEmail } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

type ForgotPasswordForm = {
  email: string;
};

export const ForgotPasswordSendOtp = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useSendOtpEmail();
  const [cookies] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  useEffect(() => {
    if (cookies.token) {
      navigate("/");
    }
  }, [cookies.token, navigate]);

  const onSubmit = (data: ForgotPasswordForm) => {
    mutate(data.email, {
      onSuccess: () => {
        console.log("OTP enviado exitosamente");
        navigate("/forgot-password/verify"); // O la ruta que uses para ingresar OTP y nueva contraseña
      },
      onError: (error) => {
        console.error("Error al enviar OTP:", error.message);
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
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Ingresa tu correo para recibir un código de recuperación (OTP)
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
                {...register("email", {
                  required: "El correo es obligatorio",
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enviando OTP..." : "Enviar OTP"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            ¿Ya tienes el código?{" "}
            <a
              href="/forgot-password/verify"
              className="text-blue-600 hover:underline font-medium"
            >
              Cambiar contraseña
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
