import { Alert, Stack, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { AgGridReact } from "ag-grid-react";
import Papa from "papaparse";
import { useCallback, useState } from "react";
import { FileUpload } from "~/components/file-upload";
import { CSVRowData, CSVSchema, csvSchema } from "~/models/csv-file-schema";
import { formatColData, formatRowData } from "~/utlils/format-data";
import { formatPapaparseErrors, formatZodErrors } from "~/utlils/format-errors";

export default function MainPage() {
  const [colDefs, setColDefs] = useState<Record<string, string | boolean>[]>(null);
  const [rowData, setRowData] = useState<Record<string, string>[]>(null);
  const [parseError, setParseError] = useState<string>(null);

  const handleUpload = (file: File) => {
    Papa.parse<CSVSchema>(file, {
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setParseError(formatPapaparseErrors(results.errors));
          return;
        }

        const parsedData = csvSchema.safeParse(results.data);

        if (!parsedData.success) {
          setParseError(formatZodErrors<CSVSchema>(parsedData.error));
          return;
        }

        console.log(parsedData.data);

        setColDefs(formatColData(parsedData.data[0]));
        setRowData(formatRowData(parsedData.data.slice(1) as CSVRowData[]));
      },
      error: (error) => {
        setParseError(error.message);
      },
    });
  };

  const onCellValueChanged = useCallback((event) => {
    setRowData((prevData) => {
      return prevData.map((row, i) => (i === event.rowIndex ? { ...row, ...event.data } : row));
    });
  }, []);

  return (
    <Stack align="center" mt="xl">
      <Title order={2} mb="md">
        Upload your claims data
      </Title>
      {parseError && (
        <Alert icon={<IconInfoCircle />} variant="filled" color="red" title="Unable to parse CSV file">
          {parseError}
        </Alert>
      )}
      <FileUpload onUpload={handleUpload} fileType="text/csv" />
      {colDefs && rowData && (
        <div className="ag-theme-quartz mx-8 w-[85vw] h-[650px]">
          <AgGridReact onCellValueChanged={onCellValueChanged} rowData={rowData} columnDefs={colDefs} pagination />
        </div>
      )}
    </Stack>
  );
}
