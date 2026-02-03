import { Link } from "react-router";

function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="material-symbols-outlined text-[80px] text-red-500">
            block
          </span>
        </div>

        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">
          Acceso Denegado
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          No tienes permisos para acceder a esta página. Si crees que esto es un
          error, contacta al administrador.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
