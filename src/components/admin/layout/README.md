# 📱 Sidebar Desplegable - Documentación

## 🎯 Descripción General

El sidebar del panel de administración implementa un menú desplegable responsivo que se adapta automáticamente a dispositivos móviles y desktop.

---

## 🏗️ Arquitectura de Componentes

### 1. **AdminLayout** (Contenedor Principal)
**Ubicación:** `AdminLayout.tsx`

```tsx
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
```

**Responsabilidades:**
- Maneja el estado global del sidebar (`isOpen`)
- Controla la apertura/cierre del menú
- Coordina la comunicación entre Header y Sidebar

**Funciones clave:**
```tsx
toggleSidebar() // Alterna entre abierto/cerrado
closeSidebar()  // Cierra el menú
```

---

### 2. **AdminHeader** (Botón de Menú)
**Ubicación:** `AdminHeader.tsx`

```tsx
<button onClick={onMenuClick} className="md:hidden">
  <span className="material-symbols-outlined">menu</span>
</button>
```

**Características:**
- **Visible solo en móvil:** `md:hidden` (oculto en pantallas ≥768px)
- **Icono hamburguesa:** Material Symbols `menu`
- **Acción:** Al hacer click ejecuta `onMenuClick()` del padre (AdminLayout)

---

### 3. **AdminSidebar** (Menú Lateral)
**Ubicación:** `AdminSidebar.tsx`

#### Props Interface
```tsx
interface AdminSidebarProps {
  isOpen: boolean;    // Estado del menú
  onClose: () => void; // Función para cerrar
}
```

---

## 🎨 Sistema de Animaciones

### Overlay (Fondo Oscuro)
```tsx
{isOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-40 md:hidden"
    onClick={onClose}
  />
)}
```

**Funcionamiento:**
- ✅ **Renderizado condicional:** Solo aparece cuando `isOpen === true`
- ✅ **Fondo semitransparente:** `bg-black/50` (negro con 50% opacidad)
- ✅ **Posición fija:** `fixed inset-0` (cubre toda la pantalla)
- ✅ **Solo móvil:** `md:hidden` (desaparece en desktop)
- ✅ **z-index:** `z-40` (debajo del sidebar pero sobre el contenido)
- ✅ **Click para cerrar:** `onClick={onClose}`

---

### Sidebar con Animación de Deslizamiento

```tsx
<aside className={`
  w-64 
  fixed h-full 
  z-50 
  transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}>
```

#### Desglose de Clases:

| Clase | Propósito |
|-------|-----------|
| `w-64` | Ancho fijo de 256px |
| `fixed h-full` | Posición fija, altura completa |
| `z-50` | Por encima del overlay (`z-40`) |
| `transition-transform` | Anima la transformación |
| `duration-300` | Duración de 300ms |
| `ease-in-out` | Aceleración suave al inicio y final |
| `translate-x-0` | Posición visible (sin desplazamiento) |
| `-translate-x-full` | Oculto fuera de la pantalla (izquierda) |
| `md:translate-x-0` | Siempre visible en desktop |

---

## 🔄 Flujo de Funcionamiento

### En Móvil (< 768px):

#### 1. **Estado Inicial (Cerrado)**
```
┌─────────────────────┐
│ ☰ Prime Drip / Home │ ← Header con botón hamburguesa
├─────────────────────┤
│                     │
│   [Sidebar oculto]  │ ← translate-x-full (fuera de pantalla)
│   Contenido visible │
│                     │
└─────────────────────┘
```

#### 2. **Usuario hace Click en ☰**
```javascript
// AdminLayout.tsx
toggleSidebar() → setIsSidebarOpen(true)
```

#### 3. **Estado Abierto**
```
┌──────────┬──────────┐
│ ■ Panel  │▓▓▓▓▓▓▓▓▓▓│ ← Overlay oscuro
│ ■ Produc │▓▓▓▓▓▓▓▓▓▓│
│ ■ Pedido │▓▓▓▓▓▓▓▓▓▓│
│ ■ Ventas │▓▓▓▓▓▓▓▓▓▓│
└──────────┴──────────┘
   ↑ Sidebar deslizado (translate-x-0)
```

**Transición de animación (300ms):**
```
-translate-x-full → translate-x-0
(fuera pantalla)    (visible)
```

#### 4. **Usuario hace Click en Overlay o Link**
```javascript
// AdminSidebar.tsx
onClick={onClose} → setIsSidebarOpen(false)
```

#### 5. **Sidebar se Oculta con Animación Inversa**
```
translate-x-0 → -translate-x-full
(visible)       (fuera pantalla)
```

---

### En Desktop (≥ 768px):

```
┌──────────┬───────────────┐
│ ■ Panel  │ Prime Drip    │ ← Sin botón hamburguesa
│ ■ Produc ├───────────────┤
│ ■ Pedido │               │
│ ■ Ventas │  Contenido    │
│          │               │
└──────────┴───────────────┘
   ↑ Siempre visible (md:translate-x-0)
```

- ❌ **Sin botón hamburguesa:** `md:hidden` en el botón
- ❌ **Sin overlay:** `md:hidden` en el overlay
- ✅ **Sidebar fijo:** `md:translate-x-0` (siempre posición 0)
- ✅ **Contenido con margen:** `md:ml-64` (256px)

---

## 🎭 Estados del Componente

### Estado: `isSidebarOpen`

| Valor | Desktop | Móvil |
|-------|---------|-------|
| `true` | Siempre visible | Sidebar visible + Overlay |
| `false` | Siempre visible | Sidebar oculto |

---

## 📐 Breakpoints Responsivos

```css
/* Tailwind breakpoints */
md: 768px   /* Tablet y Desktop */
```

**Comportamiento:**
- **< 768px:** Menú desplegable controlado por estado
- **≥ 768px:** Menú siempre visible (ignora estado)

---

## 🔧 Cómo Funciona `useLocation()`

```tsx
const location = useLocation();
const isActive = location.pathname === item.path;
```

**Propósito:** Detectar qué página está activa para resaltar el menú correspondiente.

**Ejemplo:**
```javascript
// Usuario está en /dashboard/productos
location.pathname = "/dashboard/productos"

// Al renderizar menú:
item.path === "/dashboard/productos" → isActive = true ✅
item.path === "/dashboard/pedidos"  → isActive = false ❌
```

---

## 🎨 Clases Condicionales

```tsx
className={`
  ${isActive 
    ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border-l-2 border-slate-900" 
    : "text-slate-500 hover:text-slate-900 border-l-2 border-transparent"
  }
`}
```

**Item Activo:**
- Fondo gris claro
- Texto oscuro
- Borde izquierdo de 2px

**Item Inactivo:**
- Sin fondo
- Texto gris
- Borde transparente
- Hover cambia a oscuro

---

## 🧪 Testing del Comportamiento

### Test Manual:

1. **Móvil - Abrir Menú:**
   - Click en ☰
   - ✅ Sidebar desliza desde izquierda
   - ✅ Overlay oscuro aparece
   - ✅ Animación suave (300ms)

2. **Móvil - Cerrar con Overlay:**
   - Click en zona oscura
   - ✅ Sidebar se oculta
   - ✅ Overlay desaparece

3. **Móvil - Cerrar con Link:**
   - Click en cualquier item del menú
   - ✅ Navega a la página
   - ✅ Menú se cierra automáticamente

4. **Desktop:**
   - ✅ Botón hamburguesa no visible
   - ✅ Sidebar siempre presente
   - ✅ Sin overlay

---

## 📦 Dependencias

```json
{
  "react-router": "^7.x",
  "tailwindcss": "^3.x"
}
```

**Hooks utilizados:**
- `useState` - Gestión del estado del menú
- `useLocation` - Detección de ruta activa
- `Link` - Navegación SPA

---

## 🚀 Mejoras Futuras Posibles

1. **Animación del overlay:**
   ```tsx
   className={`transition-opacity duration-300 ${
     isOpen ? 'opacity-100' : 'opacity-0'
   }`}
   ```

2. **Cerrar al presionar ESC:**
   ```tsx
   useEffect(() => {
     const handleEsc = (e) => {
       if (e.key === 'Escape') onClose();
     };
     document.addEventListener('keydown', handleEsc);
     return () => document.removeEventListener('keydown', handleEsc);
   }, [onClose]);
   ```

3. **Swipe para cerrar:**
   - Implementar detección de gestos táctiles
   - Cerrar al deslizar hacia la izquierda

---

## 📝 Notas Importantes

⚠️ **z-index hierarchy:**
```
z-10:  Header
z-20:  Contenido principal
z-40:  Overlay
z-50:  Sidebar
```

⚠️ **No usar `navigate()` en los Links:**
- Los `<Link>` de React Router son mejores para SEO
- Permiten "abrir en nueva pestaña"
- Son accesibles para lectores de pantalla

⚠️ **Estado no persiste:**
- El estado `isSidebarOpen` se reinicia en cada mount
- Esto es intencional para que siempre inicie cerrado en móvil

---

## 🐛 Troubleshooting

### Problema: Sidebar no se anima
**Solución:** Verificar que Tailwind incluya las clases `transition-transform`

### Problema: Overlay no cubre todo
**Solución:** Asegurar `fixed inset-0` en el overlay

### Problema: Menu visible en desktop cuando debería estar oculto
**Solución:** Verificar `md:translate-x-0` en el sidebar

---

## 👥 Autores

Desarrollado para **Prime Drip Club** por Neocode

---

## 📄 Licencia

Todos los derechos reservados © 2026
