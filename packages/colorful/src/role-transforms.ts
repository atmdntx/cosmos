import type Color from "colorjs.io";
import type { RoleTransform } from "./types";
import { clamp } from "./utils";

/**
 * Aplica las transformaciones de rol (hue/lightness/chroma) sobre un color base
 * en espacio OKLCH. Operar en la instancia muta el color original.
 */
export function applyRoleTransform(base: Color, role: RoleTransform): Color {
  const { hue, lightness, chroma } = role;
  if (lightness) base.set("oklch.l", (l) => solvePropertyTransform(l, role, "lightness"));
  if (chroma) base.set("oklch.c", (c) => solvePropertyTransform(c, role, "chroma"));
  if (hue) base.set("oklch.h", (h) => solvePropertyTransform(h, role, "hue"));
  return base;
}

/**
 * Resuelve cómo transformar una propiedad individual (hue, lightness o chroma)
 * según el tipo de transformación (set, shift, delta o factor).
 */
export function solvePropertyTransform(
  n: number,
  role: RoleTransform,
  prop: keyof RoleTransform,
): number {
  const transform = role[prop];
  if (!transform) return n;

  if (prop === "hue") {
    switch (transform.type) {
      case "set":
        return solveShift(transform.value, 360);
      case "factor":
        return solveShift(solveFactor(n, transform.value), 360);
      case "shift":
      case "delta":
      default:
        return solveShift(n + transform.value, 360);
    }
  }

  if (prop === "lightness") {
    switch (transform.type) {
      case "set":
        return clamp(transform.value, 0, 1);
      case "factor":
        return clamp(solveFactor(n, transform.value), 0, 1);
      case "shift":
      case "delta":
      default:
        return clamp(n + transform.value, 0, 1);
    }
  }

  if (prop === "chroma") {
    switch (transform.type) {
      case "set":
        return Math.max(transform.value, 0);
      case "factor":
        return Math.max(solveFactor(n, transform.value), 0);
      case "shift":
      case "delta":
      default:
        return Math.max(n + transform.value, 0);
    }
  }
  return n;
}

/** Normaliza un valor circular (p.ej. matiz) dentro del rango `[0, max)` */
function solveShift(n: number, max: number) {
  const value = n % max;
  return value < 0 ? value + max : value;
}

/** Aplica un factor multiplicativo básico. Se separa por legibilidad/testeo. */
function solveFactor(n: number, f: number) {
  return n * f;
}
