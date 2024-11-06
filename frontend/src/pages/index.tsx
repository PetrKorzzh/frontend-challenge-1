import { Alert, Stack, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { AgGridReact } from "ag-grid-react";
import { observer } from "mobx-react-lite";
import { FileUpload } from "~/components/file-upload";
import { claimStore } from "~/stores/claims-store";

const MainPage = observer(() => {
  return (
    <Stack align="center" mt="xl">
      <Title order={2} mb="md">
        Upload your claims data
      </Title>
      {claimStore.parseError && (
        <Alert icon={<IconInfoCircle />} variant="filled" color="red" title="Unable to parse CSV file">
          {claimStore.parseError}
        </Alert>
      )}
      <FileUpload onUpload={claimStore.handleUpload} fileType="text/csv" />
      {claimStore.colDefs && claimStore.rowData && (
        <div className="ag-theme-quartz mx-8 w-[85vw] h-[650px]">
          <AgGridReact onCellValueChanged={claimStore.updateRowData} rowData={claimStore.rowData} columnDefs={claimStore.colDefs} pagination />
        </div>
      )}
    </Stack>
  );
});

export default MainPage;
