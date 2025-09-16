import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const permissionsList = [
  { title: "Production 11", url: "/server11" },
  { title: "Demo 13", url: "/server13" },
  { title: "Orders", url: "/orders" },
  { title: "Attendance Report", url: "/attendancereport" },
  { title: "Roll Checking", url: "/rollchecking" },
];

const API_URL = "http://localhost:5000/users"; // json-server endpoint

export default function Usercreate({ setRootUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null); // store ID for editing
  const navigate = useNavigate();

  // Fetch users from API on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log("User list", data);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users");
    }
  };

  const handlePermissionChange = (url) => {
    setPermissions((prev) =>
      prev.includes(url) ? prev.filter((p) => p !== url) : [...prev, url]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return toast.error("Username is required");
    if (!password.trim()) return toast.error("Password is required");
    if (!role.trim()) return toast.error("Role is required");
    if (permissions.length === 0)
      return toast.error("Select at least one permission");

    const newUser = { username, password, role, permissions };

    try {
      if (editId) {
        // Update existing user
        const res = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!res.ok) throw new Error("Failed to update user");
        toast.success("User updated");
      } else {
        // Create new user
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!res.ok) throw new Error("Failed to create user");
        toast.success("User created");
      }
      setUsername("");
      setPassword("");
      setRole("");
      setPermissions([]);
      setEditId(null);
      fetchUsers(); // Refresh users list
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setPermissions(user.permissions);
    setEditId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rootUser");
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    setRootUser(false);
    toast.success("Logged out");
    navigate("/root-user-login", { replace: true });
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Root Admin - User Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-2 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block mb-2 font-medium">Username</label>
          <input
            type="text"
            className="w-full border rounded-lg p-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            className="w-full border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Role</label>
          <select
            className="w-full border rounded-lg p-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-3 font-medium">Permissions</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {permissionsList.map((perm) => (
              <label
                key={perm.url}
                className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={permissions.includes(perm.url)}
                  onChange={() => handlePermissionChange(perm.url)}
                />
                <span>
                  {perm.title} ({perm.url})
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            {editId ? "Update User" : "Create User"}
          </button>
        </div>
      </form>

      {/* Users Table */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Users List</h2>

        {/* Scrollable wrapper for small screens */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Permissions</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No users yet.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="py-3 px-4">{u.username}</td>
                  <td className="py-3 px-4">{u.role}</td>
                  <td className="py-3 px-4">
                    {u.permissions.map((p) => (
                      <span
                        key={p}
                        className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 mr-1 mb-1 rounded"
                      >
                        {p}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {/* Mobile-friendly flex layout */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
