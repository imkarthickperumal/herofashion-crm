import { useState, useEffect } from "react";
import DynamicAgGrid from "../components/DynamicAgGrid";
import { getServer11 } from "../utils/api";

const Server11 = ({ pageTitle, globalFilter }) => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getServer11();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((val) =>
      String(val).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );
  return (
    <div className="p-4 w-full h-full">
      <h4 className="text-1xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        {pageTitle}
      </h4>

      <div className="overflow-x-auto">
        <div className="ag-theme-alpine w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] rounded-lg shadow-md">
          <DynamicAgGrid rowData={filteredOrders} searchTerm={globalFilter} />
        </div>
      </div>
    </div>
  );
};

export default Server11;
