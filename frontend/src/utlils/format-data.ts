import { mapFieldName } from "~/config/constants";
import { CSVColsDef, CSVRowData } from "~/models/csv-file-schema";

export function formatRowData(rowData: CSVRowData[]): Record<string, string>[] {
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
