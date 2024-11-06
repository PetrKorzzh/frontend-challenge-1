import { mapFieldName } from "~/config/constants";
import { Claim } from "~/models/claims-data-type";
import { CSVColsDef, CSVRowData } from "~/models/csv-schema";

export function formatRowData(rowData: CSVRowData[]): Claim[] {
  const fieldNames = Object.values(mapFieldName);
  const result = [];

  rowData.forEach((row) => {
    const element = fieldNames.reduce((acc, field, i) => ({ ...acc, [field]: row[i] }), {});
    result.push(element);
  });

  return result;
}

export function formatColData(colDefs: CSVColsDef): Record<string, string | boolean>[] {
  return colDefs.map((col) => ({ field: mapFieldName[col], editable: true }));
}
