import { useEffect, useState } from "react";
import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  status: true,
};

const AboutAdmin = () => {
  const [about, setAbout] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAbout = async () => {
    try {
      const response = await API.get("/about");
      const data = response.data?.data;

      if (data) {
        setAbout(data);

        setForm({
          title: data.title || "",
          description: data.description || "",
          buttonText: data.buttonText || "",
          buttonLink: data.buttonLink || "",
          status: data.status ?? true,
        });
      }
    } catch (error) {
      console.error("Failed to load about:", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      if (about?._id) {
        await API.put(`/about/${about._id}`, data);
      } else {
        await API.post("/about", data);
      }

      alert("About saved successfully.");

      setImage(null);
      await fetchAbout();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to save About."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          About Section
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your organisation's About content.
        </p>
      </div>

      {/* FORM */}
      <div className="w-full rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* TITLE */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter About title"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={8}
              placeholder="Enter About description"
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* BUTTON */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Button Text
              </label>

              <input
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="Read More"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Button Link
              </label>

              <input
                name="buttonLink"
                value={form.buttonLink}
                onChange={handleChange}
                placeholder="/about"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              About Image
            </label>

            {about?.image && !image && (
              <img
                src={`${IMAGE_URL}${about.image}`}
                alt="About"
                className="mb-4 h-48 w-full rounded-lg object-cover"
              />
            )}

            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mb-4 h-48 w-full rounded-lg object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files?.[0] || null)
              }
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* STATUS */}
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <span className="text-sm font-medium text-slate-700">
              Active
            </span>
          </label>

          {/* SAVE */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {loading
              ? "Saving..."
              : about
              ? "Update About"
              : "Save About"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutAdmin;