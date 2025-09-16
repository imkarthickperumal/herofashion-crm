// src/pages/Server11.jsx
import React, { useState, useEffect, useRef } from "react";
import DynamicAgGrid from "../components/DynamicAgGrid";
import { getOrder } from "../utils/api";

const Order = ({ pageTitle, globalFilter, setExportExcel, setExportPDF }) => {
  const [orders, setOrders] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getOrder();
      setOrders(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setExportExcel(() => () => gridRef.current.exportExcel());
    setExportPDF(() => () => gridRef.current.exportPDF());
  }, [setExportExcel, setExportPDF]);

  const filtered = orders.filter((o) =>
    Object.values(o).some((v) =>
      String(v).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-1xl font-semibold text-gray-800 dark:text-gray-200">
          {pageTitle}
        </h2>

        {/* ✅ Total Data Count */}
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg shadow text-sm font-medium">
          Total Records: <span className="font-bold">{filtered.length}</span>
        </div>
      </div>
      <DynamicAgGrid
        ref={gridRef}
        rowData={filtered}
        searchTerm={globalFilter}
      />
    </div>
  );
};

export default Order;
