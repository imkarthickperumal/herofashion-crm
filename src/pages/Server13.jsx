import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ✅ Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

// ✅ AG Grid Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const DynamicAgGrid = forwardRef(({ rowData, searchTerm = "" }, ref) => {
  const gridRef = useRef(null);
  const gridApiRef = useRef(null);
  const columnApiRef = useRef(null);
  const [columnFilters, setColumnFilters] = useState({});

  const escapeRegExp = (str = "") =>
    String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const onFilterChanged = useCallback(() => {
    if (!gridApiRef.current) return;
    const model = gridApiRef.current.getFilterModel();
    const newFilters = {};
    Object.keys(model).forEach((key) => {
      const entry = model[key];
      if (!entry) return;
      newFilters[key] = entry.filter ?? entry.values ?? "";
    });
    setColumnFilters(newFilters);
  }, []);

  const renderHighlighted = (value, field) => {
    const text = value == null ? "" : String(value);
    const colFilterRaw = columnFilters[field] ?? "";
    const globalRaw = searchTerm ?? "";

    if (!colFilterRaw && !globalRaw) return text;

    const patterns = [];
    if (colFilterRaw) patterns.push(colFilterRaw);
    if (globalRaw && globalRaw.toLowerCase() !== colFilterRaw.toLowerCase())
      patterns.push(globalRaw);

    const sorted = patterns
      .map((p) => escapeRegExp(p))
      .sort((a, b) => b.length - a.length);
    const regex = new RegExp(`(${sorted.join("|")})`, "gi");

    const colLower = colFilterRaw.toLowerCase();
    const globalLower = globalRaw.toLowerCase();

    return text.split(regex).map((part, i) => {
      if (!part) return null;
      if (colFilterRaw && part.toLowerCase() === colLower) {
        return (
          <span key={i} className="bg-red-200 text-red-800 px-1 rounded">
            {part}
          </span>
        );
      }
      if (
        globalRaw &&
        part.toLowerCase() === globalLower &&
        part.toLowerCase() !== colLower
      ) {
        return (
          <span key={i} className="bg-green-200 text-green-800 px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
    columnApiRef.current = params.columnApi;
  }, []);

  // ✅ Excel Export
  const exportExcel = useCallback(() => {
    if (!gridApiRef.current) return;
    const rowDataExport = [];
    gridApiRef.current.forEachNode((node) => rowDataExport.push(node.data));
    if (rowDataExport.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(rowDataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      "Export.xlsx"
    );
  }, []);

  // ✅ PDF Export
  const exportPDF = useCallback(() => {
    if (!gridApiRef.current || !columnApiRef.current) return;

    const doc = new jsPDF();
    const columns = columnApiRef.current
      .getAllDisplayedColumns()
      .map((col) => ({
        header: col.getColDef().headerName,
        dataKey: col.getColId(),
      }));

    const rows = [];
    gridApiRef.current.forEachNode((node) => {
      const row = {};
      columns.forEach((col) => {
        let val = node.data[col.dataKey];
        row[col.dataKey] = val !== undefined && val !== null ? String(val) : "";
      });
      rows.push(row);
    });

    if (rows.length === 0) return;

    doc.text("AG Grid Export", 14, 15);
    doc.autoTable({
      columns,
      body: rows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save("Export.pdf");
  }, []);

  useImperativeHandle(ref, () => ({
    exportExcel,
    exportPDF,
  }));

  // ✅ Normalize API path (remove ONLY leading double backslashes)
  const normalizePath = (path) => {
    if (!path) return "";
    return path.replace(/^\\\\/, "\\"); // "\\\\Adminserver..." -> "\\Adminserver..."
  };

  // ✅ Convert UNC path to URL for public/export
  const toImageUrl = (path) => {
    if (!path) return "";
    const cleanedPath = normalizePath(path);
    const file = cleanedPath.split("\\").pop(); // e.g. 12865.jpg
    return `/export/${file}`;
  };

  const handleImageClick = (rawPath) => {
    const cleaned = normalizePath(rawPath);
    console.log("Original API Path:", rawPath);
    console.log("Cleaned Path:", cleaned);

    // ⚡️ Try to open the folder in a new tab (file://)
    const folder = cleaned.substring(0, cleaned.lastIndexOf("\\"));
    const fileUrl = `file:///${folder.replace(/\\/g, "/")}`;
    window.open(fileUrl, "_blank");
  };

  const columnDefs = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];
    return Object.keys(rowData[0]).map((key) => {
      if (key === "mainimagepath") {
        return {
          headerName: "Image",
          field: key,
          cellRenderer: (params) => {
            const cleanedPath = normalizePath(params.value);
            const url = toImageUrl(cleanedPath);
            return url ? (
              <img
                src={url}
                alt="order"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: 4,
                }}
                onClick={() => handleImageClick(params.value)}
                title="Click to open folder"
              />
            ) : (
              ""
            );
          },
          minWidth: 120,
        };
      }
      return {
        headerName: key.replace(/_/g, " ").toUpperCase(),
        field: key,
        filter: "agTextColumnFilter",
        floatingFilter: true,
        cellRenderer: (params) => renderHighlighted(params.value ?? "", key),
      };
    });
  }, [rowData, JSON.stringify(columnFilters), searchTerm]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 150,
      floatingFilter: true,
    }),
    []
  );

  return (
    <div className="p-0 w-full">
      <div className="ag-theme-alpine w-full">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination
          domLayout="autoHeight"
          animateRows
          rowHeight={80}
          headerHeight={40}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
        />
      </div>
    </div>
  );
});

export default DynamicAgGrid;
