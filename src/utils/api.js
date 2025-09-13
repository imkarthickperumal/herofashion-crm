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

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(
      "https://dev.admin.herofashion.in//dhana/api/login/",
      credentials
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};

// ✅ Logout API
export const logoutUser = async () => {
  try {
    const res = await axios.post(
      "http://103.125.155.133:7002/dhana/api/logout/"
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Logout failed" };
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
  fetchWithTiming("https://dev.admin.herofashion.in/dhana/api/order_delivery/");

// export const getServer11 = () =>
//   fetchWithTiming("https://app.herofashion.com/dhana/api/txorderdetstyle/");

// export const getServer13 = () =>
//   fetchWithTiming("https://app.herofashion.com/dhana/api/order_details/");



export const getServer11 = async () => {
  const res = await fetchWithTiming("https://app.herofashion.com/dhana/api/txorderdetstyle/");
  console.log("✅ API DATA:", res);
  return res; // already JSON
};


export const getServer13 = async () => {
  const res = await fetchWithTiming("https://app.herofashion.com/dhana/api/order_details/");
  console.log("✅ API DATA:", res);
  return res; // already JSON
};





