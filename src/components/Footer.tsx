export default function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-background-dark text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-900 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-24 mb-32">
        {/* Soporte */}
        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mb-10">
            Soporte
          </h4>
          <ul className="space-y-4 text-[13px] font-medium tracking-wide">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Envíos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Devoluciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Contacto (Email/WhatsApp)
              </a>
            </li>
          </ul>
        </div>

        {/* Pedidos */}
        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mb-10">
            Pedidos
          </h4>
          <ul className="space-y-4 text-[13px] font-medium tracking-wide">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Rastrear pedido
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Mi cuenta
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 mb-10">
            Legal
          </h4>
          <ul className="space-y-4 text-[13px] font-medium tracking-wide">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Privacidad
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Términos
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-12 border-t border-zinc-200/50 dark:border-zinc-900/50 flex flex-col items-center gap-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600 font-bold">
          © 2026 PRIMEDRIP CLUB. TODOS LOS DERECHOS RESERVADOS.
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600 font-bold">
          DESARROLLADO POR{" "}
          <a
            href="#"
            className="text-zinc-600 dark:text-zinc-400 hover:text-primary border-b border-zinc-300 dark:border-zinc-800 hover:border-primary transition-all pb-0.5"
          >
            NEOCODE
          </a>
        </p>
      </div>
    </footer>
  );
}
