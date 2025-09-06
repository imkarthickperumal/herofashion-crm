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
    throw err.response?.data || { message: "API call failed" };
  }
};

// ✅ Auth APIs
export const loginUser = async (credentials) => {
  try {
    // 🔹 use relative URL so proxy works in dev
    const res = await axios.post("/dhana/api/login/", credentials);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post("/dhana/api/logout/");
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};

// ✅ APIs (delivery & reports)
// 🔹 In dev → goes via Vite proxy
// 🔹 In prod → directly hits server
export const getOrderDelivery = () =>
  fetchWithTiming("/dhana/api/order_delivery/");

export const getOverall = () => fetchWithTiming("/overall");

export const getEmpwise = () => fetchWithTiming("/empwise/");

export const getTXOrder = () => fetchWithTiming("/dhana/api/tx_order/");

// Legacy direct server calls (keep as backup if you want to bypass proxy)
export const getChennai = () =>
  fetchWithTiming("/dhana/api/order_delivery/");

export const getServer11 = () =>
  fetchWithTiming("/dhana/api/txorderdetstyle/");

export const getServer13 = () =>
  fetchWithTiming("/dhana/api/order_details/");
