import React, { useMemo, useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const DynamicAgGrid = ({
  rowData,
  searchTerm = "" /* global search (green) */,
}) => {
  const gridRef = useRef(null);
  const [columnFilters, setColumnFilters] = useState({}); // { columnField: "typedText" }

  // Helper: escape user input for regex
  const escapeRegExp = (str = "") =>
    String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Called when any column filter changes (floating filter or full filter)
  const onFilterChanged = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    const model = api.getFilterModel(); // ag grid filter model
    const newFilters = {};
    Object.keys(model).forEach((colKey) => {
      // For text filters model[colKey].filter holds the input value
      const entry = model[colKey];
      if (!entry) return;
      // different filter types have different shapes; prefer `.filter` if exists
      const val = entry.filter ?? entry.values ?? "";
      newFilters[colKey] = val;
    });
    setColumnFilters(newFilters);
  }, []);

  // Highlight logic: columnFilter (red) takes precedence, then global search (green)
  const renderHighlighted = (value, field) => {
    const text = value == null ? "" : String(value);
    const colFilterRaw = columnFilters[field] ?? "";
    const globalRaw = searchTerm ?? "";

    const colFilter = colFilterRaw.toString();
    const globalFilter = globalRaw.toString();

    if (!colFilter && !globalFilter) return text;

    // Prepare unique patterns; column filter first (higher priority)
    const patterns = [];
    if (colFilter) patterns.push(colFilter);
    if (globalFilter && globalFilter.toLowerCase() !== colFilter.toLowerCase())
      patterns.push(globalFilter);

    // sort by length desc to match longer substrings first (prevents partial split issues)
    const sorted = patterns
      .map((p) => escapeRegExp(p))
      .sort((a, b) => b.length - a.length);

    // build regex with capture to split (case-insensitive)
    const regex = new RegExp(`(${sorted.join("|")})`, "gi");

    const parts = text.split(regex); // split keeps matches in the array
    if (!parts || parts.length === 0) return text;

    const colLower = colFilter.toLowerCase();
    const globalLower = globalFilter.toLowerCase();

    return parts.map((part, i) => {
      if (!part) return null;
      if (colFilter && part.toLowerCase() === colLower) {
        // column filter match -> RED
        return (
          <span key={i} className="bg-green-200 text-green-800 px-1 rounded">
            {part}
          </span>
        );
      }
      if (
        globalFilter &&
        part.toLowerCase() === globalLower &&
        // If both equal we already handled via only having colFilter in patterns
        part.toLowerCase() !== colLower
      ) {
        // global filter match -> GREEN
        return (
          <span key={i} className="bg-green-200 text-green-800 px-1 rounded">
            {part}
          </span>
        );
      }
      // normal text
      return <span key={i}>{part}</span>;
    });
  };

  // Column defs that use the renderHighlighted function
  const columnDefs = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];
    return Object.keys(rowData[0]).map((key) => ({
      headerName: key.replace(/_/g, " ").toUpperCase(),
      field: key,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      // cellRenderer can return JSX nodes (ag-grid-react supports this)
      cellRenderer: (params) => renderHighlighted(params.value ?? "", key),
    }));
    // include columnFilters and searchTerm so columns update their renderers
  }, [rowData, JSON.stringify(columnFilters), searchTerm]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      flex: 1,
      minWidth: 180,
      floatingFilter: true,
      headerClass:
        "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold text-sm uppercase tracking-wide py-4",
      cellClass:
        "text-gray-700 dark:text-gray-200 text-sm px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200",
    }),
    []
  );

  return (
    <div className="p-4 w-full">
      <div className="overflow-x-auto">
        <div className="w-full rounded-2xl shadow overflow-hidden">
          <div className="ag-theme-alpine w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              domLayout="autoHeight"
              animateRows
              rowHeight={48}
              headerHeight={40}
              onFilterChanged={onFilterChanged}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicAgGrid;
