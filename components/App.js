import { MyTable } from './Table.js';
import { columns } from '../config/columnsConfig.js';
import { fetchData } from '../utils/fetchData.js';

export function App() {
  // Create wrapper
  const container = document.createElement("div");
  const search = document.createElement("input");
  search.id = "search";
  search.placeholder = "Search...";

  const resetBtn = document.createElement("button");
  resetBtn.id = "reset-filters";
  resetBtn.textContent = "Reset Filters";

  const tableContainer = document.createElement("section");
  tableContainer.id = "table-container";

  const tableHeader = document.createElement("div");
  tableHeader.id = "table-header";
  tableHeader.className = "header-row";

  const tableBody = document.createElement("div");
  tableBody.id = "table-body";

  tableContainer.appendChild(tableHeader);
  tableContainer.appendChild(tableBody);

  container.appendChild(search);
  container.appendChild(resetBtn);
  container.appendChild(tableContainer);
  document.body.appendChild(container);


  // Dynamically calculate column widths based on total columns
  const columnWidth = 100 / columns.length; // divide 100% equally between all columns

  MyTable({
    columns,
    searchInput: search,
    resetButton: resetBtn,
    headerContainer: tableHeader,
    bodyContainer: tableBody,
    fetchCallback: fetchData,
    
  });
}
