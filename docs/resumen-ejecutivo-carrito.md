# 🎯 Resumen Ejecutivo - Sistema de Carritos y Pedidos

**Fecha:** 9 de febrero de 2026  
**Versión:** 1.0

---

## 📊 Vista General del Sistema

El sistema implementa un flujo completo de e-commerce que soporta:

✅ **Usuarios Registrados**: Carrito persistente asociado a la cuenta  
✅ **Usuarios Anónimos**: Carrito temporal basado en Session ID  
✅ **Conversión de Carrito a Pedido**: Proceso automatizado  
✅ **Gestión de Pagos**: Múltiples métodos de pago  
✅ **Estados del Pedido**: Seguimiento completo del pedido

---

## 🔄 Flujo Principal del Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│                   FLUJO COMPLETO DEL USUARIO                     │
└─────────────────────────────────────────────────────────────────┘

1. NAVEGAR CATÁLOGO
   │
   ├─> Ver productos disponibles
   └─> Filtrar por categorías
   
2. AGREGAR AL CARRITO
   │
   ├─> Click en "Agregar al carrito"
   ├─> Seleccionar cantidad
   ├─> Guardar en Context + Backend
   └─> Mostrar confirmación
   
3. VER CARRITO
   │
   ├─> Ver lista de productos
   ├─> Modificar cantidades
   ├─> Ver resumen (subtotal + envío)
   └─> Eliminar productos
   
4. CHECKOUT (Datos de Envío)
   │
   ├─> Ingresar nombre y contacto
   ├─> Ingresar teléfono
   ├─> Ingresar dirección de envío
   ├─> Agregar notas opcionales
   └─> Click en "Continuar al Pago"
   
5. CREAR PEDIDO
   │
   ├─> Backend crea registro en tabla Pedido
   ├─> Copia items de Carrito → DetallePedido
   ├─> Reduce stock de productos
   ├─> Calcula totales (subtotal + envío)
   ├─> Vacía el carrito
   └─> Genera ID del pedido
   
6. PROCESO DE PAGO
   │
   ├─> Seleccionar método de pago
   ├─> Ingresar datos de pago
   ├─> Procesar con pasarela
   ├─> Actualizar estado del pedido
   └─> Crear registro en tabla Pago
   
7. CONFIRMACIÓN
   │
   ├─> Mostrar página de confirmación
   ├─> Enviar email al cliente
   ├─> Notificar al administrador
   └─> Generar número de seguimiento
```

---

## 🗄️ Estructura de Datos

### Tablas Principales:

```
Usuario
  ├── id
  ├── nombre
  ├── email
  ├── telefono
  ├── direccion_envio
  └── password

Carrito
  ├── id
  ├── usuario_id (FK → Usuario) [NULLABLE]
  ├── session_id [NULLABLE]
  ├── fecha_creacion
  └── fecha_actualizacion

DetalleCarrito
  ├── id
  ├── carrito_id (FK → Carrito)
  ├── producto_id (FK → Producto)
  ├── cantidad
  └── precio_unitario

Pedido
  ├── id
  ├── usuario_id (FK → Usuario) [NULLABLE]
  ├── email_contacto
  ├── nombre_contacto
  ├── telefono
  ├── direccion_envio
  ├── subtotal
  ├── costo_envio
  ├── total
  ├── estado (ENUM)
  └── notas

DetallePedido
  ├── id
  ├── pedido_id (FK → Pedido)
  ├── producto_id (FK → Producto)
  ├── cantidad
  └── precio_unitario

Pago
  ├── id
  ├── pedido_id (FK → Pedido)
  ├── metodo (ENUM)
  ├── estado (ENUM)
  ├── referencia
  ├── monto
  └── fecha_pago
```

---

## 🎨 Arquitectura Frontend

```
src/
├── types/
│   ├── cart/
│   │   └── CartItem.ts          ← Interfaces del carrito
│   ├── requestType/
│   │   ├── pedido/
│   │   │   └── CrearPedidoRequest.ts
│   │   └── pago/
│   │       └── PagoRequest.ts
│   └── ContextType/
│       └── CarritoContextType.ts
│
├── context/
│   └── Carrito.Context.tsx      ← Estado global del carrito
│
├── hooks/
│   └── useCarrito.tsx            ← Hook personalizado
│
├── utils/
│   ├── sessionUtils.ts           ← Gestión de sessions anónimas
│   └── carritoUtils/
│       ├── cartStorage.ts        ← LocalStorage
│       ├── cartCalculations.ts   ← Cálculos de totales
│       └── cartApi.ts            ← Peticiones HTTP
│
├── components/
│   └── cart/
│       ├── CartItem.tsx          ← Item individual
│       └── CartSummary.tsx       ← Resumen del pedido
│
└── pages/
    └── public/
        ├── CartPage.tsx          ← Página del carrito
        ├── CheckoutPage.tsx      ← Página de checkout
        ├── PaymentPage.tsx       ← Página de pago
        └── OrderConfirmationPage.tsx
```

---

## 🔐 Seguridad

### Usuarios Anónimos:
- **Session ID**: UUID v4 generado en el cliente
- **Almacenamiento**: LocalStorage
- **Validación**: El backend valida que el session_id sea único
- **Expiración**: 30 días de inactividad

### Usuarios Registrados:
- **Autenticación**: JWT Token
- **Carrito único**: Un carrito por usuario (UK en usuario_id)
- **Migración**: Al iniciar sesión, el carrito anónimo se puede fusionar

### Validaciones Backend:
```java
// 1. Validar stock antes de crear pedido
if (producto.getStock() < cantidad) {
    throw new StockInsuficienteException();
}

// 2. Validar precios (evitar manipulación)
if (!precioCarrito.equals(producto.getPrecio())) {
    // Actualizar con precio real
    detalle.setPrecioUnitario(producto.getPrecio());
}

// 3. Validar unicidad del carrito
@Unique(columnNames = {"usuario_id"})
@Unique(columnNames = {"session_id"})
```

---

## 📈 Estados del Sistema

### Estados del Pedido:
```
PENDIENTE          → Recién creado, esperando pago
  ↓
PAGO_PENDIENTE     → Esperando confirmación de la pasarela
  ↓
PAGADO             → Pago confirmado
  ↓
PROCESANDO         → En preparación
  ↓
ENVIADO            → En camino al cliente
  ↓
ENTREGADO          → Completado exitosamente

// Estados alternativos:
CANCELADO          → Cancelado por usuario o admin
DEVUELTO           → Producto devuelto
REEMBOLSADO        → Dinero devuelto al cliente
```

### Estados del Pago:
```
PENDIENTE   → Esperando procesamiento
APROBADO    → Pago exitoso
RECHAZADO   → Pago rechazado
REEMBOLSADO → Dinero devuelto
CANCELADO   → Transacción cancelada
```

---

## 🔄 Conversión: Carrito → Pedido

```java
@Transactional
public PedidoResponse crearDesdeCarrito(Long usuarioId, String sessionId) {
    // 1. Obtener carrito
    Carrito carrito = obtenerCarrito(usuarioId, sessionId);
    
    // 2. Validar items
    validarStock(carrito.getItems());
    validarPrecios(carrito.getItems());
    
    // 3. Calcular totales
    double subtotal = calcularSubtotal(carrito.getItems());
    double costoEnvio = calcularEnvio(direccion);
    double total = subtotal + costoEnvio;
    
    // 4. Crear Pedido
    Pedido pedido = new Pedido();
    pedido.setUsuarioId(usuarioId);
    pedido.setSubtotal(subtotal);
    pedido.setCostoEnvio(costoEnvio);
    pedido.setTotal(total);
    pedido.setEstado(EstadoPedido.PENDIENTE);
    pedidoRepository.save(pedido);
    
    // 5. Copiar items: DetalleCarrito → DetallePedido
    for (DetalleCarrito item : carrito.getItems()) {
        DetallePedido detalle = new DetallePedido();
        detalle.setPedidoId(pedido.getId());
        detalle.setProductoId(item.getProductoId());
        detalle.setCantidad(item.getCantidad());
        detalle.setPrecioUnitario(item.getPrecioUnitario());
        detallePedidoRepository.save(detalle);
        
        // Reducir stock
        productoService.reducirStock(
            item.getProductoId(), 
            item.getCantidad()
        );
    }
    
    // 6. Vaciar carrito
    vaciarCarrito(carrito.getId());
    
    // 7. Enviar notificaciones
    emailService.enviarConfirmacion(pedido);
    
    return pedido;
}
```

---

## 🚀 Optimizaciones

### Performance:
1. **Índices en BD**:
   ```sql
   CREATE INDEX idx_carrito_usuario ON Carrito(usuario_id);
   CREATE INDEX idx_carrito_session ON Carrito(session_id);
   CREATE INDEX idx_pedido_estado ON Pedido(estado);
   CREATE INDEX idx_pedido_fecha ON Pedido(fecha_creacion);
   ```

2. **Caché de Productos**:
   ```java
   @Cacheable("productos")
   public Producto obtenerPorId(Long id) { ... }
   ```

3. **Lazy Loading en Frontend**:
   ```typescript
   const CartPage = lazy(() => import('./pages/CartPage'));
   ```

### Limpieza Automática:
```sql
-- Event programado para eliminar carritos abandonados
CREATE EVENT evt_limpiar_carritos
ON SCHEDULE EVERY 1 DAY
DO DELETE FROM Carrito 
   WHERE fecha_actualizacion < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

---

## 📊 Métricas Recomendadas

### Monitoreo:
- ✅ **Tasa de abandono de carrito**: Items agregados vs pedidos completados
- ✅ **Tiempo promedio de checkout**: Desde carrito hasta pago
- ✅ **Valor promedio del pedido**: Total / Cantidad de pedidos
- ✅ **Productos más agregados**: Top 10 en carritos
- ✅ **Tasa de conversión**: Visitas vs pedidos completados

### Queries para Analytics:
```sql
-- Tasa de abandono
SELECT 
    COUNT(DISTINCT c.id) AS carritos_activos,
    COUNT(DISTINCT p.id) AS pedidos_completados,
    ROUND((1 - COUNT(DISTINCT p.id) / COUNT(DISTINCT c.id)) * 100, 2) AS tasa_abandono
FROM Carrito c
LEFT JOIN Pedido p ON c.usuario_id = p.usuario_id;

-- Valor promedio del pedido
SELECT AVG(total) AS valor_promedio
FROM Pedido
WHERE estado IN ('PAGADO', 'PROCESANDO', 'ENVIADO', 'ENTREGADO');

-- Productos más agregados al carrito
SELECT 
    p.nombre,
    COUNT(dc.id) AS veces_agregado,
    SUM(dc.cantidad) AS cantidad_total
FROM DetalleCarrito dc
JOIN Producto p ON dc.producto_id = p.id
GROUP BY p.id, p.nombre
ORDER BY veces_agregado DESC
LIMIT 10;
```

---

## ✅ Checklist de Implementación

### Fase 1: Base de Datos (1-2 días)
- [ ] Backup de BD
- [ ] Crear tabla Carrito
- [ ] Crear tabla DetalleCarrito
- [ ] Modificar tabla Usuario
- [ ] Modificar tabla Pedido
- [ ] Modificar tabla Pago
- [ ] Crear índices
- [ ] Crear stored procedures
- [ ] Programar eventos de limpieza
- [ ] Insertar datos de prueba

### Fase 2: Backend (3-5 días)
- [ ] Crear entidad Carrito
- [ ] Crear entidad DetalleCarrito
- [ ] Actualizar entidades existentes
- [ ] Crear CarritoRepository
- [ ] Crear CarritoService
- [ ] Crear CarritoController
- [ ] Actualizar PedidoService
- [ ] Implementar validaciones
- [ ] Manejo de sesiones anónimas
- [ ] Tests unitarios

### Fase 3: Frontend (4-6 días)
- [ ] Definir tipos TypeScript
- [ ] Crear utilidades (session, storage, calculations)
- [ ] Implementar Context del Carrito
- [ ] Crear componentes del carrito
- [ ] Crear CartPage
- [ ] Crear CheckoutPage
- [ ] Crear PaymentPage
- [ ] Crear OrderConfirmationPage
- [ ] Integrar con API
- [ ] Estilos responsive
- [ ] Tests de componentes

### Fase 4: Testing & QA (2-3 días)
- [ ] Tests unitarios backend
- [ ] Tests de integración
- [ ] Tests E2E
- [ ] Pruebas de carga
- [ ] Validación de seguridad
- [ ] Pruebas con usuarios reales

### Fase 5: Deploy & Monitoreo (1 día)
- [ ] Deploy a staging
- [ ] Smoke tests
- [ ] Deploy a producción
- [ ] Configurar monitoreo
- [ ] Documentación final

---

## 🎯 Próximos Pasos

### Inmediato:
1. ✅ Ejecutar scripts de migración de BD
2. ✅ Validar estructura de tablas
3. ✅ Insertar datos de prueba
4. ✅ Comenzar implementación backend

### Corto Plazo:
- Implementar funcionalidad de "Guardar para más tarde"
- Agregar cupones de descuento
- Implementar programa de puntos/recompensas
- Integración con más pasarelas de pago

### Largo Plazo:
- Sistema de recomendaciones ("También te puede interesar")
- Carrito compartido (enviar link del carrito)
- Списки de deseos (wishlists)
- One-click checkout para usuarios registrados

---

## 📚 Documentos Relacionados

1. **[migracion-base-datos.md](./migracion-base-datos.md)**: Scripts SQL detallados
2. **[implementacion-carrito-frontend.md](./implementacion-carrito-frontend.md)**: Código frontend completo
3. **[integracion-backend.md](./integracion-backend.md)**: Implementación Spring Boot (próximo)

---

## 🆘 Troubleshooting Común

### Problema: El carrito no persiste entre sesiones
**Solución**: Verificar que el Session ID se esté guardando correctamente en localStorage

### Problema: Stock insuficiente al crear pedido
**Solución**: Validar stock en tiempo real antes de proceder al checkout

### Problema: Precios no coinciden
**Solución**: Siempre usar el precio actual de la BD, no el del carrito

### Problema: Carrito no se vacía después de crear pedido
**Solución**: Verificar que el método `vaciarCarrito()` se ejecute en la transacción

---

## 📞 Contacto y Soporte

Para preguntas o problemas durante la implementación:
- 📧 Email: soporte@primedripclub.com
- 💬 Slack: #dev-ecommerce
- 📝 Documentación: https://docs.primedripclub.com

---

**Última actualización:** 9 de febrero de 2026  
**Versión:** 1.0  
**Autor**: Sistema PrimeDripClub - Documentación Técnica
