import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RootUserLogin({ setRootUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // ✅ Only balamurugan/balamurugan allowed
    if (username === "balamurugan" && password === "balamurugan") {
      localStorage.setItem("rootUser", "true");
      setRootUser(true);
      toast.success("Root Admin logged in");
      navigate("/usercreate");
    } else {
      toast.error("Invalid root credentials");
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
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Login Card */}
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            Root Admin Login
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Sign in to manage users
          </p>
        </div>

        {/* Username */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold py-3 rounded-xl shadow-md text-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
