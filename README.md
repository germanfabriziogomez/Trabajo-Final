# 🛒 ProductManager — Gestión de productos + Buscador

Este proyecto es una aplicación web de gestión de productos que permite crear, listar, actualizar y eliminar productos, ahora con una nueva funcionalidad: **una barra de búsqueda en tiempo real** que permite encontrar productos por nombre usando una consulta al servidor.

---

## 🚀 Funcionalidad Agregada: Barra de busqueda

Se implementó una **barra de búsqueda** en el frontend que permite filtrar productos por nombre:

- Se creo un nuevo estado, llamado ```inputSearchProduct``` en el componente ```<Home />``` del frontend
- Se creo un input el cual toma el valor que tenga ese estado, y a medida que el usuario escribe, se actualiza el estado del input.
- Con "useEffect", a medida que se modifica ese estado, se ejecuta una funcion llamada ```fetchingProductsByName``` la cual hace un `fetch()` con método `POST` al endpoint ```/api/products/search```, enviando un JSON al backend con la estructura:  
  ```json
  {
     "input": "textoIngresado"
  }
  ```
- En el backend se agregó una nueva ruta ```POST``` al endpoint  ```/api/products/search``` en productRouter.js.
- Esa ruta ejecuta la función ``` getProductsByName ``` definida en  ```productControllers.ts```, que realiza una búsqueda con expresión regular en MongoDB (case-insensitive).


## 🚀 Funcionalidad Agregada: fetch al servidor segun su modo de desarrollo

Se agregaron las variables de entorno al frontend:
- ```VITE_DEV_MODE```
- ```VITE_URL_BACKEND```

Esto me sirve para hacer el fetch al servidor dependiendo del modo en el que esté, si en produccion o en desarrollo. Para ello, declaré una url_backend antes de hacer cualquier fetch. Ejemplo:
```
const url_backend = import.meta.env.VITE_DEV_MODE === "development" ? "http://localhost:3000" : import.meta.env.VITE_URL_BACKEND;

```
Luego, al hacer los ```fetch()``` use comillas backticks para poder unir esa url_backend con el endpoint al cual quiero enviar la peticion. Ejemplo:
```
fetch(`${url_backend}/api/products/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: inputSearchProduct })
      })
```
---

🛠️ Tecnologías utilizadas
- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express
- Base de datos: MongoDB + Mongoose
- Otros: dotenv, fetch API, JWT (para autenticación)

---
▶️ Instrucciones para ejecutar el proyecto

1. Clonar el repositorio
```
git clone https://github.com/germanfabriziogomez/Trabajo-Final
```
2. Instalar dependencias

Backend:

```
cd backend
npm install
```

Frontend
```
cd frontend
npm install
```

3. Crear archivo .env en ambas carpetas
📄 Ejemplo de .env para backend:
```
PORT=
URI_DB=
JWT_SECRET=
```

📄 Ejemplo de .env para frontend (.env en raíz del frontend):
```
VITE_DEV_MODE=development
VITE_URL_BACKEND=http://localhost:3000
```

4. Ejecutar backend
```
cd backend
npm run dev
```

5. Ejecutar frontend
```
cd frontend
npm run dev
```



