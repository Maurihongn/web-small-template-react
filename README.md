# 📘 Frontend Architecture (SPA / Lightweight)

> **Tipo:** Single Page Application (Lightweight)
> **Stack:** React 19 + Vite + TypeScript
> **Arquitectura:** Feature-Based Architecture (Strict)

Este documento define los estándares para proyectos ágiles en la organización. Aunque la estructura es simplificada respecto al Monolito Modular, **las reglas de calidad de código, tipado y gestión de estado son obligatorias**.

---

## 🏁 START HERE: Setup Checklist (Haz esto primero)

Antes de escribir una sola línea de código, completa estos pasos obligatorios:

1.  **Environment Variables:**
    Copia el archivo de ejemplo y configura tus variables locales.
    
    cp .env.example .env

2.  **Limpieza de TODOs:**
    Busca globalmente la cadena `// TODO:` en tu editor (`Ctrl + Shift + F`). Hemos dejado marcadores en lugares críticos que debes actualizar:
    -   `package.json`: Nombre y versión del proyecto.
    -   `index.html`: Título de la pestaña y meta tags.
    -   `src/shared/lib/axios-client.ts`: Configuración de la Base URL.
    -   `src/app/routes.tsx`: Rutas iniciales.

3.  **Instalación:**
    
    pnpm install
    pnpm dev

---

## 🛠 Tech Stack (Non-Negotiable)

- **Core:** React 19, Vite, TypeScript (Strict Mode).
- **Routing:** React Router v7.
- **UI/Estilos:** TailwindCSS, Shadcn/UI.
- **Estado Servidor:** TanStack Query (v5) - _Obligatorio para cualquier llamada a API._
- **Estado Global:** Zustand - _Exclusivo para sesión o configuración de UI global._
- **Formularios:** React Hook Form + Zod.
- **HTTP:** Axios (Instancia configurada en `@/shared/lib`).
- **Iconos:** `lucide-react`.

---

## 🏗 Arquitectura: Feature-Based

No agrupamos por tipo de archivo (no queremos una carpeta gigante de `components` o `hooks` mezclados). Agrupamos por **Funcionalidad (Feature)**.

### Estructura de Directorios

src/
├── app/                  # 🧠 CONFIGURACIÓN GLOBAL (El "Chasis")
│   ├── routes.tsx        # Router Principal (Lazy Loading)
│   ├── providers/        # QueryClient, AuthProvider, Toaster
│   ├── stores/           # Stores Globales (auth.store.ts, ui.store.ts)
│   └── main.tsx          # Punto de entrada
│
├── features/             # 📦 FUNCIONALIDADES (Flat Structure)
│   ├── auth/             # Feature: Autenticación
│   │   ├── components/   # UI específica (LoginForm.tsx)
│   │   ├── hooks/        # Lógica de negocio (useLogin.ts)
│   │   ├── api/          # Endpoints (auth.service.ts)
│   │   └── views/        # Páginas completas (LoginPage.tsx)
│   │
│   └── dashboard/        # Feature: Panel Principal
│       ├── components/   # (StatsCard.tsx, ChartWidget.tsx)
│       └── views/        # (DashboardPage.tsx)
│
└── shared/               # 🧱 REUTILIZABLE (Agnóstico al negocio)
    ├── components/       # UI Kit (Button, Input, Layouts, Modal)
    ├── hooks/            # Hooks genéricos (useDebounce, useScreen)
    ├── lib/              # Configuraciones (axios, utils, cn)
    ├── assets/           # Imágenes y fuentes estáticas
    └── types/            # Tipos compartidos globalmente

### Reglas de Organización

1.  **Feature Isolation:** Todo lo relacionado con una funcionalidad vive junto en `src/features/{nombre}`.
2.  **Smart vs Dumb:**
    - **Views (`/views`):** Páginas que orquestan la carga de datos y el layout. **No contienen lógica compleja (usar hooks).**
    - **Components (`/components`):** Piezas de UI que reciben props.
3.  **Dependencias:**
    - ✅ Una feature puede importar de `@/shared`.
    - ⚠️ Una feature **NO** debería importar directamente componentes de otra feature hermana (alto acoplamiento). Si algo se usa en dos lados, muévelo a `@/shared`.

---

## 🛡️ Code Standards & Best Practices

### A. Gestión de Estado (Data Fetching)
⛔ **PROHIBIDO:** Usar `useEffect` para llamar a la API.
✅ **OBLIGATORIO:** Usar TanStack Query (`useQuery`, `useMutation`).

**Ejemplo Incorrecto:**

    // ❌ Mal: useEffect manual y estados sueltos
    useEffect(() => {
      axios.get('/api/users').then(res => setUsers(res.data));
    }, []);

**Ejemplo Correcto:**

    // ✅ Bien: Custom Hook con React Query
    // en features/users/hooks/useUsers.ts
    export const useUsers = () => {
      return useQuery({
        queryKey: ['users'],
        queryFn: getUsers // importado de ../api/users.service.ts
      });
    };

### B. Formularios
⛔ **PROHIBIDO:** Usar `useState` para manejar campos de input uno por uno.
✅ **OBLIGATORIO:** Usar `react-hook-form` controlado por esquemas de `zod`.

### C. Nomenclatura (Naming Convention)
Respetar los sufijos ayuda a identificar el rol del archivo inmediatamente.

- **Páginas:** `PascalCase` + `Page` → `LoginPage.tsx`
- **Componentes:** `PascalCase` → `UserCard.tsx`
- **Hooks:** `camelCase` + `use` → `useProfile.ts`
- **Servicios:** `camelCase` + `.api` → `products.service.ts`
- **Schemas:** `camelCase` + `.schema` → `login.schema.ts`

---

## 🚀 GitFlow Simplificado (Small Team)

Para este proyecto utilizamos un flujo simplificado basado en Features.

**Formato de ramas:** `tipo/TICKET-descripcion-breve`
- `feat/LAND-10-contact-form`
- `fix/LAND-11-fix-mobile-menu`

**Flujo de Trabajo:**
1.  Crear rama desde `main`.
2.  Desarrollar la funcionalidad.
3.  Abrir Pull Request (PR) hacia `main`.
4.  Code Review (Aprobación obligatoria).
5.  Squash Merge a `main`.

---

## 🤝 Getting Started

1.  **Instalar dependencias:**
    
    pnpm install

2.  **Configurar Entorno:**
    Copiar `.env.example` a `.env` y configurar variables.
    
    cp .env.example .env

3.  **Correr en Desarrollo:**
    
    pnpm dev

---

> **Nota del Arquitecto:** Mantener el orden en `src/features` es vital. Si una carpeta de feature crece demasiado, considera dividirla o refactorizar, pero nunca mezcles lógica de negocio en `src/shared`.