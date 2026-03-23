import Color from "colorjs.io";
import KEYWORDS from "./colors";

const keywordEntries = Object.entries(KEYWORDS).map(([name, value]) => ({
  name,
  color: new Color(value),
}));

/**
 * Devuelve el nombre de color CSS más cercano para un color dado.
 * Usa la tabla de `colorjs.io` y calcula la distancia euclidiana en sRGB.
 */
export function findColorName(inputColor: Color) {
  const target = inputColor instanceof Color ? inputColor : new Color(inputColor);
  let closestName: string | undefined;
  let minDistance = Infinity;

  for (const entry of keywordEntries) {
    const distance = entry.color.distance(target);
    if (distance < minDistance) {
      minDistance = distance;
      closestName = entry.name;
    }
  }

  return closestName;
}
