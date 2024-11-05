import { z } from "zod";

export const getCsvInputSchema = (fileType: string) =>
  z
    .custom<File>()
    .refine((file) => !!file, "File is required")
    .refine((file) => file?.type === fileType, `File type must be csv`);

const providersSchema = z.record(z.unknown()).and(
  z.object({
    billed_charge: z.number(),
    npi: z.array(z.number()),
  }),
);

const paymentsSchema = z.record(z.unknown()).and(
  z.object({
    allowed_amount: z.number(),
    billing_code_modifier: z.array(z.string()).optional(),
    providers: z.array(providersSchema),
  }),
);

const tinSchema = z.object({
  type: z.union([z.literal("ein"), z.literal("npi")]),
  value: z.string(),
});

const allowedAmountsSchema = z.object({
  tin: tinSchema,
  service_code: z.array(z.string().regex(/^(0[1-9]|[1-9][0-9])$/)).optional(),
  billing_class: z.union([z.literal("professional"), z.literal("institutional")]),
  payments: z.array(paymentsSchema),
});

const outOfNetworkSchema = z.object({
  name: z.string(),
  billing_code_type: z.union([
    z.literal("CPT"),
    z.literal("NDC"),
    z.literal("HCPCS"),
    z.literal("RC"),
    z.literal("ICD"),
    z.literal("MS-DRG"),
    z.literal("R-DRG"),
    z.literal("S-DRG"),
    z.literal("APS-DRG"),
    z.literal("AP-DRG"),
    z.literal("APR-DRG"),
    z.literal("APC"),
    z.literal("LOCAL"),
    z.literal("EAPG"),
    z.literal("HIPPS"),
    z.literal("CDT"),
  ]),
  billing_code: z.string(),
  billing_code_type_version: z.string(),
  description: z.string(),
  allowed_amounts: z.array(allowedAmountsSchema),
});

// I created this type because I initially thought that the sample data would be in this format.
export const allowedAmountSchema = z.array(
  z.object({
    reporting_entity_name: z.string(),
    reporting_entity_type: z.string(),
    plan_name: z.string().optional(),
    plan_id_type: z.union([z.literal("EIN"), z.literal("HIOS")]).optional(),
    plan_id: z.string().optional(),
    plan_market_type: z.union([z.literal("group"), z.literal("individual")]).optional(),
    out_of_network: z.array(outOfNetworkSchema),
    last_updated_on: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/),
    version: z.string(),
  }),
);

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
