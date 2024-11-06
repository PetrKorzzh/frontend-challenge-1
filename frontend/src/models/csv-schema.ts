import { z } from "zod";

export const getCsvInputSchema = (fileType: string) =>
  z
    .custom<File>()
    .refine((file) => !!file, "File is required")
    .refine((file) => file?.type === fileType, `File type must be csv`);

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const csvColsDefSchema = z.array(z.string());
export const csvRowDataSchema = z.tuple([
  z.coerce.number(),
  z.string(),
  z.coerce.number(),
  z.string(),
  ...Array(3).fill(z.coerce.number()),
  ...Array(6).fill(z.string().regex(dateRegex)),
  ...Array(11).fill(z.string()),
  z.coerce.number(),
  z.string(),
]);

export const csvSchema = z.tuple([csvColsDefSchema]).rest(csvRowDataSchema);

export type CSVColsDef = z.infer<typeof csvColsDefSchema>;
export type CSVRowData = z.infer<typeof csvRowDataSchema>;
export type CSVSchema = z.infer<typeof csvSchema>;
