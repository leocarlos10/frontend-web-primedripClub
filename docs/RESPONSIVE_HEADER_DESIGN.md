# Diseño Responsive del Header y Animación del Menú Mobile

## 1. Estructura del Header Responsive

### Layout Principal

El header utiliza **Flexbox** como base del diseño responsivo, combinado con **Tailwind CSS** para aplicar estilos diferentes según el tamaño de pantalla:

```jsx
<header className={`
  fixed z-20 w-full flex
  md:flex-row md:items-center 
  px-4 md:px-[40px] 
  py-3 md:py-[12px] 
  gap-4 md:gap-0
`}>
```

**Breakpoints Tailwind:**
- **Mobile (< 768px)**: Flex por defecto, dirección column
- **Desktop (≥ 768px)**: `md:flex-row` para fila, `md:items-center` para alineación vertical

### Secciones del Header

#### 1.1 Logo (Flex: 1)
```jsx
<div className="flex justify-center flex-1">
  <Link to="/">
    <img src={isDark ? logo : logo_dark} 
         className="w-[43px] h-[43px] md:w-[60px] md:h-[60px]" />
  </Link>
</div>
```
- **Mobile**: 43x43px
- **Desktop**: 60x60px
- Usa `flex-1` para ocupar espacio disponible
- El logo cambia de color según el tema (dark/light)

#### 1.2 Icono Menú y Navegación (Flex: 2)
```jsx
<div className="flex justify-end items-center md:justify-end flex-2 mb-2 md:mb-0">
  {/* Menú hamburguesa - Solo visible en mobile */}
  <img src={/* icono */} 
       className="md:hidden cursor-pointer"
       onClick={handleCloseMenu} />
  
  {/* Navegación - Solo visible en desktop */}
  <nav className="hidden md:flex">
    <ul className="flex flex-row items-center gap-5 pr-5">
      {/* Enlaces */}
    </ul>
  </nav>
</div>
```

**Responsividad:**
- `md:hidden` → Oculta el icono de menú en desktop
- `hidden md:flex` → Muestra la navegación solo en desktop
- En mobile, el espaciado inferior (`mb-2`) se elimina en desktop (`md:mb-0`)

#### 1.3 Botón de Tema (Flex: 1)
```jsx
<div className="hidden md:flex justify-center items-center flex-1">
  <Button onClick={toggleDarkMode}>
    {isDark ? <img src={sol_dark} /> : <img src={luna_light} />}
  </Button>
</div>
```
- `hidden md:flex` → Solo visible en desktop
- En mobile, este botón se incluye dentro del menú desplegable

---

## 2. Sistema de Estado del Menú

### Estado React

```tsx
const [isOpen, setIsOpen] = useState<boolean>(false);

const handleCloseMenu = () => {
  setIsOpen(!isOpen);  // Alterna entre abierto y cerrado
};
```

El estado `isOpen` controla:
1. La visibilidad del menú
2. Las animaciones CSS aplicadas
3. El comportamiento del click fuera del menú

---

## 3. Animación de Abrir/Cerrar el Menú

### Componente Menu

El menú recibe props para su funcionamiento:

```tsx
<Menu 
  isDark={isDark} 
  isOpen={isOpen}              // Estado de apertura
  onClose={handleCloseMenu}    // Función para cerrar
  reficon={reficon}            // Referencia al icono
/>
```

### CSS de Animación

#### Estado Cerrado (`.menu`)
```css
.menu {
  opacity: 0;                    /* Invisible */
  display: none;                 /* No ocupa espacio */
  transform: translateY(-12px);  /* Desplazado 12px hacia arriba */
  transition: opacity 0.3s ease-in-out, 
              transform 0.3s ease-in-out,
              display 0.3s ease-in-out allow-discrete;
}
```

**Propiedades:**
- `opacity: 0` → Menú transparente
- `display: none` → No se renderiza (mejora rendimiento)
- `transform: translateY(-12px)` → Aparición desde arriba
- `transition: ... allow-discrete` → Permite animar la propiedad `display`

#### Estado Abierto (`.menu.menu-toggle`)
```css
.menu.menu-toggle {
  opacity: 1;                    /* Completamente visible */
  transform: translateY(0);      /* En su posición final */
  transition: all 0.3s ease-in-out;
  
  @starting-style {
    opacity: 0;
    transform: translateY(-12px);
  }
}

.menu.menu-toggle {
  display: block;  /* Se renderiza en el DOM */
}

/* En desktop, el menú se oculta automáticamente */
@media (width >= 48rem) {
  .menu.menu-toggle {
    display: none;
  }
}
```

**`@starting-style`:**
- Define el estado inicial para animaciones más suaves
- Sin esto, el navegador no sabría de dónde animar
- Se ejecuta cuando la clase `.menu-toggle` se añade

### Secuencia de Animación

1. **Usuario hace click en icono:**
   - `isOpen` se actualiza a `true`
   - Se añade la clase `menu-toggle` al menú

2. **Animación de apertura (0.3s):**
   ```
   opacity: 0 → 1
   translateY(-12px) → translateY(0)
   ```

3. **Usuario hace click fuera o en enlace:**
   - Se ejecuta `handleClickOutside`
   - `isOpen` se actualiza a `false`
   - Se elimina la clase `menu-toggle`

4. **Animación de cierre (0.3s):**
   ```
   opacity: 1 → 0
   translateY(0) → translateY(-12px)
   display: block → none
   ```

---

## 4. Detección de Click Fuera

### Hook useEffect en Menu.tsx

```tsx
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;

    // Comprobaciones:
    const clickedInsideMenu = menuRef.current?.contains(target);
    const clickedOnIcon = reficon?.current?.contains(target);

    // Si no está en el menú ni en el icono, cierra
    if (!clickedInsideMenu && !clickedOnIcon) {
      onClose();  // Ejecuta handleCloseMenu del Header
    }
  };

  // Solo agrega listener cuando el menú está abierto
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  // Cleanup: elimina el listener cuando el componente se desmonta
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen, onClose, reficon]);
```

**Ventajas de este enfoque:**
- El listener solo se activa cuando el menú está abierto
- Evita clicks en el icono del menú (para que pueda usarse para cerrar)
- Mejora rendimiento al limpiar el listener

---

## 5. Animación de Items del Menú

Cada enlace en el menú usa el componente `BlurFade` con delays escalonados:

```tsx
<li>
  <BlurFade delay={0.1}>
    <Link to="/planes" className="...">Planes</Link>
  </BlurFade>
</li>
<li>
  <BlurFade delay={0.2}>
    <WhatsAppButton>Contáctanos</WhatsAppButton>
  </BlurFade>
</li>
```

**Efecto:**
- Cada item aparece con una pequeña demora escalonada
- `delay={0.1}` → Primera línea
- `delay={0.2}` → Segunda línea
- Crea una animación en cascada suave y moderna

---

## 6. Manejo del Tema en el Menú

El menú se adapta al tema oscuro/claro:

```jsx
<div className={`
  absolute z-10 top-16 left-0 right-0 w-full menu ${isOpen && "menu-toggle"}
  ${isDark ? "bg-[var(--color-dark-bg)]" : "bg-[var(--color-light-bg)]"}
`}>
```

**Variables CSS personalizadas:**
- `--color-dark-bg`: #121417 (fondo oscuro)
- `--color-light-bg`: #fff (fondo claro)

---

## 7. Resumen de Features Responsive

| Feature | Mobile | Desktop |
|---------|--------|---------|
| Icono menú | Visible | Oculto (`md:hidden`) |
| Navegación | En menú desplegable | En header (`hidden md:flex`) |
| Botón tema | En menú | En header (`hidden md:flex`) |
| Logo tamaño | 43x43px | 60x60px |
| Padding | 4px (`px-4`) | 40px (`md:px-[40px]`) |
| Animación | Suave (0.3s) | N/A (siempre visible) |

---

## 8. Mejoras y Consideraciones

### ✅ Implementado Correctamente
- Animaciones suaves con `ease-in-out`
- Click outside functionality
- Responsive design completo
- Tema adaptable (dark/light)
- Performance optimizado (display:none)

### 💡 Posibles Mejoras Futuras
1. **Swipe gestures** para cerrar en mobile
2. **Animación mejorada** del icono hamburguesa (morph animation)
3. **Body scroll lock** cuando el menú está abierto
4. **Prefetch** de enlaces para carga más rápida
