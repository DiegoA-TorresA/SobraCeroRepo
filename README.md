# ðŸŒ± SobraCeroRepo â€” Monorepo Oficial

> **Marketplace de rescate de alimentos**: ventas con descuento de excedentes comerciales y canal de donaciones directas para organizaciones sociales vulnerables.

Este repositorio contiene el **Backend** y el **Frontend** de la plataforma SobraCero, estructurados bajo un **Monorepo** con flujo de trabajo colaborativo estricto (**Gitflow**) para desarrollo en entorno local.

---

## ðŸ“ Estructura del Monorepo

```text
SobraCeroRepo/
â”œâ”€â”€ sobracero-backend/        # API REST: Spring Boot 3, Java 21, Flyway, PostgreSQL / H2 local
â”œâ”€â”€ sobracero-frontend/       # AplicaciÃ³n Web SPA: Angular 22, TypeScript, Tailwind/SCSS
â”œâ”€â”€ .github/                  # ConfiguraciÃ³n de GitHub (CODEOWNERS y plantillas de PR)
â”œâ”€â”€ .gitignore                # Reglas globales de exclusiÃ³n (Maven, Angular, Node, IDEs)
â””â”€â”€ README.md                 # DocumentaciÃ³n tÃ©cnica y guÃ­a de integraciÃ³n para el equipo
```

---

## ðŸ‘¥ Roles y AsignaciÃ³n de MÃ³dulos (Gitflow)

Para evitar cualquier conflicto de integraciÃ³n, cada desarrollador es responsable exclusivo de su carpeta:

| Desarrollador | Rol / MÃ³dulo Asignado | Carpeta Exclusiva en el Repositorio | Rama de Trabajo |
|---|---|---|---|
| **Dev 1 (Lead)** | Arquitectura Base, Backend, Core, Layout, Auth | `sobracero-backend/`, `sobracero-frontend/src/app/core/`, `layout/`, `auth/` | `main` y `develop` |
| **Dev 2** | Landing pÃºblica, Impacto pÃºblico y PÃ¡gina 404 | `sobracero-frontend/src/app/features/landing/` | `feature/parte-2-landing` |
| **Dev 3** | Consumidor (Ofertas cercanas, Mapa, Pago y Reservas) | `sobracero-frontend/src/app/features/consumidor/` | `feature/parte-3-consumidor` |
| **Dev 4** | Comercio (Publicar oferta, Canjear cÃ³digo, Donaciones) | `sobracero-frontend/src/app/features/comercio/` | `feature/parte-4-comercio` |
| **Dev 5** | OrganizaciÃ³n Social (Donaciones, Recojos, Ley 30498) | `sobracero-frontend/src/app/features/organizacion/` | `feature/parte-5-organizacion` |
| **Dev 6** | AdministraciÃ³n e Impacto (Validaciones, Reporte CSV, PredicciÃ³n) | `sobracero-frontend/src/app/features/admin/`, `impacto/` | `feature/parte-6-admin-impacto` |

---

## ðŸ“ EstÃ¡ndar de Commits (Conventional Commits)

Todos los commits deben cumplir con la especificaciÃ³n de **Conventional Commits**:

### Sintaxis Requerida:
```text
<tipo>(<alcance>): <descripciÃ³n concisa en minÃºsculas>
```

### Tipos Permitidos:
| Tipo | CuÃ¡ndo Usarlo | Ejemplo |
|---|---|---|
| `feat` | Nueva funcionalidad o mÃ³dulo para el usuario | `feat(consumidor): implementar mapa de ofertas cercanas (US06-US10)` |
| `fix` | CorrecciÃ³n de un fallo o error | `fix(auth): corregir guardado del token JWT en localStorage` |
| `chore` | Tareas de configuraciÃ³n inicial o estructura | `chore(init): inicializar monorepo, arquitectura base y ambiente local (Dev 1)` |
| `docs` | Modificaciones Ãºnicamente en documentaciÃ³n | `docs(readme): agregar instrucciones de inicio local y credenciales` |
| `style` | Cambios de formato o estilos SCSS (sin alterar lÃ³gica) | `style(layout): ajustar espaciado responsive del navbar` |
| `refactor` | ReestructuraciÃ³n de cÃ³digo sin agregar features ni corregir bugs | `refactor(ofertas): simplificar cÃ¡lculo de porcentaje de ahorro` |

---

## ðŸ”„ Flujo Paso a Paso para Desarrolladores (Dev 2 al Dev 6)

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
3. **Reemplazar la carpeta de su mÃ³dulo:**
   Copiar los archivos de su entrega dentro de:  
   `sobracero-frontend/src/app/features/<tu-modulo>/` (reemplazando la pantalla provisional ðŸš§).
4. **Instalar dependencias y verificar compilaciÃ³n local:**
   ```bash
   cd sobracero-frontend
   npm install
   npm run build
   ```
5. **Hacer commit siguiendo la convenciÃ³n:**
   ```bash
   git add src/app/features/<tu-modulo>
   git commit -m "feat(<modulo>): implementacion completa de historias asignadas"
   git push -u origin feature/parte-N-<nombre-modulo>
   ```
6. **Abrir Pull Request en GitHub:**
   - Rama base: **`develop`** â† Rama comparada: **`feature/parte-N-...`**
   - Completar el checklist de la plantilla de PR.
   - Solicitar revisiÃ³n al Dev 1.

---

## ðŸ’» EjecuciÃ³n en Local (Ambiente de Pruebas)

### 1. Backend (`sobracero-backend`)
* Requiere Java 21+ instalado.
* **OpciÃ³n A (Recomendada - Modo Embebido sin instalar base de datos externa):**
  ```bash
  cd sobracero-backend
  ./mvnw test-compile "exec:java" "-Dexec.mainClass=pe.upc.sobracero.LocalEmbeddedApplication" "-Dexec.classpathScope=test"
  ```
* **OpciÃ³n B (Con PostgreSQL local en localhost:5432):**
  ```bash
  cd sobracero-backend
  ./mvnw spring-boot:run
  ```
* **DocumentaciÃ³n interactiva (Swagger UI):**  
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
*(Consume automÃ¡ticamente el backend local en `http://localhost:8080`)*.

---

## ðŸ”‘ Credenciales Demo para Pruebas Locales

* **Consumidor:** `consumidor@demo.pe` | Clave: `Demo1234`
* **Comercio:** `comercio1@demo.pe` | Clave: `Demo1234`
* **OrganizaciÃ³n Social:** `ong1@demo.pe` | Clave: `Demo1234`
* **Administrador:** `admin@sobracero.pe` | Clave: `Admin1234`