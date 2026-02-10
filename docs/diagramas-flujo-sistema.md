# 📊 Diagramas de Flujo - Sistema de Carritos y Pedidos

**Fecha:** 9 de febrero de 2026  
**Objetivo:** Visualización gráfica del sistema completo

---

## 🗺️ Diagrama 1: Flujo Principal del Usuario

```mermaid
graph TD
    A[Usuario en HomePage] --> B{¿Qué hace?}
    B -->|Ve Catálogo| C[CatalogPage]
    B -->|Click en Producto| D[ProductDetailPage]

    C --> E[Selecciona Producto]
    D --> E

    E --> F[Click: Agregar al Carrito]
    F --> G{¿Usuario autenticado?}

    G -->|Sí| H[Guardar con usuario_id]
    G -->|No| I[Guardar con session_id]

    H --> J[Backend: Carrito + DetalleCarrito]
    I --> J

    J --> K[Context actualizado]
    K --> L[Toast: Producto agregado]

    L --> M{¿Continúa comprando?}
    M -->|Sí| C
    M -->|No| N[CartPage]

    N --> O[Revisar productos]
    O --> P{¿Modifica carrito?}
    P -->|Actualizar cantidad| Q[Update cantidad]
    P -->|Eliminar item| R[Delete item]
    P -->|Continuar| S[Click: Proceder al Pago]

    Q --> N
    R --> N

    S --> T[CheckoutPage]
    T --> U[Formulario de envío]
    U --> V[Ingresar datos de contacto]
    V --> W[Click: Continuar al Pago]

    W --> X[Backend: Crear Pedido]
    X --> Y[Copiar Carrito → Pedido]
    Y --> Z[Reducir Stock]
    Z --> AA[Vaciar Carrito]

    AA --> AB[PaymentPage]
    AB --> AC[Seleccionar método de pago]
    AC --> AD[Procesar pago]

    AD --> AE{¿Pago exitoso?}
    AE -->|Sí| AF[OrderConfirmationPage]
    AE -->|No| AG[Mostrar error]

    AF --> AH[Enviar email confirmación]
    AH --> AI[FIN: Pedido completado]

    AG --> AB

    style A fill:#e1f5ff
    style AI fill:#c8e6c9
    style AF fill:#c8e6c9
    style AG fill:#ffcdd2
```

---

## 🗄️ Diagrama 2: Modelo de Datos (ER)

```mermaid
erDiagram
    USUARIO ||--o{ CARRITO : "tiene"
    USUARIO ||--o{ PEDIDO : "realiza"
    CARRITO ||--o{ DETALLE_CARRITO : "contiene"
    PEDIDO ||--o{ DETALLE_PEDIDO : "contiene"
    PEDIDO ||--o{ PAGO : "tiene"
    PRODUCTO ||--o{ DETALLE_CARRITO : "está en"
    PRODUCTO ||--o{ DETALLE_PEDIDO : "está en"
    PRODUCTO }o--|| CATEGORIA : "pertenece a"
    USUARIO }o--o{ ROL : "tiene"

    USUARIO {
        bigint id PK
        string nombre
        string email UK
        string telefono
        text direccion_envio
        string password
        boolean activo
        timestamp fecha_creacion
    }

    CARRITO {
        bigint id PK
        bigint usuario_id FK "NULLABLE"
        string session_id UK "NULLABLE"
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    DETALLE_CARRITO {
        bigint id PK
        bigint carrito_id FK
        bigint producto_id FK
        int cantidad
        decimal precio_unitario
        timestamp fecha_agregado
    }

    PEDIDO {
        bigint id PK
        bigint usuario_id FK "NULLABLE"
        string email_contacto
        string nombre_contacto
        string telefono
        text direccion_envio
        decimal subtotal
        decimal costo_envio
        decimal total
        enum estado
        text notas
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    DETALLE_PEDIDO {
        bigint id PK
        bigint pedido_id FK
        bigint producto_id FK
        int cantidad
        decimal precio_unitario
    }

    PAGO {
        bigint id PK
        bigint pedido_id FK
        enum metodo
        enum estado
        string referencia
        decimal monto
        text mensaje_error
        json metadata
        timestamp fecha_pago
        timestamp fecha_creacion
    }

    PRODUCTO {
        bigint id PK
        string nombre
        text descripcion
        decimal precio
        int stock
        string marca
        string imagen_url
        bigint categoria_id FK
        boolean activo
        timestamp fecha_creacion
    }

    CATEGORIA {
        bigint id PK
        string nombre
        text descripcion
    }

    ROL {
        bigint id PK
        string nombre
    }
```

---

## 🔄 Diagrama 3: Proceso de Conversión (Carrito → Pedido)

```mermaid
sequenceDiagram
    actor Usuario
    participant Frontend
    participant Backend
    participant Carrito DB
    participant Pedido DB
    participant Producto DB
    participant Email Service

    Usuario->>Frontend: Click "Proceder al Pago"
    Frontend->>Frontend: Navegar a CheckoutPage
    Usuario->>Frontend: Llenar datos de envío
    Frontend->>Backend: POST /pedidos/crear

    Backend->>Backend: Obtener usuario_id o session_id
    Backend->>Carrito DB: SELECT Carrito + DetalleCarrito
    Carrito DB-->>Backend: Items del carrito

    Backend->>Backend: Validar stock disponible
    Backend->>Producto DB: SELECT stock WHERE id IN (...)
    Producto DB-->>Backend: Stock actual

    alt Stock insuficiente
        Backend-->>Frontend: 400 - Stock insuficiente
        Frontend->>Usuario: Mostrar error
    else Stock disponible
        Backend->>Backend: Calcular subtotal
        Backend->>Backend: Calcular costo envío
        Backend->>Backend: Calcular total

        Backend->>Pedido DB: INSERT Pedido
        Pedido DB-->>Backend: ID del pedido

        loop Para cada item del carrito
            Backend->>Pedido DB: INSERT DetallePedido
            Backend->>Producto DB: UPDATE stock = stock - cantidad
        end

        Backend->>Carrito DB: DELETE DetalleCarrito WHERE carrito_id
        Backend->>Email Service: Enviar confirmación

        Backend-->>Frontend: 200 - Pedido creado
        Frontend->>Frontend: Navegar a PaymentPage
        Frontend->>Usuario: Mostrar página de pago
    end
```

---

## 🔐 Diagrama 4: Gestión de Sesiones (Usuario Anónimo vs Registrado)

```mermaid
graph TD
    A[Usuario ingresa al sitio] --> B{¿Tiene token JWT?}

    B -->|Sí| C[Usuario REGISTRADO]
    B -->|No| D[Usuario ANÓNIMO]

    C --> E[Extraer usuario_id del token]
    D --> F{¿Tiene session_id?}

    F -->|Sí| G[Usar session_id existente]
    F -->|No| H[Generar nuevo UUID]

    H --> I[Guardar en localStorage]
    I --> J[session_id creado]

    E --> K[Agregar producto al carrito]
    G --> K
    J --> K

    K --> L[Backend recibe request]
    L --> M{¿Header tiene token?}

    M -->|Sí| N[Asociar a usuario_id]
    M -->|No| O[Buscar Session-ID header]

    N --> P[INSERT/UPDATE Carrito<br/>WHERE usuario_id]
    O --> Q[INSERT/UPDATE Carrito<br/>WHERE session_id]

    P --> R[Carrito persistido]
    Q --> R

    R --> S{Usuario anónimo inicia sesión}
    S -->|Sí| T[FUSIONAR CARRITOS]
    S -->|No| U[Continuar normalmente]

    T --> V[Migrar items de<br/>session_id a usuario_id]
    V --> W[DELETE carrito anónimo]
    W --> X[Limpiar session_id]
    X --> U

    style C fill:#c8e6c9
    style D fill:#fff9c4
    style R fill:#bbdefb
    style T fill:#ffccbc
```

---

## 💳 Diagrama 5: Proceso de Pago

```mermaid
stateDiagram-v2
    [*] --> PedidoCreado: Usuario completa checkout

    PedidoCreado --> SeleccionMetodo: Navega a PaymentPage
    SeleccionMetodo --> IngresaDatos: Selecciona método de pago

    IngresaDatos --> ProcesandoPago: Click "Confirmar Pago"

    ProcesandoPago --> PasarelaExterna: Backend llama API pasarela

    PasarelaExterna --> PagoAprobado: Transacción exitosa
    PasarelaExterna --> PagoRechazado: Transacción fallida

    PagoAprobado --> ActualizarPedido: Backend recibe webhook
    ActualizarPedido --> PedidoPagado: Actualiza estado

    PedidoPagado --> EnviarNotificaciones: Email + SMS
    EnviarNotificaciones --> [*]: Confirmación mostrada

    PagoRechazado --> MostrarError: Mostrar mensaje de error
    MostrarError --> SeleccionMetodo: Permitir reintentar

    note right of ProcesandoPago
        Estado Pedido: PAGO_PENDIENTE
        Estado Pago: PENDIENTE
    end note

    note right of PedidoPagado
        Estado Pedido: PAGADO
        Estado Pago: APROBADO
    end note
```

---

## 📦 Diagrama 6: Estados del Pedido (Ciclo de Vida)

```mermaid
stateDiagram-v2
    [*] --> PENDIENTE: Pedido creado

    PENDIENTE --> PAGO_PENDIENTE: Iniciado proceso de pago
    PAGO_PENDIENTE --> PAGADO: Pago confirmado
    PAGO_PENDIENTE --> CANCELADO: Pago rechazado x3

    PAGADO --> PROCESANDO: Admin acepta pedido
    PROCESANDO --> ENVIADO: Pedido despachado
    ENVIADO --> ENTREGADO: Cliente recibe pedido

    PAGADO --> CANCELADO: Cliente cancela (< 24h)
    PROCESANDO --> CANCELADO: Admin cancela

    ENTREGADO --> DEVUELTO: Cliente devuelve producto
    DEVUELTO --> REEMBOLSADO: Dinero devuelto

    ENTREGADO --> [*]: Proceso completado
    CANCELADO --> [*]: Fin
    REEMBOLSADO --> [*]: Fin

    note right of PENDIENTE
        Recién creado
        Esperando pago
    end note

    note right of PAGADO
        Pago confirmado
        Listo para preparar
    end note

    note right of ENVIADO
        En tránsito
        Tracking activo
    end note

    note right of ENTREGADO
        Completado exitosamente
        Cliente satisfecho
    end note
```

---

## 🏗️ Diagrama 7: Arquitectura de Capas

```mermaid
graph TB
    subgraph "Frontend - React + TypeScript"
        A1[Components]
        A2[Pages]
        A3[Context/Hooks]
        A4[Utils/API]
    end

    subgraph "Backend - Spring Boot"
        B1[Controllers]
        B2[Services]
        B3[Repositories]
        B4[Entities]
    end

    subgraph "Base de Datos - MySQL"
        C1[(Carrito)]
        C2[(DetalleCarrito)]
        C3[(Pedido)]
        C4[(DetallePedido)]
        C5[(Pago)]
        C6[(Producto)]
    end

    subgraph "Servicios Externos"
        D1[Pasarela de Pago]
        D2[Servicio de Email]
        D3[Servicio de SMS]
    end

    A1 --> A2
    A2 --> A3
    A3 --> A4

    A4 -->|HTTP REST| B1

    B1 --> B2
    B2 --> B3
    B3 --> B4

    B4 --> C1
    B4 --> C2
    B4 --> C3
    B4 --> C4
    B4 --> C5
    B4 --> C6

    B2 -->|API Call| D1
    B2 -->|Send Email| D2
    B2 -->|Send SMS| D3

    style A1 fill:#e1f5ff
    style B2 fill:#fff9c4
    style C1 fill:#c8e6c9
    style D1 fill:#ffccbc
```

---

## 🔄 Diagrama 8: API Endpoints del Carrito

```mermaid
graph LR
    subgraph "Carrito API"
        A[GET /api/carrito]
        B[POST /api/carrito/agregar]
        C[PUT /api/carrito/actualizar]
        D[DELETE /api/carrito/eliminar/:id]
        E[DELETE /api/carrito/vaciar]
    end

    subgraph "Pedido API"
        F[POST /api/pedidos/crear]
        G[GET /api/pedidos/:id]
        H[GET /api/pedidos/usuario]
        I[PUT /api/pedidos/:id/cancelar]
    end

    subgraph "Pago API"
        J[POST /api/pagos/procesar]
        K[POST /api/pagos/webhook]
        L[GET /api/pagos/:id]
    end

    A -->|Retorna| A1[CartResponse]
    B -->|Request| B1[AddToCartRequest]
    B -->|Retorna| B2[CartItem]

    F -->|Request| F1[CrearPedidoRequest]
    F -->|Retorna| F2[PedidoResponse]

    J -->|Request| J1[ProcesarPagoRequest]
    J -->|Retorna| J2[PagoResponse]

    style A fill:#c8e6c9
    style B fill:#c8e6c9
    style F fill:#bbdefb
    style J fill:#ffccbc
```

---

## 🧪 Diagrama 9: Flujo de Testing

```mermaid
graph TD
    A[Código commitado] --> B{Tipo de cambio}

    B -->|Backend| C[Tests Unitarios JUnit]
    B -->|Frontend| D[Tests Unitarios Jest]

    C --> E[Tests de Integración]
    D --> E

    E --> F{¿Tests pasan?}

    F -->|No| G[Revisar logs]
    G --> H[Fix code]
    H --> A

    F -->|Sí| I[Tests E2E Cypress]

    I --> J{¿E2E pasan?}

    J -->|No| G
    J -->|Sí| K[Deploy a Staging]

    K --> L[Smoke Tests]
    L --> M{¿Smoke OK?}

    M -->|No| N[Rollback]
    M -->|Sí| O[QA Manual]

    O --> P{¿QA aprueba?}
    P -->|No| G
    P -->|Sí| Q[Deploy a Producción]

    Q --> R[Monitoreo 24/7]
    R --> S{¿Errores?}

    S -->|Sí| T[Alert DevOps]
    T --> G
    S -->|No| U[✅ Éxito]

    style U fill:#c8e6c9
    style N fill:#ffcdd2
    style Q fill:#bbdefb
```

---

## 📊 Diagrama 10: Monitoreo y Analytics

```mermaid
graph TB
    subgraph "Eventos del Usuario"
        A1[Producto visto]
        A2[Producto agregado]
        A3[Carrito visto]
        A4[Checkout iniciado]
        A5[Pago procesado]
        A6[Pedido completado]
    end

    subgraph "Métricas Calculadas"
        B1[Tasa de conversión]
        B2[Abandono de carrito]
        B3[Valor promedio pedido]
        B4[Productos populares]
        B5[Tiempo promedio checkout]
    end

    subgraph "Dashboard Admin"
        C1[Ventas del día]
        C2[Pedidos pendientes]
        C3[Stock bajo]
        C4[Gráficas tiempo real]
    end

    A1 --> B1
    A2 --> B2
    A3 --> B2
    A4 --> B5
    A5 --> B1
    A6 --> B1
    A6 --> B3

    A2 --> B4

    B1 --> C1
    B2 --> C2
    B3 --> C1
    B4 --> C4

    style A6 fill:#c8e6c9
    style B1 fill:#bbdefb
    style C1 fill:#fff9c4
```

---

## 🔍 Diagrama 11: Validaciones en el Sistema

```mermaid
graph TD
    A[Request del Usuario] --> B{Validación Frontend}

    B -->|❌ Inválido| C[Mostrar error en UI]
    B -->|✅ Válido| D[Enviar a Backend]

    D --> E{Validación Backend}

    E -->|❌ Inválido| F[Retornar 400 Bad Request]
    E -->|✅ Válido| G{Validar Stock}

    G -->|❌ Insuficiente| H[Retornar 409 Conflict]
    G -->|✅ Disponible| I{Validar Precios}

    I -->|❌ Manipulados| J[Actualizar con precio DB]
    I -->|✅ Correctos| K[Procesar Request]

    J --> K
    K --> L{Validar Integridad}

    L -->|❌ Error| M[Rollback Transaction]
    L -->|✅ OK| N[Commit Transaction]

    M --> O[Retornar 500 Error]
    N --> P[Retornar 200 Success]

    F --> C
    H --> C
    O --> C
    P --> Q[Actualizar UI]

    style C fill:#ffcdd2
    style P fill:#c8e6c9
    style Q fill:#c8e6c9
```

---

## 📱 Diagrama 12: Responsive Flow (Mobile vs Desktop)

```mermaid
graph LR
    A[Usuario accede] --> B{Dispositivo}

    B -->|Desktop| C[Layout completo]
    B -->|Mobile| D[Layout simplificado]

    C --> E[Sidebar visible]
    C --> F[Header expandido]
    C --> G[Carrito en sidebar]

    D --> H[Menu hamburguesa]
    D --> I[Header compacto]
    D --> J[Carrito en modal]

    E --> K[Ver productos]
    H --> K

    K --> L[Agregar al carrito]

    L --> M{Dispositivo}
    M -->|Desktop| N[Actualizar badge + sidebar]
    M -->|Mobile| O[Actualizar badge + toast]

    N --> P[Checkout en página]
    O --> Q[Checkout fullscreen]

    P --> R[Pago en 2 columnas]
    Q --> S[Pago en 1 columna]

    R --> T[Confirmación]
    S --> T

    style D fill:#bbdefb
    style C fill:#c8e6c9
    style T fill:#fff9c4
```

---

## 🎯 Uso de los Diagramas

### Para Desarrolladores:

- **Diagrama 1**: Entender el flujo completo del usuario
- **Diagrama 2**: Referencia rápida del modelo de datos
- **Diagrama 3**: Implementar el proceso de conversión
- **Diagrama 4**: Manejar sesiones correctamente
- **Diagrama 7**: Arquitectura general del sistema

### Para Product Managers:

- **Diagrama 1**: Visualizar experiencia del usuario
- **Diagrama 6**: Estados del pedido
- **Diagrama 10**: Métricas y analytics

### Para QA:

- **Diagrama 9**: Flujo de testing
- **Diagrama 11**: Validaciones a probar
- **Diagrama 12**: Casos responsive

---

## 📝 Notas Finales

Estos diagramas son **documentación viva** y deben actualizarse cuando:

- Se agregan nuevas funcionalidades
- Cambia el flujo de algún proceso
- Se modifican estados o validaciones
- Se integran nuevos servicios externos

---

**Última actualización:** 9 de febrero de 2026  
**Versión:** 1.0  
**Herramienta:** Mermaid.js
