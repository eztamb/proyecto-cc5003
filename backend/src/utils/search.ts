// helper para escapar caracteres especiales de Regex
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// helper para crear patrón insensible a acentos
export const createAccentRegex = (text: string) => {
  const escaped = escapeRegExp(text);
  return escaped
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      switch (lower) {
        case "a":
        case "á":
          return "[aá]";
        case "e":
        case "é":
          return "[eé]";
        case "i":
        case "í":
          return "[ií]";
        case "o":
        case "ó":
          return "[oó]";
        case "u":
        case "ú":
          return "[uú]";
        default:
          return char;
      }
    })
    .join("");
};
