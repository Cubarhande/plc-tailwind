import { useEffect, useState } from "react";
import API from "../../services/api";

const SettingsAdmin = () => {
  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    siteName: "",
    email: "",
    phone: "",
    address: "",
    map: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  });

  /* =========================
     FETCH SETTINGS
  ========================= */

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await API.get("/settings");

        const data = response.data?.data;

        if (data) {
          setForm({
            siteName: data.siteName || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            map: data.map || "",
            facebook: data.facebook || "",
            instagram: data.instagram || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            youtube: data.youtube || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);

        setError(err.response?.data?.message || "Failed to load settings.");
      } finally {
        setFetching(false);
      }
    };

    fetchSettings();
  }, []);

  /* =========================
     INPUT CHANGE
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     FILE CHANGE
  ========================= */

  const handleLogoChange = (e) => {
    setLogo(e.target.files?.[0] || null);
  };

  const handleFaviconChange = (e) => {
    setFavicon(e.target.files?.[0] || null);
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (logo) {
        data.append("logo", logo);
      }

      if (favicon) {
        data.append("favicon", favicon);
      }

      const response = await API.put("/settings", data);

      setMessage(response.data?.message || "Settings updated successfully.");

      // Clear selected files after successful upload
      setLogo(null);
      setFavicon(null);

      // Reset file input fields
      e.target.reset();
    } catch (err) {
      console.error("Settings update error:", err);

      setError(err.response?.data?.message || "Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (fetching) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage global website information.
        </p>
      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ================= GENERAL SETTINGS ================= */}

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="border-b pb-4 text-lg font-semibold text-slate-900">
            General Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* SITE NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Name
              </label>

              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="PLC Organisation"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="info@example.com"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* ADDRESS */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Organisation address"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            {/* LOGO */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full rounded-lg border p-3 text-sm"
              />

              {logo && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected: {logo.name}
                </p>
              )}
            </div>

            {/* FAVICON */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Favicon
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFaviconChange}
                className="w-full rounded-lg border p-3 text-sm"
              />

              {favicon && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected: {favicon.name}
                </p>
              )}
            </div>
          </div>

          {/* MAP */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Map Embed URL
            </label>

            <input
              type="text"
              name="map"
              value={form.map}
              onChange={handleChange}
              placeholder="Google Maps embed URL"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
            />

            <p className="mt-2 text-xs text-slate-400">
              Add the Google Maps embed URL for your organisation location.
            </p>
          </div>
        </div>

        {/* ================= SOCIAL MEDIA ================= */}

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="border-b pb-4 text-lg font-semibold text-slate-900">
            Social Media
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {["facebook", "instagram", "twitter", "linkedin", "youtube"].map(
              (name) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-medium capitalize text-slate-700">
                    {name}
                  </label>

                  <input
                    type="url"
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={`https://${name}.com/...`}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
                  />
                </div>
              ),
            )}
          </div>

          {/* SAVE BUTTON */}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
