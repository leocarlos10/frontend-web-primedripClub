import { Link } from "react-router";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí implementarás la lógica de autenticación
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-zinc-900 dark:text-white min-h-screen flex flex-col items-center px-6 py-20 selection:bg-primary selection:text-black">
      {/* Main Content */}
      <main className="w-full max-w-95">
        <div className="space-y-12">
          {/* Navigation */}
          <nav className="flex justify-center items-center mb-8">
            <Link
              to="/"
              className="font-display font-bold text-xl tracking-[0.4em] uppercase"
            >
              PRIME<span className="text-primary">DRIP</span>CLUB
            </Link>
          </nav>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="font-display text-2xl font-light tracking-widest uppercase">
              Iniciar Sesión
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-[10px] uppercase tracking-[0.2em] mb-3 font-medium text-zinc-500 dark:text-white/40 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors"
                >
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full bg-transparent border-b border-zinc-300 dark:border-white/30 focus:border-zinc-900 dark:focus:border-white transition-all duration-300 py-3 px-0 outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20"
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <label
                  htmlFor="password"
                  className="block text-[10px] uppercase tracking-[0.2em] mb-3 font-medium text-zinc-500 dark:text-white/40 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-white/30 focus:border-zinc-900 dark:focus:border-white transition-all duration-300 py-3 pr-10 px-0 outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-white/40 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px] cursor-pointer">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col items-center gap-6">
              <button
                type="submit"
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-4 text-xs uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 dark:hover:bg-gray-200 transition-all"
              >
                Autenticar
              </button>
              <Link
                to="/register"
                className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 dark:text-white/60 hover:text-zinc-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-zinc-900 dark:hover:border-white"
              >
                ¿No tienes una cuenta? Regístrate
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-20 pb-10 flex justify-center">
        <p className="text-[9px] text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.5em]">
          Prime Drip Club — 2026
        </p>
      </footer>
    </div>
  );
}
