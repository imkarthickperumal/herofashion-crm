import { useEffect, useMemo, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { getOrder } from "../utils/api";

const OrdersPage = ({ globalFilter, onAddNew, onExportExcel, onExportPDF }) => {
  const [data, setData] = useState([]);
  const [setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({});
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const fetchDataOld = async () => {
    try {
      const result = await getOrder();
      console.log("API Data", result);

      if (Array.isArray(result) && result.length > 0) {
        setData(result);
      } else {
        // console.warn("🚨 Unexpected API data:", result.data);
        setData([]); // fallback
      }
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const result = await getOrder(); // this returns {source, data}
      console.log("API Data", result);

      if (result && Array.isArray(result.data) && result.data.length > 0) {
        setData(result.data); // ✅ correct place
      } else {
        setData([]); // fallback
      }
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "o_Orderno",
        header: "Order No",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "Date",
        header: "Date",
        enableColumnFilter: true,
        filterFn: "text",
      },

      {
        accessorKey: "o_ordqty",
        header: "Order No Qty",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "uom",
        header: "uom",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "fdeldt",
        header: "fdeldt",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "o_Buyer",
        header: "o_Buyer",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "o_merch",
        header: "o_merch",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "o_StyleDesc",
        header: "o_StyleDesc",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "o_filnam",
        header: "Image",
        cell: ({ row }) => {
          const imgUrl = row.original.o_filnam;
          return (
            <img
              src={imgUrl}
              alt="Main"
              className="h-14 w-14 object-cover rounded border"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/200/300";
              }}
            />
          );
        },
      },

      // {
      //   id: "actions",
      //   header: "Actions",
      //   cell: ({ row }) => {
      //     const rowData = row.original;
      //     return (
      //       <button
      //         className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
      //         onClick={() => {
      //           setEditRowIndex(row.index);
      //           setNewRow({ ...rowData });
      //           setShowModal(true);
      //         }}
      //       >
      //         ✏️ Edit
      //       </button>
      //     );
      //   },
      // },
    ],
    []
  );

  // ✅ Global filter across ALL columns
  const globalFilterFn = (row, _columnId, filterValue) => {
    if (!filterValue) return true;
    return row.getAllCells().some((cell) =>
      String(cell.getValue() || "")
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  };

  // Highlight matching text in green

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
      pagination: {
        pageSize: data.length,
        pageIndex: 0,
      },
    },
    globalFilterFn, // ✅ now applies to all columns
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      text: (row, columnId, filterValue) => {
        const value = row.getValue(columnId);
        return String(value || "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
  });

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;

    // Escape regex special chars
    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSearch})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span
          key={index}
          className="bg-green-200 text-green-700 font-bold px-0.5 rounded"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // ✅ Handle arrow key movement
  const handleKeyDown = (e) => {
    if (!selectedCell) return;

    const rows = table.getRowModel().rows;
    const rowIndex = rows.findIndex((r) => r.id === selectedCell.rowId);
    const colIndex = rows[0]
      ?.getVisibleCells()
      .findIndex((c) => c.column.id === selectedCell.colId);

    if (rowIndex === -1 || colIndex === -1) return;

    let newRow = rowIndex;
    let newCol = colIndex;

    switch (e.key) {
      case "ArrowUp":
        newRow = Math.max(0, rowIndex - 1);
        break;
      case "ArrowDown":
        newRow = Math.min(rows.length - 1, rowIndex + 1);
        break;
      case "ArrowLeft":
        newCol = Math.max(0, colIndex - 1);
        break;
      case "ArrowRight":
        newCol = Math.min(rows[0].getVisibleCells().length - 1, colIndex + 1);
        break;
      default:
        return; // ignore other keys
    }

    const newRowObj = rows[newRow];
    const newColObj = newRowObj.getVisibleCells()[newCol];

    setSelectedCell({
      rowId: newRowObj.id,
      colId: newColObj.column.id,
    });

    e.preventDefault(); // stop page scrolling
  };

  // ✅ Attach keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell, table]);

  // ✅ stable filtered data
  const filteredData = useMemo(() => {
    return table.getFilteredRowModel().rows.map((row) =>
      row.getVisibleCells().reduce((acc, cell) => {
        acc[cell.column.id] = cell.getValue();
        return acc;
      }, {})
    );
  }, [table.getFilteredRowModel().rows]);

  // Handlers
  const handleAddNew = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleExportExcel = useCallback((rows) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "OrderDelivery");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "order_delivery.xlsx");
  }, []);

  const handleExportPDF = useCallback(
    (rows) => {
      const doc = new jsPDF();
      doc.text("OrderDelivery", 14, 10);
      autoTable(doc, {
        head: [columns.map((col) => col.header)],
        body: rows.map((row) => columns.map((col) => row[col.accessorKey])),
        startY: 20,
        styles: { fontSize: 8 },
      });
      doc.save("order_delivery.pdf");
    },
    [columns]
  );

  // ✅ Only pass function references, not immediate calls
  useEffect(() => {
    // onAddNew(() => handleAddNew());
    // onAddNew(handleAddNew);
    onExportExcel(() => () => handleExportExcel(filteredData));
    onExportPDF(() => () => handleExportPDF(filteredData));
  }, [
    // onAddNew,
    onExportExcel,
    onExportPDF,
    // handleAddNew,
    handleExportExcel,
    handleExportPDF,
    filteredData,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-1 mt-2 rounded-2xl">
      <div className="max-w-10xl mx-auto">
        {error && (
          <h6 className="text-center text-red-600 font-bold m-3">
            {" "}
            API Response {error}
          </h6>
        )}

        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-1xl p-1">
          {loading ? (
            <SkeletonTable columnCount={columns.length} rowCount={6} />
          ) : (
            <>
              {/* 🧾 Table */}
              <div className="w-full overflow-x-auto rounded-lg border border-gray-200 transition-opacity duration-500">
                <table className="min-w-[1000px] w-full text-sm text-gray-800">
                  <thead className="bg-gray-100 text-xs uppercase">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-3 text-left border-b whitespace-nowrap"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}

                    {/* Filter row */}
                    <tr>
                      {table.getHeaderGroups()[0].headers.map((header) => (
                        <th key={header.id} className="px-2 py-2 border-b">
                          {header.column.getCanFilter() ? (
                            <input
                              type="text"
                              value={
                                table
                                  .getState()
                                  .columnFilters.find(
                                    (f) => f.id === header.column.id
                                  )?.value || ""
                              }
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              } // ✅ string only
                              onKeyDown={(e) => {
                                if (e.key === "Enter") e.preventDefault(); // stop submit/reload
                              }}
                              placeholder={`Search ${header.column.columnDef.header}`}
                              className="w-full border rounded px-2 py-1 text-xs"
                            />
                          ) : null}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-all duration-200 bg-white hover:bg-blue-50"
                      >
                        {row.getVisibleCells().map((cell) => {
                          const colId = cell.column.id;
                          const isSelected =
                            selectedCell?.rowId === row.id &&
                            selectedCell?.colId === colId;

                          // 🔑 Current filter value for highlighting
                          const columnFilterValue =
                            table
                              .getState()
                              .columnFilters.find((f) => f.id === colId)
                              ?.value || "";

                          return (
                            <td
                              key={cell.id}
                              className={`px-4 py-3 border-t whitespace-nowrap cursor-pointer ${
                                isSelected
                                  ? "bg-yellow-300 border-2 border-[#7cb547]"
                                  : ""
                              }`}
                              onClick={() =>
                                setSelectedCell({
                                  rowId: row.id,
                                  colId: colId,
                                })
                              }
                            >
                              {colId === "MainImagePath" ? (
                                // ✅ Show image for image column
                                <img
                                  src={cell.getValue()}
                                  alt="Main"
                                  className="h-14 w-14 object-cover rounded border"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://picsum.photos/200/300";
                                  }}
                                />
                              ) : (
                                // ✅ Show highlighted text for all other columns
                                highlightText(
                                  String(cell.getValue() ?? ""),
                                  columnFilterValue || globalFilter
                                )
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="pageSize" className="text-sm text-gray-600">
                    Rows per page:
                  </label>
                  <select
                    id="pageSize"
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="border-gray-300 text-sm rounded px-2 py-1"
                  >
                    {[10, 25, 50, 100, data.length].map((size) => (
                      <option key={size} value={size}>
                        {size === data.length ? "All" : size}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-sm text-gray-600">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()} —{" "}
                  <strong>{table.getFilteredRowModel().rows.length}</strong>{" "}
                  rows
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative bg-white p-6 rounded-lg w-[90%] max-w-3xl shadow-lg space-y-4 overflow-y-auto max-h-[80vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">➕ Add New Order</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {columns.map((col) => {
                if (!col.accessorKey || col.id === "actions") return null;
                return (
                  <div key={col.accessorKey}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {col.header}
                    </label>
                    <input
                      type="text"
                      value={newRow[col.accessorKey] || ""}
                      onChange={(e) =>
                        setNewRow((prev) => ({
                          ...prev,
                          [col.accessorKey]: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editRowIndex !== null) {
                    const updated = [...data];
                    updated[editRowIndex] = newRow;
                    setData(updated);
                  } else {
                    setData((prev) => [newRow, ...prev]);
                  }
                  setShowModal(false);
                  setNewRow({});
                  setEditRowIndex(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                {editRowIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;

const SkeletonTable = ({ columnCount = 10, rowCount = 5 }) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-[1000px] w-full text-sm text-gray-800">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            {Array.from({ length: columnCount }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left border-b">
                <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-t">
              {Array.from({ length: columnCount }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
