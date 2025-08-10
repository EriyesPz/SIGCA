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
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateUser } from "@/lib/auth";
import { useForm } from "react-hook-form";
import { type UserCreateInput } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error, data } = useCreateUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateInput & { confirmPassword: string }>();

  // Estados para ver/ocultar contraseñas
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch("Password");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch = useMemo(
    () => (confirmPassword ? password === confirmPassword : true),
    [password, confirmPassword]
  );

  const onSubmit = (formData: UserCreateInput & { confirmPassword: string }) => {
    const { confirmPassword: _cp, ...userData } = formData;
    mutate(userData, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  // Redirección fallback por si isSuccess cambia fuera del onSuccess
  useEffect(() => {
    if (isSuccess) navigate("/dashboard");
  }, [isSuccess, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Completa los datos para crear tu nueva cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                placeholder="nombre del usuario"
                autoComplete="username"
                aria-invalid={!!errors.Username}
                {...register("Username", { required: true })}
              />
              {errors.Username && (
                <p className="text-red-500 text-xs">El nombre de usuario es obligatorio</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                autoComplete="email"
                aria-invalid={!!errors.Email}
                {...register("Email", {
                  required: "El email es obligatorio",
                })}
              />
              {errors.Email && (
                <p className="text-red-500 text-xs">{errors.Email.message}</p>
              )}
            </div>

            {/* Campo contraseña con toggle */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.Password}
                  className={`${!passwordsMatch && confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  {...register("Password", {
                    required: "La contraseña es obligatoria",
                    pattern: {
                      value:
                        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
                      message:
                        "Debe tener 8+ caracteres, una mayúscula, un número y un símbolo especial",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.Password && (
                <p className="text-sm text-red-500">{errors.Password.message}</p>
              )}
            </div>

            {/* Confirmar contraseña con validación y toggle */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword || !passwordsMatch}
                  className={`${!passwordsMatch && confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  {...register("confirmPassword", {
                    required: "Confirma tu contraseña",
                    validate: (val) =>
                      val === watch("Password") || "Las contraseñas no coinciden",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {!passwordsMatch && confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-red-500">Las contraseñas no coinciden</p>
              )}
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                Acepto los{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  términos y condiciones
                </a>
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || isSubmitting}>
              {isPending ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>

            {isError && (
              <p className="text-sm text-red-600 mt-2" role="alert">
                Error: {error?.message ?? "No se pudo crear la cuenta"}
              </p>
            )}
            {isSuccess && data && (
              <p className="text-sm text-green-600 mt-2">✅ Cuenta creada</p>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Inicia sesión aquí
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
 