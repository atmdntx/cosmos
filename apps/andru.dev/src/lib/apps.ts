interface AppManifest {
  name: string;
  version?: string;
  description?: string;
  homepage?: string;
}

const packageJsonModules = import.meta.glob("../../../*/package.json", {
  eager: true,
  import: "default",
}) as Record<string, AppManifest>;

function folderNameFromPath(path: string) {
  const resolved = new URL(path, import.meta.url).pathname;
  const segments = resolved.split("/").filter(Boolean);
  return segments.length >= 2 ? segments[segments.length - 2] : null;
}

function normalizeName(name?: string, fallback?: string | null) {
  const base = name ?? fallback ?? "";
  if (!base) return "";
  return base
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

const CURRENT_APP_FOLDER = "andru.dev";

interface AppEntry {
  path: string;
  app: AppManifest;
  folder: string | null;
}

function shouldIncludeApp({ folder, app }: AppEntry) {
  if (!folder) return false;
  if (folder === CURRENT_APP_FOLDER) return false;
  if (app.name === CURRENT_APP_FOLDER) return false;
  return true;
}

export function getApps() {
  return Object.entries(packageJsonModules)
    .map<AppEntry>(([path, app]) => ({
      path,
      app,
      folder: folderNameFromPath(path),
    }))
    .filter(shouldIncludeApp)
    .map(({ folder, app }) => {
      const normalizedName = normalizeName(app.name, folder);
      return {
        folder,
        ...app,
        name: normalizedName,
      };
    });
}
