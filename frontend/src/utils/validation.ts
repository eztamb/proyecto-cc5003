export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Formatea el RUT (ej: 123456789 -> 12.345.678-9)
export const formatRut = (rut: string): string => {
  if (!rut) return "";
  // Limpiar todo lo que no sea números o k
  const value = rut.replace(/[^0-9kK]/g, "");

  if (value.length > 1) {
    const dv = value.slice(-1);
    const body = value.slice(0, -1);
    let formattedBody = "";

    for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) formattedBody = "." + formattedBody;
      formattedBody = body[i] + formattedBody;
    }
    return `${formattedBody}-${dv}`;
  }
  return value;
};

// Valida el dígito verificador del RUT
export const validateRut = (rut: string): boolean => {
  if (!rut) return false;
  const cleanRut = rut.replace(/[^0-9kK]/g, "");

  if (cleanRut.length < 8) return false;

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDv = 11 - (sum % 11);
  const calculatedDv = expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : expectedDv.toString();

  return dv === calculatedDv;
};
