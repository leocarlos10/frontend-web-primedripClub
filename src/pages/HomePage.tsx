import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";
import type { Product } from "../types/product";

// Mock data - Replace with real data later
const mockProducts: Product[] = [
  {
    id: "1",
    brand: "Brand Name",
    name: "Boost 350 V2 'Carbon'",
    price: 320.0,
    image: "",
    badge: "Nuevo",
    isFeatured: true,
  },
  {
    id: "2",
    brand: "Collaboration",
    name: "Dunk Low 'Pine Green'",
    price: 540.0,
    image: "",
    badge: "Destacado",
    isFeatured: true,
  },
  {
    id: "3",
    brand: "Essentials",
    name: "Essentials Hoodie 'Moss'",
    price: 180.0,
    image: "",
    isFeatured: true,
  },
  {
    id: "4",
    brand: "Classic",
    name: "Logo Tee",
    price: 95.0,
    image: "",
    isFeatured: false,
  },
  {
    id: "5",
    brand: "Iconic",
    name: "Retro 1 'University Blue'",
    price: 480.0,
    image: "",
    badge: "Últimas unidades",
    isFeatured: true,
  },
  {
    id: "6",
    brand: "Performance",
    name: "Air Max 270 'Red Fury'",
    price: 210.0,
    image: "",
    isFeatured: true,
  },
  {
    id: "7",
    brand: "Luxury",
    name: "Premium Watch 'Gold Edition'",
    price: 1250.0,
    image: "",
    badge: "Destacado",
    isFeatured: true,
  },
  {
    id: "8",
    brand: "Street",
    name: "Urban Jacket 'Black'",
    price: 340.0,
    image: "",
    isFeatured: true,
  },
];

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
