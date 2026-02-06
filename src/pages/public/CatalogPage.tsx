import { useSearchParams } from "react-router";
import { PublicLayout } from "../../components"
import { CatalogProducts } from "../../components";
import { useProductosActivos } from "../../hooks/useProductosActivos"


function CatalogPage() {

  const {productos,isLoading,error,refetch} = useProductosActivos();
  /* 
  // Obtener parámetros de búsqueda
  */
  const [searchParams] =  useSearchParams();
  const sexoParam = searchParams.get("sexo");
  const categoriaIdParam = searchParams.get("categoriaId");

  /* 
    filtrar productos según los parámetros de búsqueda
    retorna solo los que pasan el filtro
  */
    const productosFiltrados = productos.filter((producto)=> {
      if(sexoParam && producto.sexo !== sexoParam) return false;
      if(categoriaIdParam && producto.categoriaId.toString() !== categoriaIdParam) return false;
      return true;
    })
  
   return (
    <PublicLayout>
      <CatalogProducts 
      products={productosFiltrados}
      isLoading={isLoading}
      error={error || undefined}
      onRetry={refetch}
      />
    </PublicLayout>
  )
}

export default CatalogPage