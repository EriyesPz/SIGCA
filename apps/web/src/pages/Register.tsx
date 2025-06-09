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

export const Register = () => {
  const { mutate, isPending, isSuccess, isError, error, data } =
    useCreateUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreateInput & { confirmPassword: string }>();

  const onSubmit = (
    formData: UserCreateInput & { confirmPassword: string }
  ) => {
    if (formData.Password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const { confirmPassword, ...userData } = formData;
    mutate(userData);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completa los datos para crear tu nueva cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="email"
                type="text"
                placeholder="nombre del usuario"
                {...register("Username", { required: true })}
              />
              {errors.Username && (
                <p className="text-red-500 text-xs">
                  El nombre de usuario es obligatorio
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                {...register("Email", {
                  required: "El email es obligatorio",
                })}
              />
              {errors.Email && (
                <p className="text-red-500 text-xs">{errors.Email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
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
                <p className="text-sm text-red-500">
                  {errors.Password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                Acepto los{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  términos y condiciones
                </a>{" "}
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
            {isError && (
              <p className="text-sm text-red-600 mt-2">
                Error: {error.message}
              </p>
            )}
            {isSuccess && data && (
              <p className="text-sm text-green-600 mt-2">
                ✅ Cuenta creada
              </p>
            )}
          </form>
          <div className="mt-6 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión aquí
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
