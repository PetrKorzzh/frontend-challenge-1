import { z } from "zod";
import Papa from "papaparse";

export function formatZodErrors<T>(error: z.ZodError<T>) {
  return error.format()._errors.reduce((acc, error, i) => acc + (i === 0 ? "" : ", ") + error, "");
}

export function formatPapaparseErrors(errors: Papa.ParseError[]) {
  return errors.reduce((acc, error, i) => acc + (i === 0 ? "" : ", ") + error, "");
}
