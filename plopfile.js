import fs from "fs";
import path from "path";

export default function (plop) {
  // ✅ 1. VALIDATORS & HELPERS
  // --------------------------------------------------------------------------

  const requireInput = (input) => {
    if (!input || input.trim().length === 0) {
      return "❌ El nombre es obligatorio.";
    }
    return true;
  };

  // Obtiene subcarpetas de una ruta dada (Genérico)
  const getSubfolders = (sourcePath) => {
    const fullPath = path.join(process.cwd(), sourcePath);
    // Si la ruta no existe (ej: no hay carpeta providers), devolvemos array vacío
    if (!fs.existsSync(fullPath)) return [];

    return fs
      .readdirSync(fullPath)
      .filter((file) => fs.statSync(path.join(fullPath, file)).isDirectory());
  };

  // Helper inteligente para listar Features según arquitectura
  const getFeaturesList = (architecture, moduleName) => {
    let featuresPath = "";
    if (architecture === "modular") {
      featuresPath = `src/modules/${moduleName}/features`;
    } else {
      featuresPath = `src/features`;
    }

    const features = getSubfolders(featuresPath);

    if (features.length === 0) {
      return [{ name: "❌ No hay features creadas aún.", value: "__ABORT__" }];
    }
    return features;
  };

  // ✅ 2. COMMON PROMPTS
  // --------------------------------------------------------------------------

  // Pregunta central para decidir la ruta
  const promptArchitecture = {
    type: "list",
    name: "architecture",
    message: "¿Qué arquitectura aplica para este elemento?",
    choices: [
      { name: "🏠 Flat (src/features) - Proyectos Chicos", value: "flat" },
      {
        name: "🏢 Modular (src/modules) - Proyectos Grandes",
        value: "modular",
      },
    ],
    // Auto-detectar: Si existe src/modules, sugerir modular por defecto
    default: fs.existsSync(path.join(process.cwd(), "src/modules")) ? 1 : 0,
  };

  const promptTargetModule = {
    type: "list",
    name: "moduleName",
    message: "Selecciona el Módulo:",
    choices: () => getSubfolders("src/modules"),
    when: (a) => a.architecture === "modular", // Solo si eligió Modular
  };

  // ✅ 3. GENERATORS
  // --------------------------------------------------------------------------

  // ➤ GENERADOR: FEATURE
  plop.setGenerator("feature", {
    description: "Crea una nueva Feature (Flat o Modular)",
    prompts: [
      promptArchitecture,
      // Si es Modular, preguntamos módulo (o crear uno nuevo)
      {
        type: "list",
        name: "targetModule",
        message: "¿En qué módulo vivirá esta feature?",
        when: (a) => a.architecture === "modular",
        choices: () => [
          { name: "✨ CREAR NUEVO MÓDULO", value: "__NEW__" },
          new plop.inquirer.Separator(),
          ...getSubfolders("src/modules"),
        ],
      },
      {
        type: "input",
        name: "newModuleName",
        message: "Nombre del NUEVO Módulo:",
        when: (a) => a.targetModule === "__NEW__",
        validate: requireInput,
      },
      // Nombre de la Feature (Siempre se pide)
      {
        type: "input",
        name: "featureName",
        message: "Nombre de la Feature:",
        validate: requireInput,
      },
    ],
    actions: (data) => {
      const actions = [];
      let basePath = "";
      let moduleName = "";

      // Lógica de Rutas
      if (data.architecture === "modular") {
        moduleName =
          data.targetModule === "__NEW__"
            ? data.newModuleName
            : data.targetModule;

        // Si es nuevo módulo, creamos su route y api definition
        if (data.targetModule === "__NEW__") {
          // Guardamos el nombre para el template
          data.moduleName = moduleName;
          actions.push({
            type: "add",
            path: `src/modules/{{kebabCase moduleName}}/routes.tsx`,
            templateFile: "plop-templates/module/routes.hbs",
          });
        }
        basePath = `src/modules/${moduleName}/features/{{kebabCase featureName}}`;
      } else {
        // Flat Architecture
        basePath = `src/features/{{kebabCase featureName}}`;
      }

      // Guardamos moduleName en data por si el template lo necesita (será "" si es flat)
      data.moduleName = moduleName;

      console.log(`🚀 Creando feature en: ${basePath}`);

      actions.push(
        {
          type: "add",
          path: `${basePath}/pages/{{pascalCase featureName}}Page.tsx`, // Carpeta pages, sufijo Page
          templateFile: "plop-templates/feature/page.hbs", // Renombraremos el template también
        },
        {
          type: "add",
          path: `${basePath}/hooks/use{{pascalCase featureName}}.ts`,
          templateFile: "plop-templates/feature/hook.hbs",
        },
        {
          type: "add",
          path: `${basePath}/api/{{kebabCase featureName}}.service.ts`,
          templateFile: "plop-templates/feature/service.hbs",
        },
        {
          type: "add",
          path: `${basePath}/index.ts`,
          templateFile: "plop-templates/feature/index.hbs",
        },
        { type: "add", path: `${basePath}/components/.gitkeep`, template: "" },
        { type: "add", path: `${basePath}/types/.gitkeep`, template: "" },
        { type: "add", path: `${basePath}/schemas/.gitkeep`, template: "" }
      );

      return actions;
    },
  });

  // ➤ GENERADOR: COMPONENT
  plop.setGenerator("component", {
    description: "Crea un Componente UI",
    prompts: [
      {
        type: "list",
        name: "scope",
        message: "¿Dónde va este componente?",
        choices: [
          { name: "🌍 SHARED (Global)", value: "shared" },
          { name: "📦 FEATURE (Privado)", value: "feature" },
        ],
      },
      // Si es Feature, necesitamos saber la arquitectura y (quizás) el módulo
      { ...promptArchitecture, when: (a) => a.scope === "feature" },
      {
        ...promptTargetModule,
        when: (a) => a.scope === "feature" && a.architecture === "modular",
      },

      // Seleccionar Feature
      {
        type: "list",
        name: "featureName",
        message: "Selecciona la Feature:",
        when: (a) => a.scope === "feature",
        choices: (a) => getFeaturesList(a.architecture, a.moduleName),
      },

      // Seleccionar Subcarpeta (Shared o Feature/Components)
      {
        type: "list",
        name: "subfolder",
        message: "¿En qué carpeta lo guardamos?",
        when: (a) => a.featureName !== "__ABORT__",
        choices: (a) => {
          let searchPath = "";
          if (a.scope === "shared") {
            searchPath = "src/shared/components";
          } else {
            // Construimos la ruta base según arquitectura para buscar carpetas existentes
            searchPath =
              a.architecture === "modular"
                ? `src/modules/${a.moduleName}/features/${a.featureName}/components`
                : `src/features/${a.featureName}/components`;
          }

          return [
            { name: "📂 Raíz (components/)", value: "__ROOT__" },
            { name: "✨ NUEVA CARPETA", value: "__NEW__" },
            new plop.inquirer.Separator(),
            ...getSubfolders(searchPath),
          ];
        },
      },
      {
        type: "input",
        name: "newSubfolderName",
        message: "Nombre de la carpeta:",
        when: (a) => a.subfolder === "__NEW__",
        validate: requireInput,
      },
      {
        type: "input",
        name: "name",
        message: "Nombre del Componente (PascalCase):",
        when: (a) => a.featureName !== "__ABORT__",
        validate: requireInput,
      },
    ],
    actions: (data) => {
      if (data.featureName === "__ABORT__") return [];

      let basePath = "";
      if (data.scope === "shared") {
        basePath = "src/shared/components";
      } else if (data.architecture === "modular") {
        basePath = `src/modules/${data.moduleName}/features/${data.featureName}/components`;
      } else {
        basePath = `src/features/${data.featureName}/components`;
      }

      // Manejo de subcarpeta
      if (data.subfolder === "__NEW__") basePath += `/${data.newSubfolderName}`;
      else if (data.subfolder !== "__ROOT__") basePath += `/${data.subfolder}`;

      return [
        {
          type: "add",
          path: `${basePath}/{{pascalCase name}}.tsx`,
          templateFile: "plop-templates/component/component.hbs",
        },
      ];
    },
  });

  // ➤ GENERADOR: CONTEXT
  plop.setGenerator("context", {
    description: "Crea un Contexto y su Provider",
    prompts: [
      {
        type: "list",
        name: "scope",
        message: "¿Alcance del Contexto?",
        choices: [
          { name: "🌍 SHARED (Global)", value: "shared" },
          { name: "📦 FEATURE (Privado)", value: "feature" },
        ],
      },
      // Feature Path Logic
      { ...promptArchitecture, when: (a) => a.scope === "feature" },
      {
        ...promptTargetModule,
        when: (a) => a.scope === "feature" && a.architecture === "modular",
      },
      {
        type: "list",
        name: "featureName",
        message: "Selecciona la Feature:",
        when: (a) => a.scope === "feature",
        choices: (a) => getFeaturesList(a.architecture, a.moduleName),
      },
      // Shared Path Logic (Providers folder)
      {
        type: "list",
        name: "providerSubfolder",
        message: '¿Dónde en "src/app/providers"?',
        when: (a) => a.scope === "shared",
        choices: () => [
          { name: "📂 Raíz (providers/)", value: "__ROOT__" },
          { name: "✨ NUEVA CARPETA", value: "__NEW__" },
          new plop.inquirer.Separator(),
          ...getSubfolders("src/app/providers"),
        ],
      },
      {
        type: "input",
        name: "newProviderFolder",
        message: "Nombre carpeta:",
        when: (a) => a.providerSubfolder === "__NEW__",
        validate: requireInput,
      },
      {
        type: "input",
        name: "name",
        message: "Nombre del Contexto (kebab-case):",
        when: (a) => a.featureName !== "__ABORT__",
        validate: requireInput,
      },
    ],
    actions: (data) => {
      if (data.featureName === "__ABORT__") return [];
      const actions = [];

      // Variable booleana para los templates
      data.isShared = data.scope === "shared";

      if (data.scope === "shared") {
        // --- SHARED ---
        actions.push({
          type: "add",
          path: "src/shared/context/{{kebabCase name}}.tsx",
          templateFile: "plop-templates/context/context.hbs",
        });

        let providerPath = "src/app/providers";
        if (data.providerSubfolder === "__NEW__")
          providerPath += `/${data.newProviderFolder}`;
        else if (data.providerSubfolder !== "__ROOT__")
          providerPath += `/${data.providerSubfolder}`;

        actions.push({
          type: "add",
          path: `${providerPath}/{{pascalCase name}}Provider.tsx`,
          templateFile: "plop-templates/context/provider.hbs",
        });
      } else {
        // --- FEATURE (Modular o Flat) ---
        let basePath = "";
        if (data.architecture === "modular") {
          basePath = `src/modules/${data.moduleName}/features/${data.featureName}`;
        } else {
          basePath = `src/features/${data.featureName}`;
        }

        actions.push(
          {
            type: "add",
            path: `${basePath}/context/{{kebabCase name}}.tsx`,
            templateFile: "plop-templates/context/context.hbs",
          },
          {
            type: "add",
            path: `${basePath}/providers/{{pascalCase name}}Provider.tsx`,
            templateFile: "plop-templates/context/provider.hbs",
          }
        );
      }
      return actions;
    },
  });

  // ➤ GENERADOR: SOCKET
  plop.setGenerator("socket", {
    description: "Crea un Socket SignalR (Hook + Context)",
    prompts: [
      {
        type: "list",
        name: "scope",
        message: "¿Alcance del Socket?",
        choices: [
          { name: "🌍 SHARED (System)", value: "shared" },
          { name: "📦 FEATURE (Específico)", value: "feature" },
        ],
      },
      // Feature Logic
      { ...promptArchitecture, when: (a) => a.scope === "feature" },
      {
        ...promptTargetModule,
        when: (a) => a.scope === "feature" && a.architecture === "modular",
      },
      {
        type: "list",
        name: "featureName",
        message: "Selecciona la Feature:",
        when: (a) => a.scope === "feature",
        choices: (a) => getFeaturesList(a.architecture, a.moduleName),
      },
      // Shared Provider Logic
      {
        type: "list",
        name: "providerSubfolder",
        message: "¿Dónde guardamos el Provider global?",
        when: (a) => a.scope === "shared",
        choices: () => [
          { name: "📂 Raíz (providers/)", value: "__ROOT__" },
          ...getSubfolders("src/app/providers"),
        ],
      },
      {
        type: "input",
        name: "name",
        message: "Nombre del Socket (ej: notification):",
        when: (a) => a.featureName !== "__ABORT__",
        validate: requireInput,
      },
    ],
    actions: (data) => {
      if (data.featureName === "__ABORT__") return [];
      const actions = [];
      data.isShared = data.scope === "shared";

      if (data.scope === "shared") {
        // Shared: Sockets van a src/shared/sockets/{name}
        actions.push(
          {
            type: "add",
            path: "src/shared/sockets/{{kebabCase name}}/{{kebabCase name}}.socket.ts",
            templateFile: "plop-templates/socket/socket.hbs",
          },
          {
            type: "add",
            path: "src/shared/sockets/{{kebabCase name}}/{{kebabCase name}}.context.tsx",
            templateFile: "plop-templates/socket/context.hbs",
          }
        );

        let providerPath = "src/app/providers";
        if (data.providerSubfolder !== "__ROOT__")
          providerPath += `/${data.providerSubfolder}`;

        actions.push({
          type: "add",
          path: `${providerPath}/{{pascalCase name}}SocketProvider.tsx`,
          templateFile: "plop-templates/socket/provider.hbs",
        });
      } else {
        // Feature: Sockets van a feature/sockets/{name}
        let basePath = "";
        if (data.architecture === "modular") {
          basePath = `src/modules/${data.moduleName}/features/${data.featureName}`;
        } else {
          basePath = `src/features/${data.featureName}`;
        }

        actions.push(
          {
            type: "add",
            path: `${basePath}/sockets/{{kebabCase name}}/{{kebabCase name}}.socket.ts`,
            templateFile: "plop-templates/socket/socket.hbs",
          },
          {
            type: "add",
            path: `${basePath}/sockets/{{kebabCase name}}/{{kebabCase name}}.context.tsx`,
            templateFile: "plop-templates/socket/context.hbs",
          },
          {
            type: "add",
            path: `${basePath}/providers/{{pascalCase name}}SocketProvider.tsx`,
            templateFile: "plop-templates/socket/provider.hbs",
          }
        );
      }
      return actions;
    },
  });
}
