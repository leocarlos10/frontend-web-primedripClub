import {Header,Footer,Hero} from "../components";
import { FeaturedProducts } from "../components";
import type { Product } from "../types/product";
import imagen3 from "../assets/imagen3.jpeg";
import imagen4 from "../assets/imagen4.jpeg";
import imagen5 from "../assets/imagen5.jpeg";
import imagen6 from "../assets/imagen6.jpeg";
import imagen7 from "../assets/imagen7.jpeg";
import imagen8 from "../assets/imagen8.jpeg";
import imagen9 from "../assets/imagen9.jpeg";
import imagen10 from "../assets/imagen10.jpeg";
import imagen12 from "../assets/imagen12.jpeg";

// Mock data - Replace with real data later
const mockProducts: Product[] = [
  {
    id: "1",
    brand: "reloj 1",
    name: "reloj premium",
    price: 550.0,
    image: imagen3,
    badge: "Nuevo",
    isFeatured: true,
  },
  {
    id: "2",
    brand: "Collaboration",
    name: "Dunk Low 'Pine Green'",
    price: 540.0,
    image: imagen4,
    badge: "Destacado",
    isFeatured: true,
  },
  {
    id: "3",
    brand: "Essentials",
    name: "Essentials Hoodie 'Moss'",
    price: 180.0,
    image: imagen5,
    isFeatured: true,
  },
  {
    id: "4",
    brand: "Classic",
    name: "Logo Tee",
    price: 95.0,
    image: imagen6,
    isFeatured: false,
  },
  {
    id: "5",
    brand: "Iconic",
    name: "Retro 1 'University Blue'",
    price: 480.0,
    image: imagen7,
    badge: "Últimas unidades",
    isFeatured: true,
  },
  {
    id: "6",
    brand: "Performance",
    name: "Air Max 270 'Red Fury'",
    price: 210.0,
    image: imagen8,
    isFeatured: true,
  },
  {
    id: "7",
    brand: "Luxury",
    name: "Premium Watch 'Gold Edition'",
    price: 1250.0,
    image: imagen9,
    badge: "Destacado",
    isFeatured: true,
  },
  {
    id: "8",
    brand: "Street",
    name: "Urban Jacket 'Black'",
    price: 340.0,
    image: imagen10,
    isFeatured: true,
  },
  {
    id: "9",
    brand: "Street",
    name: "Urban Jacket 'Black'",
    price: 340.0,
    image: imagen12,
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
