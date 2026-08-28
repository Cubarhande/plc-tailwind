import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Save } from "lucide-react";

import API from "../../services/api";

const Profile = () => {
  const admin = JSON.parse(localStorage.getItem("admin") || "null");

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     UPDATE PROFILE
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Don't send empty password
      const data = {
        name: form.name,
        email: form.email,
      };

      if (form.password.trim()) {
        data.password = form.password;
      }

      const response = await API.put("/auth/profile", data);

      /* =========================
         UPDATE LOCAL STORAGE
      ========================= */

      if (response.data?.admin) {
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
      } else {
        localStorage.setItem(
          "admin",
          JSON.stringify({
            ...admin,
            name: form.name,
            email: form.email,
          }),
        );
      }

      setMessage(response.data?.message || "Profile updated successfully.");

      // Clear password after update
      setForm((prev) => ({
        ...prev,
        password: "",
      }));

      setShowPassword(false);

      // Refresh page so Topbar gets latest admin data
      window.location.reload();
    } catch (err) {
      console.error("Profile update error:", err);

      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your administrator profile.
        </p>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        {/* PROFILE HEADER */}

        <div className="mb-8 flex items-center gap-4 border-b pb-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
            {form.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-900">
              {form.name || "Admin"}
            </h2>

            <p className="truncate text-sm text-slate-500">
              {form.email || "Administrator"}
            </p>
          </div>
        </div>

        {/* ================= SUCCESS MESSAGE ================= */}

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ================= ERROR MESSAGE ================= */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="Admin Name"
              />
            </div>
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              New Password
            </label>

            <div className="relative">
              <Lock
                size={18}
                strokeWidth={2}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-12 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="Leave blank to keep current password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Leave blank if you don't want to change your password.
            </p>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
