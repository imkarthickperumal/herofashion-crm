import { useState } from "react";
import { loginUser } from "../utils/api";
import toast from "react-hot-toast";

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Validate input before sending request
  const validate = () => {
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSubmitOld = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    try {
      setLoading(true);
      const data = await loginUser(formData);

      // ✅ Save user and login success
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Login successful!");
      onLogin(data);
    } catch (err) {
      // ✅ Show backend error message OR default
      let errorMessage = "Invalid credentials";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      toast.error(errorMessage); // you can also use toast.warning if you prefer
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitNoTime = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { username, password } = formData;

    // ✅ Dummy login check
    const dummyUsers = [
      { username: "karthi", password: "karthi" },
      { username: "bala", password: "bala" },
    ];
    const isDummy = dummyUsers.some(
      (u) => u.username === username && u.password === password
    );

    try {
      setLoading(true);

      if (isDummy) {
        // ✅ Dummy login success
        const dummyUser = { username, isDummy: true };
        localStorage.setItem("user", JSON.stringify(dummyUser));
        toast.success("Dummy login successful!");
        onLogin(dummyUser);
      } else {
        // ✅ Real API login
        const data = await loginUser(formData);
        const apiUser = { ...data, isDummy: false };
        localStorage.setItem("user", JSON.stringify(apiUser));
        toast.success("Login successful!");
        onLogin(apiUser);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid API credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { username, password } = formData;

    // ✅ Dummy login check
    const dummyUsers = [
      { username: "karthi", password: "karthi" },
      { username: "bala", password: "bala" },
      { username: "dhana", password: "dhana" },
    ];
    const isDummy = dummyUsers.some(
      (u) => u.username === username && u.password === password
    );

    try {
      setLoading(true);

      if (isDummy) {
        const dummyUser = { username, isDummy: true };
        localStorage.setItem("user", JSON.stringify(dummyUser));
        toast.success("Dummy login successful!", { duration: 2000 }); // ⏳ 2 sec
        onLogin(dummyUser);
      } else {
        const data = await loginUser(formData);
        const apiUser = { ...data, isDummy: false };
        localStorage.setItem("user", JSON.stringify(apiUser));
        toast.success("Login successful!", { duration: 2000 }); // ⏳ 2 sec
        onLogin(apiUser);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid API credentials", {
        duration: 2000, // ⏳ 2 sec
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md p-8 bg-white/90 dark:bg-neutral-900/80 rounded-2xl shadow-2xl z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full mt-2 p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-2 p-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl font-semibold shadow-md transition-all duration-200 ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Hero Fashion
        </p>
      </div>
    </div>
  );
}
