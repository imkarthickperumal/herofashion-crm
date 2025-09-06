import axios from "axios";

// ✅ Dynamic API base URL
const API_BASE =
  import.meta.env.MODE === "development"
    ? "" // Dev → use Vite proxy
    : "https://roll.herofashion.com:883"; // Prod (Vercel) → call backend directly

// ⏱️ Utility for measuring API call duration
const fetchWithTiming = async (url) => {
  const startTime = performance.now();
  try {
    const res = await axios.get(`${API_BASE}${url}`);
    const endTime = performance.now();
    console.log(`⏱️ ${API_BASE}${url} took ${(endTime - startTime).toFixed(2)} ms`);
    return res.data;
  } catch (err) {
    const endTime = performance.now();
    console.error(
      `❌ ${API_BASE}${url} failed after ${(endTime - startTime).toFixed(2)} ms`
    );
    throw err.response?.data || { message: "API call failed" };
  }
};

// ✅ Auth APIs
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_BASE}/dhana/api/login/`, credentials);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  try {
    const res = await axios.post(`${API_BASE}/dhana/api/logout/`);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
  }
};

// ✅ APIs (delivery & reports)
export const getOrderDelivery = () =>
  fetchWithTiming("/dhana/api/order_delivery/");

export const getOverall = () => fetchWithTiming("/overall");

export const getEmpwise = () => fetchWithTiming("/empwise/");

export const getTXOrder = () => fetchWithTiming("/dhana/api/tx_order/");

// ✅ Legacy direct server calls
export const getChennai = () =>
  fetchWithTiming("/dhana/api/order_delivery/");

export const getServer11 = () =>
  fetchWithTiming("/dhana/api/txorderdetstyle/");

export const getServer13 = () =>
  fetchWithTiming("/dhana/api/order_details/");
