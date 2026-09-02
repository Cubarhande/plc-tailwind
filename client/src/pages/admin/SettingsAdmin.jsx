 
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  siteName: "",
  siteFooter: "",
  email: "",
  phone: "",
  address: "",
  map: "",
  facebook: "",
  instagram: "",
  twitter: "",
  linkedin: "",
  youtube: "",
};

const SettingsAdmin = () => {
  const [form, setForm] = useState(initialForm);
  const [settings, setSettings] = useState(null);

  const [logo, setLogo] = useState(null);
  const [favicon, setFavicon] = useState(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =====================================================
  // FETCH SETTINGS
  // =====================================================

  const fetchSettings = async () => {
    try {
      setFetching(true);

      const response = await API.get("/settings");

      const data = response.data?.data;

      if (data) {
        setSettings(data);

        setForm({
          siteName: data.siteName || "",
          siteFooter: data.siteFooter || "",
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

        setLogoPreview(
          data.logo ? `${IMAGE_URL}${data.logo}` : "",
        );

        setFaviconPreview(
          data.favicon ? `${IMAGE_URL}${data.favicon}` : "",
        );
      }
    } catch (error) {
      console.error("Failed to load settings:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load settings.",
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // LOGO CHANGE
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogo(file);

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview(previewUrl);
  };

  // =====================================================
  // FAVICON CHANGE
  // =====================================================

  const handleFaviconChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFavicon(file);

    const previewUrl = URL.createObjectURL(file);

    setFaviconPreview(previewUrl);
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

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

      toast.success(
        response.data?.message ||
          "Settings updated successfully.",
      );

      setLogo(null);
      setFavicon(null);

      await fetchSettings();

      // Reset file inputs
      e.target.reset();
    } catch (error) {
      console.error("Settings update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (fetching) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading settings...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div>
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Site Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage global website information.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* =================================================
            GENERAL INFORMATION
        ================================================= */}

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="border-b border-slate-200 pb-4 text-lg font-semibold text-slate-900">
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
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* SITE FOOTER */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Site Footer
              </label>

              <input
                type="text"
                name="siteFooter"
                value={form.siteFooter}
                onChange={handleChange}
                placeholder="PLC Organisation"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />

              <p className="mt-2 text-xs text-slate-400">
                Enter the brand text displayed in the website
                footer.
              </p>
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
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
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
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Organisation address"
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>
          </div>

          {/* =================================================
              LOGO + FAVICON
          ================================================= */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* LOGO */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Logo
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleLogoChange}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
              />

              {logo && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected: {logo.name}
                </p>
              )}

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Logo Preview
                </p>

                <div className="flex h-36 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      loading="lazy"
                      className="max-h-28 max-w-full object-contain"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      No logo available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* FAVICON */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Favicon
              </label>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/x-icon"
                onChange={handleFaviconChange}
                className="w-full rounded-lg border border-slate-200 p-3 text-sm"
              />

              {favicon && (
                <p className="mt-2 text-xs text-slate-500">
                  Selected: {favicon.name}
                </p>
              )}

              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Favicon Preview
                </p>

                <div className="flex h-36 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                  {faviconPreview ? (
                    <img
                      src={faviconPreview}
                      alt="Favicon preview"
                      loading="lazy"
                      className="h-20 w-20 object-contain"
                    />
                  ) : (
                    <p className="text-sm text-slate-400">
                      No favicon available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              MAP
          ================================================= */}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Map Embed URL
            </label>

            <input
              type="text"
              name="map"
              value={form.map}
              onChange={handleChange}
              placeholder="https://www.google.com/maps/embed?..."
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
            />

            <p className="mt-2 text-xs text-slate-400">
              Add the Google Maps embed URL for your organisation
              location.
            </p>
          </div>
        </div>

        {/* =================================================
            SOCIAL MEDIA
        ================================================= */}

        <div className="mt-5 rounded-xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="border-b border-slate-200 pb-4 text-lg font-semibold text-slate-900">
            Social Media
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              "facebook",
              "instagram",
              "twitter",
              "linkedin",
              "youtube",
            ].map((name) => (
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
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
            ))}
          </div>

          {/* SAVE */}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : settings
                  ? "Update Settings"
                  : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;
 
