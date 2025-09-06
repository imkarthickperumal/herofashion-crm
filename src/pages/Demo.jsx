import React, { useEffect, useState } from "react";

export default function Demo() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/dhana/api/order_delivery/") // through Vite proxy
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data); // debug
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order Delivery Data</h1>
      {orders.map((order, index) => (
        <div
          key={index}
          className="mb-6 p-4 border rounded-lg shadow bg-gray-50"
        >
          {/* Show Main Image if available */}
          {order.MainImagePath && (
            <img
              src={order.MainImagePath}
              alt="Order"
              className="w-40 mb-3 rounded border"
            />
          )}

          {/* Show all keys dynamically */}
          <table className="table-auto border-collapse w-full">
            <tbody>
              {Object.entries(order).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="p-2 font-semibold text-gray-700">{key}</td>
                  <td className="p-2 text-gray-900">
                    {value === null ? "-" : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
