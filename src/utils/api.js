

import axios from "axios";

const API_BASE_URL = "https://herofashion.onrender.com/api/data";
// const API_BASE_URL = "http://localhost:8001/api/data";

export const getOrders = async () => {
  const startTime = performance.now(); // ✅ Start timing

  try {
    const res = await axios.get(`${API_BASE_URL}`);
    const endTime = performance.now(); // ✅ End timing
    console.log(`⏱️ API getOrders took ${(endTime - startTime).toFixed(2)} ms`);
    return res.data;
  } catch (error) {
    const endTime = performance.now(); // ✅ Still log time on error
    console.error(
      `❌ API getOrders failed after ${(endTime - startTime).toFixed(2)} ms`
    );
    throw error;
  }
};

