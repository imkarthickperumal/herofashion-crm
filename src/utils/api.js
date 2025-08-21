import axios from "axios";

// ⏱️ Utility for measuring API call duration
const fetchWithTiming = async (url) => {
  const startTime = performance.now();
  try {
    const res = await axios.get(url);
    const endTime = performance.now();
    console.log(`⏱️ ${url} took ${(endTime - startTime).toFixed(2)} ms`);
    return res.data;
  } catch (err) {
    const endTime = performance.now();
    console.error(`❌ ${url} failed after ${(endTime - startTime).toFixed(2)} ms`);
    throw err;
  }
};

// ✅ APIs
export const getOrderDelivery = () =>
  fetchWithTiming("https://dev.admin.herofashion.in/dhana/api/order_delivery/");

export const getOverall = () =>
  fetchWithTiming("http://103.125.155.133:7005/overall");

export const getEmpwise = () =>
  fetchWithTiming("http://103.125.155.133:7005/empwise/");

export const getTXOrder = () =>
  fetchWithTiming("https://dev.admin.herofashion.in/dhana/api/tx_order/");

export const getChennai = () =>
  fetchWithTiming("http://103.125.155.133:7002/dhana/api/order_delivery/");

export const getServer11 = () =>
  fetchWithTiming("http://103.125.155.133:7002/dhana/api/txorderdetstyle/");

export const getServer13 = () =>
  fetchWithTiming("http://103.125.155.133:7002/dhana/api/order_details/");
