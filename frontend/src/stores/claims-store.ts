// store/ClaimStore.ts
import { makeAutoObservable } from "mobx";
import Papa from "papaparse";
import { Claim } from "~/models/claims-data-type";
import { CSVRowData, CSVSchema, csvSchema } from "~/models/csv-schema";
import { formatColData, formatRowData } from "~/utlils/format-data";
import { formatPapaparseErrors, formatZodErrors } from "~/utlils/format-errors";

class ClaimStore {
  colDefs: Record<string, string | boolean>[] = null;
  rowData: Claim[] = null;
  parseError: string = null;
  file: File = null;

  constructor() {
    makeAutoObservable(this);
  }

  setFile = (file: File) => {
    this.file = file;
  }

  setColDefs = (colDefs: Record<string, string | boolean>[]) => {
    this.colDefs = colDefs;
  };

  setRowData = (rowData: Claim[]) => {
    this.rowData = rowData;
  };

  setParseError = (error: string) => {
    this.parseError = error;
  };

  handleUpload = (file: File) => {
    Papa.parse<CSVSchema>(file, {
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          this.setParseError(formatPapaparseErrors(results.errors));
          return;
        }

        const parsedData = csvSchema.safeParse(results.data);

        if (!parsedData.success) {
          this.setParseError(formatZodErrors<CSVSchema>(parsedData.error));
          return;
        }

        this.setFile(file);
        this.setColDefs(formatColData(parsedData.data[0]));
        this.setRowData(formatRowData(parsedData.data.slice(1) as CSVRowData[]));
      },
      error: (error) => {
        this.setParseError(error.message);
      },
    });
  };

  updateRowData = (event) => {
    this.rowData[event.index] = event.data;
  };

}

export const claimStore = new ClaimStore();
