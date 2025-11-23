import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
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
