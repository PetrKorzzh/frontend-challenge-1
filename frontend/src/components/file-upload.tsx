import { Button, FileInput, Stack } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { getCsvInputSchema } from "~/models/csv-schema";
import { claimStore } from "~/stores/claims-store";
import { formatZodErrors } from "~/utlils/format-errors";

export const FileUpload = observer(({ onUpload, fileType }: { onUpload: (file: File) => void; fileType: string }) => {
  const [value, setValue] = useState<File | null>(null);
  const [fieldError, setFieldError] = useState<string>(null);

  const handleOnChange = (file: File) => {
    setValue(file);
    setFieldError(null);
    claimStore.setColDefs(null);
    claimStore.setRowData(null);
    claimStore.setParseError(null);
  };

  const handleFileUpload = () => {
    const parsedFile = getCsvInputSchema(fileType).safeParse(value);

    if (!parsedFile.success) {
      setFieldError(formatZodErrors<File>(parsedFile.error));
      return;
    }

    onUpload(parsedFile.data);
  };

  return (
    <Stack w={350}>
      <FileInput placeholder="Upload claims CSV" accept=".csv" value={value} onChange={handleOnChange} error={fieldError} />
      <Button onClick={() => handleFileUpload()}>Upload CSV</Button>
    </Stack>
  );
});
