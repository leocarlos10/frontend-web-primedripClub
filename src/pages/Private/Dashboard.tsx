import { Link } from "react-router";
import { AdminLayout } from "../../components";

function Dashboard() {
  return (
    <AdminLayout title="Panel Principal">
      <div className="space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-sm shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Ventas Totales (Mes)
              </span>
              <span className="material-symbols-outlined text-slate-400 text-lg">
                payments
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-mono font-medium dark:text-white">
                420,690.00€
              </h2>
              <span className="text-xs text-green-500 font-mono">+12.4%</span>
            </div>
            <div className="mt-4 w-full bg-slate-100 dark:bg-white/5 h-1">
              <div className="bg-primary h-full w-[75%]"></div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-sm shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Pedidos Diarios
              </span>
              <span className="material-symbols-outlined text-slate-400 text-lg">
                local_shipping
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-mono font-medium dark:text-white">
                1,248
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                PROM: 940
              </span>
            </div>
            <div className="mt-4 flex items-end gap-1 h-4">
              <div className="flex-1 bg-slate-200 dark:bg-white/10 h-[40%]"></div>
              <div className="flex-1 bg-slate-200 dark:bg-white/10 h-[60%]"></div>
              <div className="flex-1 bg-slate-200 dark:bg-white/10 h-[30%]"></div>
              <div className="flex-1 bg-slate-200 dark:bg-white/10 h-[80%]"></div>
              <div className="flex-1 bg-primary h-[95%]"></div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-sm shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Estado de Inventario
              </span>
              <span className="material-symbols-outlined text-red-500 text-lg">
                warning
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-mono font-medium text-red-500">
                12 Artículos
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Bajo el Límite
              </span>
            </div>
            <div className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Acción Inmediata Requerida
            </div>
          </div>
        </section>

        {/* Quick Access & Recent Orders */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-sm shadow-sm">
            <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest dark:text-white">
                Pedidos Recientes
              </h3>
              <Link
                to="/dashboard/pedidos"
                className="text-[10px] font-mono text-slate-500 underline uppercase hover:text-primary transition-colors"
              >
                Ver Todo
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-white/2 border-b border-slate-100 dark:border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      ID Pedido
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Total
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 font-mono text-[11px]">
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-slate-400">#ORD-0921-X</td>
                    <td className="px-6 py-4 dark:text-white uppercase">
                      S. Gvasalia
                    </td>
                    <td className="px-6 py-4 dark:text-white">2,150.00€</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] uppercase font-bold tracking-tighter">
                        Completado
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-slate-400">#ORD-0922-Y</td>
                    <td className="px-6 py-4 dark:text-white uppercase">
                      M. Prada
                    </td>
                    <td className="px-6 py-4 dark:text-white">4,200.00€</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[9px] uppercase font-bold tracking-tighter">
                        Procesando
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-slate-400">#ORD-0923-Z</td>
                    <td className="px-6 py-4 dark:text-white uppercase">
                      R. Owens
                    </td>
                    <td className="px-6 py-4 dark:text-white">1,890.00€</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] uppercase font-bold tracking-tighter">
                        Completado
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
