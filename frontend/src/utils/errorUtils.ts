import axios from "axios";

export const getErrorMessage = (error: unknown): string => { // error is unknown type because. Its safer as it can be anything. Asuming a type may lead to runtime errors.
  if (axios.isAxiosError(error) && error.response?.data?.error) {
    return typeof error.response.data.error === "string"
      ? error.response.data.error
      : "Ocurrió un error inesperado";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Error desconocido";
};
