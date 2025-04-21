import { renderCell } from './CellRenderer.js';
import { debounce } from '../utils/debounce.js';
import { throttle } from '../utils/throttle.js';

export function MyTable({ columns, searchInput, resetButton, headerContainer, bodyContainer, fetchCallback }) {
  let allData = [];
  let offset = 0;
  const limit = 100;
  let isFetching = false;
  let sortKey = null;
  let sortOrder = 1;
  let filteredData=[]
  
  const rowHeight=40  //40px per row based on my css 
  const buffer=5      //extra row above and below

  //creating div for spacer
  const spacerTop=document.createElement("div");
  const spacerBottom=document.createElement("div");

  spacerTop.style.height="0px";
  spacerBottom.style.height="0px";

  bodyContainer.innerHTML="";

  //apending to body container
  bodyContainer.appendChild(spacerTop);
  bodyContainer.appendChild(spacerBottom);



  function createHeader() {
// creating dynamic column 

// const gridColumns = `repeat(${columns.length}, 1fr)`; // Dynamically calculate column widths
// headerContainer.style.display = "grid";
// headerContainer.style.gridTemplateColumns = gridColumns; // Apply grid template dynamically

  const columnWidths = columns.map(col => `minmax(150px, ${col.width || '1fr'})`).join(' '); // Use minmax for responsive columns

  headerContainer.style.display = "grid";
  headerContainer.style.gridTemplateColumns = columnWidths; // Apply column widths dynamically

  headerContainer.innerHTML="";


    columns.forEach(col => {
      const cell = document.createElement("div");
      cell.className = "column";
      cell.textContent = col.label;

      if (col.sortable) {
        cell.classList.add("sortable");

// adding arrow for direction
        const arrow=document.createElement("span")
        arrow.className="sort-arrow"
        arrow.textContent=sortKey===col.key ? (sortOrder ===1 ? '⬆' : '⬇') : '   ↕' ;

        cell.appendChild(arrow)


        cell.addEventListener("click", () => {

        // toggle sort direction

          sortKey = col.key;
          sortOrder = sortKey===col.key && sortOrder=== 1? -1 : 1
          
        // rerendering to update arrow
          createHeader()


          renderVirtualRows();
        });
      }
      headerContainer.appendChild(cell);
    });
  }

  async function loadData() {
    if (isFetching) return;
    isFetching = true;

    const newData = await fetchCallback(offset, limit);
    allData = [...allData, ...newData];
    filteredData = allData;
    offset += limit;
    renderVirtualRows();

    isFetching = false;
  }


  function applyFilter(){
    const q=searchInput.value.toLowerCase();
    filteredData=allData.filter(row=>columns.some(col=>col.filterable && String(row[col.key]?? "").toLowerCase().includes(q)
  )
);
  }


  function renderVirtualRows() {
    let dataToRender = filteredData;

    if (sortKey) {
      const col = columns.find(c => c.key === sortKey);
      dataToRender = [...dataToRender].sort((a, b) => {
        const valA = a[sortKey] ?? col.defaultValue;
        const valB = b[sortKey] ?? col.defaultValue;
        if (typeof valA === "number") return (valA - valB) * sortOrder;
        return String(valA).localeCompare(String(valB)) * sortOrder;
      });
    }

    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const visibleCount = Math.ceil(viewportHeight / rowHeight);

    const totalCount = dataToRender.length;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const endIndex = Math.min(totalCount, startIndex + visibleCount + buffer * 2);

    // Clear previous visible rows (keep spacers)
    [...bodyContainer.querySelectorAll('.row')].forEach(el => el.remove());

    // Adjust spacer heights
    spacerTop.style.height = `${startIndex * rowHeight}px`;
    spacerBottom.style.height = `${(totalCount - endIndex) * rowHeight}px`;

    const columnWidths = columns
      .map(col => `minmax(150px, ${col.width || '1fr'})`)
      .join(' ');

    dataToRender.slice(startIndex, endIndex).forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
      rowDiv.style.display = "grid";
      rowDiv.style.gridTemplateColumns = columnWidths;
      rowDiv.style.height = `${rowHeight}px`;

      columns.forEach(col => {
        const cell = document.createElement("div");
        cell.className = "column";
        
        const content = renderCell(col.key, row[col.key], col.defaultValue);
        // for bg
        cell.textContent=content
        cell.setAttribute("data-label", content); // ← for styling
        rowDiv.appendChild(cell);
      });

      bodyContainer.insertBefore(rowDiv, spacerBottom);
    });
  }

  // function renderTable(filtered = allData) {
  //   bodyContainer.innerHTML = "";

  //   const columnWidths = columns
  //   .map(col => `minmax(150px, ${col.width || '1fr'})`) // Use the same logic as header
  //   .join(' ');


  //   if (sortKey) {
  //     const col = columns.find(c => c.key === sortKey);
  //     filtered.sort((a, b) => {
  //       let valA = a[sortKey] ?? col.defaultValue;
  //       let valB = b[sortKey] ?? col.defaultValue;
  //       if (typeof valA === "number") return (valA - valB) * sortOrder;
  //       return String(valA).localeCompare(String(valB)) * sortOrder;
  //     });
  //   }

  //   if (filtered.length === 0) {
  //     const noData = document.createElement("div");
  //     noData.className = "row";
  //     noData.textContent = "No data matched.";
  //     bodyContainer.appendChild(noData);
  //     return;
  //   }

  //   filtered.forEach(row => {
  //     const rowDiv = document.createElement("div");
  //     rowDiv.className = "row";

  //     rowDiv.style.display = "grid";
  //     rowDiv.style.gridTemplateColumns = columnWidths; // Apply consistent grid widths

  //     columns.forEach(col => {
  //       const cell = document.createElement("div");
  //       cell.className = "column";

  //       cell.textContent = row[col.key] ?? ""; // Handle empty values

  //       cell.textContent = renderCell(col.key, row[col.key], col.defaultValue);
  //       rowDiv.appendChild(cell);
  //     });

  //     bodyContainer.appendChild(rowDiv);
  //   });
  // }

  const handleSearch = debounce(() => {
    applyFilter();
    renderVirtualRows();
  }, 300);

  const handleInfiniteScroll = throttle(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      loadData();
    }
  }, 200);

  const handleVirtualScroll = throttle(() => {
    renderVirtualRows();
  }, 100);


  searchInput.addEventListener("input", handleSearch);

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    applyFilter();
    renderVirtualRows();
    });

  window.addEventListener("scroll", ()=>{
    handleInfiniteScroll();
    handleVirtualScroll();

  });

  createHeader();
  loadData();
}
