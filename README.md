# Cosmos Monorepo

Repositorio central para experimentar con el ecosistema Cosmos: aplicaciones, librerias y utilidades construidas sobre Vite+, TypeScript. La primera iteracion incluye una app de demostracion mas dos paquetes orientados al color, pero el repositorio crecera con nuevas herramientas en futuras versiones. Todo el codigo se coordina mediante el CLI `vp`, asi que no es necesario ejecutar pnpm, npm o yarn directamente.

## Que incluye

- `apps/colorful-palettes`: playground donde se visualizan paletas y tokens generados en tiempo real.
- `packages/colorful` (`@cosmos/colorful`): utilidades de paletas que normalizan colores, calculan tonos compatibles con Tailwind y entregan helpers tipados.
- `packages/themes` (`@cosmos/themes`): generador de tokens que construye variables CSS y salidas para Tailwind usando las paletas de `@cosmos/colorful`.
- Nuevos paquetes y apps se iran sumando para cubrir mas casos de diseño, documentacion y otras experiencias digitales.

## Requisitos

- Node.js >= 22.12.0
- `vp` instalado globalmente (Vite+). Revisa `vp --version` si tienes dudas.

## Primeros pasos

```bash
vp install          # instala dependencias en todo el workspace
vp run ready        # formato, lint, pruebas y builds recursivos
```

## Tareas principales

- Desarrollo local: `vp dev` levanta el sitio de muestras definido en `apps/colorful-palettes`.
- Lint/format/typecheck: `vp check` ejecuta Oxlint, Oxfmt y TypeScript.
- Pruebas unitarias: `vp test` usa Vitest incluido en Vite+.
- Empaquetado: `vp pack` genera la carpeta `dist` de cada paquete.
- Scripts personalizados: utiliza `vp run <script>` si el nombre coincide con un comando reservado (por ejemplo `vp run dev:api`).

## Flujo sugerido

1. Clonar el repo y ejecutar `vp env use` si necesitas alinear la version de Node.
2. Correr `vp install` al inicio de cada sesion para mantener dependencias sincronizadas.
3. Desarrollar en la app o en los paquetes segun corresponda.
4. Validar con `vp check` y `vp test` antes de abrir un PR o publicar paquetes.

## Paquetes actuales

- `@cosmos/colorful`: expone `colorfulPaletteCreator`, `COLOR_SCHEMES`, `memoColor` y tipos auxiliares. Ideal para crear nuevos flujos de color o integrarse con Tailwind.
- `@cosmos/themes`: consume las paletas de Colorful para generar strings CSS (`cssString`), bloques compatibles con Tailwind (`tailwindString`) y accesores directos a cada paleta.

Estos paquetes comparten configuracion de build basada en `vp pack`. Se agregarán mas modulos a medida que evolucionen los casos de uso del monorepo.

## Calidad y versionado

- Ejecuta `vp check && vp test` antes de fusionar cambios.
- Usa `vp pack` para validar los bundles consumibles.
- El versionado se maneja con `bumpp` (ver scripts en cada `package.json`).

## Contacto

Si encuentras problemas o tienes ideas nuevas, abre un issue en `https://github.com/atmdntx/cosmos/issues` o crea un PR directo en este repositorio.
