interface PackageManifest {
  name: string;
  version?: string;
  description?: string;
  homepage?: string;
}

const packageJsonModules = import.meta.glob("../../../../packages/*/package.json", {
  eager: true,
  import: "default",
}) as Record<string, PackageManifest>;

function folderNameFromPath(path: string) {
  const match = path.match(/packages\/([^/]+)\//);
  return match?.[1] ?? null;
}

export function getPackages() {
  return Object.entries(packageJsonModules).map(([path, pkg]) => {
    const folder = folderNameFromPath(path);
    return {
      folder,
      ...pkg,
    };
  });
}
