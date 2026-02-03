# 📚 Documentación API - Productos

## Base URL
```
http://localhost:8080/v1/productos
```

---

## 🌍 Endpoints Públicos (Sin autenticación)

### 1. Obtener todos los productos
Obtiene la lista completa de productos (incluye productos activos e inactivos).

**Request:**
```javascript
GET /v1/productos
```

**Ejemplo con Fetch:**
```javascript
async function obtenerTodosLosProductos() {
  try {
    const response = await fetch('http://localhost:8080/v1/productos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Productos:', data.data);
      return data.data; // Array de productos
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Respuesta exitosa:**
```json
{
  "responseCode": 200,
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Rolex Submariner",
      "descripcion": "Reloj de lujo sumergible",
      "precio": 50000000,
      "stock": 5,
      "marca": "Rolex",
      "imagenUrl": "/uploads/images/1234567890-abc.jpg",
      "activo": true,
      "categoriaId": 1,
      "categoriaNombre": "Relojes Premium",
      "fechaCreacion": "2026-02-02T15:30:00"
    }
  ]
}
```

---

### 2. Obtener productos activos
Obtiene solo los productos activos (disponibles para venta).

**Request:**
```javascript
GET /v1/productos/activos
```

**Ejemplo con Fetch:**
```javascript
async function obtenerProductosActivos() {
  try {
    const response = await fetch('http://localhost:8080/v1/productos/activos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Productos activos:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Respuesta exitosa:**
```json
{
  "responseCode": 200,
  "success": true,
  "message": "Productos activos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "nombre": "Rolex Submariner",
      "descripcion": "Reloj de lujo sumergible",
      "precio": 50000000,
      "stock": 5,
      "marca": "Rolex",
      "imagenUrl": "/uploads/images/1234567890-abc.jpg",
      "activo": true,
      "categoriaId": 1,
      "categoriaNombre": "Relojes Premium",
      "fechaCreacion": "2026-02-02T15:30:00"
    }
  ]
}
```

---

### 3. Obtener producto por ID
Obtiene los detalles de un producto específico.

**Request:**
```javascript
GET /v1/productos/{id}
```

**Ejemplo con Fetch:**
```javascript
async function obtenerProductoPorId(id) {
  try {
    const response = await fetch(`http://localhost:8080/v1/productos/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Producto:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso:
obtenerProductoPorId(1);
```

**Respuesta exitosa:**
```json
{
  "responseCode": 200,
  "success": true,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 1,
    "nombre": "Rolex Submariner",
    "descripcion": "Reloj de lujo sumergible de 40mm",
    "precio": 50000000,
    "stock": 5,
    "marca": "Rolex",
    "imagenUrl": "/uploads/images/1234567890-abc.jpg",
    "activo": true,
    "categoriaId": 1,
    "categoriaNombre": "Relojes Premium",
    "fechaCreacion": "2026-02-02T15:30:00"
  }
}
```

**Respuesta de error (404):**
```json
{
  "responseCode": 404,
  "success": false,
  "message": "Producto no encontrado con ID: 999",
  "data": null
}
```

---

## 🔒 Endpoints Protegidos (Requieren autenticación ADMIN)

### 4. Crear un nuevo producto
Solo administradores pueden crear productos. **IMPORTANTE:** Debes subir primero la imagen y luego usar la URL retornada.

**Flujo completo:**
1. Subir imagen a `/v1/upload/product-image`
2. Obtener URL de la imagen
3. Crear producto con la URL de la imagen

**Request:**
```javascript
POST /v1/productos
```

**Headers requeridos:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Body:**
```json
{
  "nombre": "Rolex Submariner",
  "descripcion": "Reloj de lujo sumergible de 40mm con resistencia al agua de 300m",
  "precio": 50000000,
  "stock": 5,
  "marca": "Rolex",
  "imagenUrl": "/uploads/images/1234567890-abc.jpg",
  "activo": true,
  "categoriaId": 1
}
```

**Ejemplo completo (Subir imagen + Crear producto):**
```javascript
async function crearProductoCompleto(productoData, imagenFile, token) {
  try {
    // PASO 1: Subir imagen
    const formData = new FormData();
    formData.append('image', imagenFile);

    const uploadResponse = await fetch('http://localhost:8080/v1/upload/product-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();
    
    if (!uploadData.success) {
      throw new Error('Error al subir imagen: ' + uploadData.message);
    }

    const imagenUrl = uploadData.data; // URL de la imagen

    // PASO 2: Crear producto con la URL de la imagen
    const response = await fetch('http://localhost:8080/v1/productos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...productoData,
        imagenUrl: imagenUrl
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Producto creado:', data.data);
      return data.data;
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso:
const productoData = {
  nombre: 'Rolex Submariner',
  descripcion: 'Reloj de lujo sumergible',
  precio: 50000000,
  stock: 5,
  marca: 'Rolex',
  activo: true,
  categoriaId: 1
};

crearProductoCompleto(productoData, imagenFile, token);
```

**Ejemplo con Axios:**
```javascript
import axios from 'axios';

async function crearProducto(productoData, token) {
  try {
    const { data } = await axios.post(
      'http://localhost:8080/v1/productos',
      productoData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (data.success) {
      console.log('Producto creado:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error);
  }
}
```

**Respuesta exitosa (201):**
```json
{
  "responseCode": 201,
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 7,
    "nombre": "Rolex Submariner",
    "descripcion": "Reloj de lujo sumergible de 40mm",
    "precio": 50000000,
    "stock": 5,
    "marca": "Rolex",
    "imagenUrl": "/uploads/images/1234567890-abc.jpg",
    "activo": true,
    "categoriaId": 1,
    "categoriaNombre": "Relojes Premium",
    "fechaCreacion": "2026-02-02T15:30:00"
  }
}
```

**Errores comunes:**

**400 - Validación fallida:**
```json
{
  "responseCode": 400,
  "success": false,
  "message": "El precio es obligatorio",
  "data": null
}
```

**403 - Sin permisos:**
```json
{
  "timestamp": "2026-02-02T17:30:00.000",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

### 5. Actualizar un producto
Solo administradores pueden actualizar productos.

**Request:**
```javascript
PUT /v1/productos/{id}
```

**Headers requeridos:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Body:**
```json
{
  "nombre": "Rolex Submariner Gold",
  "descripcion": "Reloj de lujo sumergible edición oro",
  "precio": 75000000,
  "stock": 3,
  "marca": "Rolex",
  "imagenUrl": "/uploads/images/1234567890-abc.jpg",
  "activo": true,
  "categoriaId": 1
}
```

**Ejemplo con Fetch:**
```javascript
async function actualizarProducto(id, productoData, token) {
  try {
    const response = await fetch(`http://localhost:8080/v1/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productoData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Producto actualizado:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso:
actualizarProducto(1, productoData, token);
```

**Si quieres cambiar la imagen:**
```javascript
async function actualizarProductoConNuevaImagen(id, productoData, nuevaImagen, token) {
  try {
    // 1. Subir nueva imagen
    const formData = new FormData();
    formData.append('image', nuevaImagen);

    const uploadResponse = await fetch('http://localhost:8080/v1/upload/product-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();
    const nuevaImagenUrl = uploadData.data;

    // 2. Actualizar producto con nueva URL
    const response = await fetch(`http://localhost:8080/v1/productos/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...productoData,
        imagenUrl: nuevaImagenUrl
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Producto actualizado:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Respuesta exitosa (200):**
```json
{
  "responseCode": 200,
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Rolex Submariner Gold",
    "descripcion": "Reloj de lujo sumergible edición oro",
    "precio": 75000000,
    "stock": 3,
    "marca": "Rolex",
    "imagenUrl": "/uploads/images/1234567890-abc.jpg",
    "activo": true,
    "categoriaId": 1,
    "categoriaNombre": "Relojes Premium",
    "fechaCreacion": "2026-02-02T15:30:00"
  }
}
```

---

### 6. Eliminar un producto
Solo administradores pueden eliminar productos. **Nota:** También elimina la imagen asociada del servidor.

**Request:**
```javascript
DELETE /v1/productos/{id}
```

**Headers requeridos:**
- `Authorization: Bearer {token}`

**Ejemplo con Fetch:**
```javascript
async function eliminarProducto(id, token) {
  try {
    const response = await fetch(`http://localhost:8080/v1/productos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Producto eliminado exitosamente');
      return true;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uso:
eliminarProducto(5, token);
```

**Respuesta exitosa (204):**
```json
{
  "responseCode": 204,
  "success": true,
  "message": "Producto eliminado exitosamente",
  "data": null
}
```

---

## 🖼️ Mostrar imágenes en el frontend

Las URLs de imágenes son relativas. Para mostrarlas, concatena con la URL base:

```javascript
// URL retornada por el backend
const imagenUrl = "/uploads/images/1234567890-abc.jpg";

// URL completa para mostrar
const imagenCompleta = `http://localhost:8080${imagenUrl}`;

// En React/HTML
<img src={imagenCompleta} alt="Producto" />
```

**Ejemplo de componente React:**
```jsx
function ProductoCard({ producto }) {
  const API_URL = 'http://localhost:8080';
  
  return (
    <div className="producto-card">
      <img 
        src={`${API_URL}${producto.imagenUrl}`}
        alt={producto.nombre}
        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
      />
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p><strong>Marca:</strong> {producto.marca}</p>
      <p><strong>Categoría:</strong> {producto.categoriaNombre}</p>
      <p><strong>Precio:</strong> ${producto.precio.toLocaleString()}</p>
      <p><strong>Stock:</strong> {producto.stock} unidades</p>
    </div>
  );
}
```

---

## 📦 Servicio Completo (React)

```javascript
// services/productoService.js
const API_URL = 'http://localhost:8080/v1/productos';
const UPLOAD_URL = 'http://localhost:8080/v1/upload';

class ProductoService {
  
  // Obtener todos los productos
  async obtenerTodos() {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  // Obtener productos activos
  async obtenerActivos() {
    try {
      const response = await fetch(`${API_URL}/activos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error al obtener productos activos:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async obtenerPorId(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  }

  // Subir imagen
  async subirImagen(imagenFile, token) {
    try {
      const formData = new FormData();
      formData.append('image', imagenFile);

      const response = await fetch(`${UPLOAD_URL}/product-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      return await response.json();
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  }

  // Crear producto (con imagen)
  async crear(productoData, imagenFile, token) {
    try {
      // 1. Subir imagen
      const uploadResult = await this.subirImagen(imagenFile, token);
      
      if (!uploadResult.success) {
        throw new Error('Error al subir imagen: ' + uploadResult.message);
      }

      // 2. Crear producto
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productoData,
          imagenUrl: uploadResult.data
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Actualizar producto
  async actualizar(id, productoData, nuevaImagen, token) {
    try {
      let imagenUrl = productoData.imagenUrl;

      // Si hay nueva imagen, subirla
      if (nuevaImagen) {
        const uploadResult = await this.subirImagen(nuevaImagen, token);
        if (uploadResult.success) {
          imagenUrl = uploadResult.data;
        }
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...productoData,
          imagenUrl: imagenUrl
        })
      });

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  // Eliminar producto
  async eliminar(id, token) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Construir URL completa de imagen
  obtenerUrlImagen(imagenUrl) {
    return `http://localhost:8080${imagenUrl}`;
  }
}

export default new ProductoService();
```

**Uso del servicio en un componente:**

```jsx
// components/ProductosList.jsx
import React, { useState, useEffect } from 'react';
import productoService from '../services/productoService';

function ProductosList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await productoService.obtenerActivos();
      if (response.success) {
        setProductos(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div className="productos-grid">
      {productos.map(producto => (
        <div key={producto.id} className="producto-card">
          <img 
            src={productoService.obtenerUrlImagen(producto.imagenUrl)}
            alt={producto.nombre}
          />
          <h3>{producto.nombre}</h3>
          <p>{producto.marca}</p>
          <p className="categoria">{producto.categoriaNombre}</p>
          <p className="precio">${producto.precio.toLocaleString()}</p>
          <p className="stock">Stock: {producto.stock}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductosList;
```

**Formulario para crear producto:**

```jsx
// components/ProductoForm.jsx
import React, { useState } from 'react';
import productoService from '../services/productoService';

function ProductoForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    marca: '',
    activo: true,
    categoriaId: ''
  });
  const [imagen, setImagen] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await productoService.crear(
        {
          ...formData,
          precio: parseFloat(formData.precio),
          stock: parseInt(formData.stock),
          categoriaId: parseInt(formData.categoriaId)
        },
        imagen,
        token
      );

      if (response.success) {
        alert('Producto creado exitosamente');
        onSuccess && onSuccess(response.data);
      } else {
        alert('Error: ' + response.message);
      }
    } catch (error) {
      alert('Error al crear producto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Precio:</label>
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          required
          min="0"
        />
      </div>

      <div>
        <label>Marca:</label>
        <input
          type="text"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Categoría ID:</label>
        <input
          type="number"
          name="categoriaId"
          value={formData.categoriaId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Imagen:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
          />
          Activo
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Producto'}
      </button>
    </form>
  );
}

export default ProductoForm;
```

---

## 🔑 Validaciones del Backend

### Reglas de validación:

- **Nombre:**
  - ✅ Obligatorio
  - ✅ Máximo 150 caracteres

- **Descripción:**
  - ⚪ Opcional
  - ✅ Máximo 1000 caracteres

- **Precio:**
  - ✅ Obligatorio
  - ✅ Debe ser mayor a 0
  - ✅ Tipo: BigDecimal

- **Stock:**
  - ✅ Obligatorio
  - ✅ No puede ser negativo (mínimo 0)
  - ✅ Tipo: Integer

- **Marca:**
  - ✅ Obligatoria
  - ✅ Máximo 100 caracteres

- **ImagenUrl:**
  - ✅ Obligatoria
  - ✅ Máximo 255 caracteres
  - ✅ Debe ser URL válida retornada por `/v1/upload/product-image`

- **Activo:**
  - ✅ Obligatorio
  - ✅ Tipo: Boolean

- **CategoriaId:**
  - ✅ Obligatorio
  - ✅ Debe existir en la tabla categoría

---

## 🛡️ Permisos

| Endpoint | Método | Acceso |
|----------|--------|--------|
| `/v1/productos` | GET | 🌍 Público |
| `/v1/productos/activos` | GET | 🌍 Público |
| `/v1/productos/{id}` | GET | 🌍 Público |
| `/v1/productos` | POST | 🔒 Solo ADMIN |
| `/v1/productos/{id}` | PUT | 🔒 Solo ADMIN |
| `/v1/productos/{id}` | DELETE | 🔒 Solo ADMIN |

---

## 📝 Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Producto creado exitosamente |
| 204 | Producto eliminado exitosamente |
| 400 | Error de validación |
| 403 | Sin permisos (requiere rol ADMIN) |
| 404 | Producto no encontrado |
| 500 | Error interno del servidor |

---

## 🔄 Variables de Entorno (Recomendado)

```javascript
// .env
REACT_APP_API_URL=http://localhost:8080

// Uso en el código
const API_URL = `${process.env.REACT_APP_API_URL}/v1/productos`;
const UPLOAD_URL = `${process.env.REACT_APP_API_URL}/v1/upload`;
```

---

## 💡 Notas Importantes

1. **Orden de creación:**
   - Primero subir la imagen → Obtener URL
   - Luego crear el producto con la URL

2. **Eliminación de productos:**
   - Al eliminar un producto, su imagen también se elimina del servidor automáticamente

3. **Actualización de productos:**
   - Si cambias la imagen, la anterior se elimina automáticamente
   - Si no cambias la imagen, mantén la URL actual

4. **Campo categoriaNombre:**
   - Se incluye automáticamente en todas las respuestas
   - No necesitas enviarlo al crear/actualizar (solo categoriaId)

5. **Imágenes:**
   - Tamaño máximo: 5MB
   - Formatos permitidos: JPG, JPEG, PNG, GIF, WEBP
   - Las imágenes son públicas (accesibles sin token)

---

**Última actualización:** Febrero 2, 2026  
**Versión API:** v1  
**Proyecto:** Prime Drip Club
