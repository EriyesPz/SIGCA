import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"
import { ModeToggle } from "@/components/ui/mode-toggle";

export const NotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 relative">
            {/* Toggle de tema en la esquina superior derecha */}
            <div className="absolute top-6 right-6">
                <ModeToggle />
            </div>

            <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
                {/* Número 404 grande */}
                <div className="relative">
                    <h1 className="text-9xl md:text-[12rem] font-bold text-slate-200 dark:text-slate-700 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white dark:bg-slate-800 rounded-full p-6 shadow-lg dark:shadow-slate-900/50 border dark:border-slate-700">
                            <Search className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                        </div>
                    </div>
                </div>

                {/* Mensaje principal */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Página no encontrada</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                        Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
                    </p>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild size="lg" className="min-w-[160px]">
                        <a href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Ir al inicio
                        </a>
                    </Button>

                    <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                        <a href="#" onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver atrás
                        </a>
                    </Button>
                </div>

                {/* Enlaces útiles */}
                <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">¿Necesitas ayuda? Prueba estos enlaces:</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <a
                            href="/contact"
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 underline underline-offset-4"
                        >
                            Contacto
                        </a>
                        <a
                            href="/help"
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 underline underline-offset-4"
                        >
                            Ayuda
                        </a>
                        <a
                            href="/sitemap"
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 underline underline-offset-4"
                        >
                            Mapa del sitio
                        </a>
                    </div>
                </div>
            </div>

            {/* Decoración adicional con soporte para dark mode */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full opacity-50 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-5 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full opacity-50 animate-pulse delay-500"></div>
        </div>
    )
}
