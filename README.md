# 🌱 SobraCeroRepo — Monorepo Oficial

> **Marketplace de rescate de alimentos**: ventas con descuento de excedentes comerciales y canal de donaciones directas para organizaciones sociales vulnerables.

Este repositorio contiene el **Backend** y el **Frontend** de la plataforma SobraCero, estructurados bajo un **Monorepo** con flujo de trabajo colaborativo estricto (**Gitflow**) para desarrollo en entorno local.

---

## 📁 Estructura del Monorepo

```text
SobraCeroRepo/
├── sobracero-backend/        # API REST: Spring Boot 3, Java 21, Flyway, PostgreSQL / H2 local
├── sobracero-frontend/       # Aplicación Web SPA: Angular 22, TypeScript, Tailwind/SCSS
├── .github/                  # Configuración de GitHub (CODEOWNERS y plantillas de PR)
├── .gitignore                # Reglas globales de exclusión (Maven, Angular, Node, IDEs)
└── README.md                 # Documentación técnica y guía de integración para el equipo
```

---

## 👥 Equipo y Asignación de Módulos (Gitflow)

Para evitar cualquier conflicto de integración, cada estudiante es responsable exclusivo de su carpeta asignada:

| Estudiante | Rol / Módulo Asignado | Carpeta Exclusiva en el Repositorio | Rama de Trabajo |
|---|---|---|---|
| **Diego Torres (Lead)** | Arquitectura Base, Backend, Core, Layout, Auth | `sobracero-backend/`, `sobracero-frontend/src/app/core/`, `layout/`, `auth/` | `main` y `develop` |
| **Angello Castillo** | Landing pública, Impacto público y Página 404 | `sobracero-frontend/src/app/features/landing/` | `feature/parte-2-landing` |
| **Luz Gonzales** | Consumidor (Ofertas cercanas, Mapa, Pago y Reservas) | `sobracero-frontend/src/app/features/consumidor/` | `feature/parte-3-consumidor` |
| **Alvaro Grados** | Comercio (Publicar oferta, Canjear código, Donaciones) | `sobracero-frontend/src/app/features/comercio/` | `feature/parte-4-comercio` |
| **William Villacorta** | Organización Social (Donaciones, Recojos, Ley 30498) | `sobracero-frontend/src/app/features/organizacion/` | `feature/parte-5-organizacion` |
| **Mathias Oré** | Administración e Impacto (Validaciones, Reporte CSV, Predicción) | `sobracero-frontend/src/app/features/admin/`, `impacto/` | `feature/parte-6-admin-impacto` |

---

## 📝 Estándar de Commits (Conventional Commits)

Todos los commits deben cumplir con la especificación de **Conventional Commits**:

### Sintaxis Requerida:
```text
<tipo>(<alcance>): <descripción concisa en minúsculas>
```

### Tipos Permitidos:
| Tipo | Cuándo Usarlo | Ejemplo |
|---|---|---|
| `feat` | Nueva funcionalidad o módulo para el usuario | `feat(consumidor): implementar mapa de ofertas cercanas (US06-US10)` |
| `fix` | Corrección de un fallo o error | `fix(auth): corregir guardado del token JWT en localStorage` |
| `chore` | Tareas de configuración inicial o estructura | `chore(init): inicializar monorepo, arquitectura base y ambiente local (Diego Torres)` |
| `docs` | Modificaciones únicamente en documentación | `docs(readme): actualizar nombres de integrantes y guía local` |
| `style` | Cambios de formato o estilos SCSS (sin alterar lógica) | `style(layout): ajustar espaciado responsive del navbar` |
| `refactor` | Reestructuración de código sin agregar features ni corregir bugs | `refactor(ofertas): simplificar cálculo de porcentaje de ahorro` |

---

## 🔄 Flujo Paso a Paso para Colaboradores

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DiegoA-TorresA/SobraCeroRepo.git
   cd SobraCeroRepo
   ```
2. **Crear su rama de trabajo desde `develop`:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/parte-N-<nombre-modulo>
   ```
3. **Reemplazar la carpeta de su módulo:**
   Copiar los archivos de su entrega dentro de:  
   `sobracero-frontend/src/app/features/<tu-modulo>/` (reemplazando la pantalla provisional 🚧).
4. **Instalar dependencias y verificar compilación local:**
   ```bash
   cd sobracero-frontend
   npm install
   npm run build
   ```
5. **Hacer commit siguiendo la convención:**
   ```bash
   git add src/app/features/<tu-modulo>
   git commit -m "feat(<modulo>): implementacion completa de historias asignadas"
   git push -u origin feature/parte-N-<nombre-modulo>
   ```
6. **Abrir Pull Request en GitHub:**
   - Rama base: **`develop`** ← Rama comparada: **`feature/parte-N-...`**
   - Completar el checklist de la plantilla de PR.
   - Solicitar revisión a Diego Torres.

---

## 💻 Ejecución en Local (Ambiente de Pruebas)

### 1. Backend (`sobracero-backend`)
* Requiere Java 21+ instalado.
* **Opción A (Recomendada - Modo Embebido sin instalar base de datos externa):**
  ```bash
  cd sobracero-backend
  ./mvnw test-compile "exec:java" "-Dexec.mainClass=pe.upc.sobracero.LocalEmbeddedApplication" "-Dexec.classpathScope=test"
  ```
* **Opción B (Con PostgreSQL local en localhost:5432):**
  ```bash
  cd sobracero-backend
  ./mvnw spring-boot:run
  ```
* **Documentación interactiva (Swagger UI):**  
  `http://localhost:8080/swagger-ui/index.html`

### 2. Frontend (`sobracero-frontend`)
* Requiere Node.js 22 LTS o 24.
* **Iniciar el servidor de desarrollo Angular:**
  ```bash
  cd sobracero-frontend
  npm install
  npm start
  ```
* Abre en tu navegador en: `http://localhost:4200`  
*(Consume automáticamente el backend local en `http://localhost:8080`)*.

---

## 🔑 Credenciales Demo para Pruebas Locales

* **Consumidor:** `consumidor@demo.pe` | Clave: `Demo1234`
* **Comercio:** `comercio1@demo.pe` | Clave: `Demo1234`
* **Organización Social:** `ong1@demo.pe` | Clave: `Demo1234`
* **Administrador:** `admin@sobracero.pe` | Clave: `Admin1234`
