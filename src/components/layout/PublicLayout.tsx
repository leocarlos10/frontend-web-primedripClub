import type { PublicLayoutProps } from "../../types/TypeProps/PublicLayoutProps";
import Footer from "./Footer";
import Header from "./Header";

function PublicLayout({children}: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-zinc-100 transition-colors duration-300">
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default PublicLayout