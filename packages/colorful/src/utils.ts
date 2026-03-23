import type { TailwindColorNames, TailwindColors } from "./types";

/**
 * Restringe un valor numérico para que nunca salga del rango indicado.
 * De manera predeterminada usa el rango inclusivo entre 0 y 100.
 */
export function clamp(n: number, min = 0, max = 100) {
  return n >= max ? max : n <= min ? min : n;
}

/**
 * Realiza una interpolación lineal entre `from` y `to` usando `n` como factor
 * normalizado (limitado automáticamente entre 0 y 1).
 */
export function lerp(n: number, from: number, to: number) {
  return from + (to - from) * clamp(n, 0, 1);
}

/**
 * Reúne los colores de Tailwind indicados en `keys`. Actualmente el helper
 * devuelve el arreglo `keys` para que el llamador pueda iterar la lista.
 */
export function pickColors<K extends TailwindColorNames>(source: TailwindColors, keys: K[]) {
  const result = {} as Pick<TailwindColors, K>;
  keys.forEach((key) => {
    result[key] = source[key];
  });
  return result;
}

/**
 * Busca dinámicamente una propiedad en un objeto plano y devuelve el valor si
 * la llave proporcionada existe.
 */
export function getElementByKey<T extends object>(key: string, obj: T): T[keyof T] | undefined {
  return key in obj ? obj[key as keyof T] : undefined;
}
