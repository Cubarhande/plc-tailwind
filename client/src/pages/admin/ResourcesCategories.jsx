 
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

import API from "../../services/api";

const emptyForm = {
  name: "",
  description: "",
  displayOrder: 0,
  status: true,
};

const ResourcesCategories = () => {
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await API.get("/resource-categories/");

      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Failed to load Resources categories:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load Resources categories.",
      );
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // RESET
  // =========================

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  // =========================
  // CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await API.put(`/resource-categories/${editingId}`, {
          ...form,
          displayOrder: Number(form.displayOrder) || 0,
        });

        toast.success("Resources category updated successfully.");
      } else {
        await API.post("/resource-categories", {
          ...form,
          displayOrder: Number(form.displayOrder) || 0,
        });

        toast.success("Resources category created successfully.");
      }

      setOpen(false);
      resetForm();

      await fetchCategories();
    } catch (error) {
      console.error("Category save error:", error);

      toast.error(
        error.response?.data?.message || "Operation failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      displayOrder: category.displayOrder ?? 0,
      status: category.status ?? true,
    });

    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Resources category?")) {
      return;
    }

    try {
      await API.delete(`/resource-categories/${id}`);

      toast.success("Resources category deleted successfully.");

      await fetchCategories();
    } catch (error) {
      console.error("Category delete error:", error);

      toast.error(
        error.response?.data?.message || "Delete failed.",
      );
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    if (loading) return;

    setOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-full">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Resources Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage categories for Resources cards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* TABLE */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4 font-semibold text-slate-700">
                  ID
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Category
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Description
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Order
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-5 py-4 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {category.name}
                    </td>

                    <td className="max-w-sm px-5 py-4 text-slate-500">
                      <p className="line-clamp-2">
                        {category.description || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {category.displayOrder}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          category.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category._id)
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No Resources categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? "Edit Resources Category"
                    : "Add Resources Category"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Create a category for Resource cards.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Career Resources"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter category description"
                  disabled={loading}
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
                />
              </div>

              {/* ORDER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Display Order
                </label>

                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  min="0"
                  disabled={loading}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900 disabled:bg-slate-100"
                />
              </div>

              {/* STATUS */}

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="status"
                  checked={form.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Active
                </span>
              </label>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesCategories; 