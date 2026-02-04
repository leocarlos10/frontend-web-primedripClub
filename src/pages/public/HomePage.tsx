import {  Hero, PublicLayout } from "../../components";
import { FeaturedProducts } from "../../components";
import { useProductosActivos } from "../../hooks/useProductosActivos";



export default function HomePage() {

  const {productos,isLoading,error,refetch} = useProductosActivos();
  return (
    <PublicLayout>
      <Hero />
      <FeaturedProducts 
      products={productos}
      isLoading={isLoading}
      error={error || undefined}
      onRetry={refetch}
      />
    </PublicLayout>
  );
}
