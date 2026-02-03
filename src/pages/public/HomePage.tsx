import { Header, Footer, Hero } from "../../components";
import { FeaturedProducts } from "../../components";
import { mockProducts } from "../../utils/mocks";



export default function HomePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      <Header />
      <Hero />
      <FeaturedProducts products={mockProducts} />
      <Footer />
    </div>
  );
}
