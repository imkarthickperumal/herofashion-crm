import React, { useEffect, useMemo, useState } from "react";
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
import { getOrders } from "../utils/api";
import { Input } from "../components/ui/input";
import { io } from "socket.io-client";

const socket = io(
  window.location.hostname === "localhost"
    ? "http://localhost:8001"
    : "https://herofashion.onrender.com",
  {
    transports: ["websocket"],
  }
);

const generateDummyData = (count = 350) => {
  const statuses = [
    "Pending",
    "Completed",
    "In Progress",
    "Shipped",
    "Processing",
  ];
  const yesNo = ["Yes", "No"];
  const merchNames = [
    "John",
    "Jane",
    "Michael",
    "David",
    "Emily",
    "Sophia",
    "Daniel",
    "Olivia",
    "William",
    "Isabella",
  ];

  return Array.from({ length: count }, (_, i) => {
    const randomStatus = () =>
      statuses[Math.floor(Math.random() * statuses.length)];
    const randomYesNo = () => yesNo[Math.floor(Math.random() * yesNo.length)];
    const randomMerch = () =>
      merchNames[Math.floor(Math.random() * merchNames.length)];
    const randomYear = () => 2024 + Math.floor(Math.random() * 3); // 2024-2026
    const randomDate = () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2026, 11, 31);
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      )
        .toISOString()
        .split("T")[0];
    };

    return {
      OrderNo: `DUMMY${String(i + 1).padStart(3, "0")}`,
      Finalyeardel: randomYear(),
      Finaldel: randomDate(),
      MainImagePath: `https://picsum.photos/200?random=${i + 1}`,
      "Delivery 2": randomStatus(),
      "Cutting 5": randomStatus(),
      "Fabric 8": randomStatus(),
      "Dyeing 14": randomStatus(),
      Rib18: randomYesNo(),
      "Merch 50": randomMerch(),
      43: `43-${String.fromCharCode(65 + (i % 26))}`, // A-Z
      "Organic 46": randomYesNo(),
      90: `Check${i + 1}`,
      "CONTRACT CUTTING 99": randomStatus(),
      "DY ST 119": randomStatus(),
    };
  });
};

const dummyData = generateDummyData(350);

const Home = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRow, setNewRow] = useState({});
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const result = await getOrders();
      console.log("API Data", result.data);

      if (Array.isArray(result?.data) && result.data.length > 0) {
        setData(result.data);
        // setData(dummyData);
      } else {
        // console.warn("🚨 Unexpected API data:", result.data);
        setData([]); // fallback
        // setData(dummyData);
        // setData(dummyData);
      }
    } catch (err) {
      console.error("❌ Failed to fetch data:", err);
      setError("Failed to load data");
      // setData([]); // fallback to avoid crash
      setData(dummyData);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial data load
  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Listen for live updates from backend
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from socket");
    });

    socket.on("ordersUpdated", () => {
      console.log("🔁 Orders updated - fetching new data...");
      fetchData();
    });

    return () => {
      socket.off("ordersUpdated");
      socket.off("connect");
      socket.off("disconnect");
      // socket.disconnect();
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "OrderNo",
        header: "Order No",
        cell: (info) => info.getValue(),
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "Finalyeardel",
        header: "Delivery Year",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "Finaldel",
        header: "Delivery Date",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "MainImagePath",
        header: "Main Image",
        cell: ({ getValue }) => {
          const imgUrl = getValue() || "https://picsum.photos/200/300";
          return (
            <img
              src={imgUrl}
              alt="Main"
              className="h-14 w-14 object-cover rounded border"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://picsum.photos/200/300";
              }}
            />
          );
        },
      },
      {
        accessorKey: "CompanyID",
        header: "CompanyID",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "Year",
        header: "Year",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "OrderType",
        header: "Fabric 8",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "CustomerID",
        header: "CustomerID",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "DepartmentID",
        header: "Rib18",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "PONo",
        header: "PONo",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "PODate",
        header: "PODate",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "Quantity",
        header: "Quantity",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "QuantityActual",
        header: "QuantityActual",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "QuantityExtra",
        header: "QuantityExtra",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        accessorKey: "StyleName",
        header: "StyleName",
        enableColumnFilter: true,
        filterFn: "text",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const rowData = row.original;
          return (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              onClick={() => {
                setEditRowIndex(row.index);
                setNewRow({ ...rowData });
                setShowModal(true);
              }}
            >
              ✏️ Edit
            </button>
          );
        },
      },
    ],
    []
  );

  // Custom global filter that filters ONLY on OrderNo column
  const globalFilterFn = (row, columnId, filterValue) => {
    if (columnId !== "OrderNo") return true;
    const value = row.getValue(columnId);
    return String(value || "")
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  };

  // const globalFilterFn = (row, columnId, filterValue) => {
  //   const value = row.getValue(columnId);
  //   return String(value || "")
  //     .toLowerCase()
  //     .includes(filterValue.toLowerCase());
  // };

  // const table = useReactTable({
  //   data,
  //   columns,
  //   state: {
  //     columnFilters,
  //     globalFilter,
  //     pagination: {
  //       pageSize: data.length,
  //       pageIndex: 0,
  //     },
  //   },
  //   globalFilterFn,
  //   onGlobalFilterChange: setGlobalFilter,
  //   onColumnFiltersChange: setColumnFilters,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  // });

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
    globalFilterFn, // ✅ for global search
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

  // Highlight matching text in green
  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(
      `(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    ); // escape special chars
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-green-300 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredData = table.getFilteredRowModel().rows.map((row) =>
    row.getVisibleCells().reduce((acc, cell) => {
      acc[cell.column.id] = cell.getValue();
      return acc;
    }, {})
  );

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "orders.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Orders", 14, 10);
    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: filteredData.map((row) =>
        columns.map((col) => row[col.accessorKey])
      ),
      startY: 20,
      styles: { fontSize: 8 },
    });
    doc.save("orders.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-1 mt-2 rounded-2xl">
      <div className="max-w-10xl mx-auto">
        <h6 className="text-1xl font-semibold text-gray-800 mb-6 text-start mt-2 ml-2">
          🧾 Hero Fashion Orders First Tab
        </h6>

        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-1xl p-6">
          {loading ? (
            <SkeletonTable columnCount={columns.length} rowCount={6} />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                <div className="max-w-md w-full flex items-center justify-between">
                  <Input
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="🔍 Search orders..."
                    className="w-full rounded-lg border-gray-300 shadow-sm px-4 py-2 text-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-semibold whitespace-nowrap">
                    Showing {table.getFilteredRowModel().rows.length} rows
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setEditRowIndex(null);
                      setNewRow({});
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    ➕ Add New
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

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
                          const cellValue = String(cell.getValue() ?? "");

                          return (
                            <td
                              key={cell.id}
                              className="px-4 py-3 border-t whitespace-nowrap"
                            >
                              {cell.column.id === "OrderNo"
                                ? highlightText(cellValue, globalFilter)
                                : cellValue}
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
            {/* ❌ Cancel Icon Top Right */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">➕ Add New Order</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {columns.map((col) => {
                // if (col.accessorKey === "MainImagePath") return null;
                if (
                  !col.accessorKey ||
                  col.id === "actions" ||
                  col.accessorKey === "MainImagePath"
                )
                  return null;
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
                    // Edit mode
                    const updated = [...data];
                    updated[editRowIndex] = newRow;
                    setData(updated);
                  } else {
                    // Add mode
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

export default Home;

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
