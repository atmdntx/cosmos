import Color from "colorjs.io";
import KEYWORDS from "colorjs.io/src/keywords.js";

/**
 * Devuelve el nombre de color CSS más cercano para un color dado.
 * Usa la tabla de `colorjs.io` y calcula la distancia euclidiana en sRGB.
 */
export function findColorName(inputColor: Color) {
  const nearestNamedColor = nearest(KEYWORDS);
  return nearestNamedColor(inputColor);
}

/**
 * Prepara una función para buscar colores cercanos dentro del diccionario recibido.
 * @param colors Diccionario de nombres -> valores CSS soportados por `colorjs.io`.
 */
function nearest(colors: typeof KEYWORDS) {
  const arr = Object.entries(colors).map(([name, color], index) => ({
    color: new Color("srgb", color),
    name,
    i: index,
    d: 0,
  }));
  // Retorna un closure que calcula los n colores más cercanos bajo un umbral τ.
  return (targetColor: Color, n = 1, τ = Infinity) => {
    if (isFinite(n)) {
      n = Math.max(1, Math.min(n, arr.length - 1));
    }
    arr.forEach((c) => {
      c.d = c.color.distance(new Color(targetColor));
    });
    return arr
      .sort((a, b) => a.d - b.d)
      .slice(0, n)
      .filter((c) => c.d < τ)[0]?.name;
  };
}
