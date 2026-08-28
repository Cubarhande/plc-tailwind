import { useEffect, useState } from "react";

import { Plus, Edit, Trash2 } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Cards = () => {
  const [cards, setCards] = useState([]);
  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [image, setImage] = useState(null);

  /* ================= EMPTY FORM ================= */

  const emptyForm = {
    category: "",
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    displayOrder: 0,
    backgroundColor: "#ffffff",
    status: true,
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
    try {
      const [cardsRes, categoriesRes] = await Promise.all([
        API.get(`/cards?search=${encodeURIComponent(search)}&limit=100`),
        API.get("/categories"),
      ]);

      setCards(cardsRes.data.data || []);

      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error("Failed to load cards:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  /* ================= RESET ================= */

  const reset = () => {
    setForm({
      ...emptyForm,
    });

    setImage(null);
    setEditingId(null);
  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (image) {
      data.append("image", image);
    }

    try {
      if (editingId) {
        await API.put(`/cards/${editingId}`, data);
      } else {
        await API.post("/cards", data);
      }

      setOpen(false);

      reset();

      fetchData();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  /* ================= EDIT ================= */

  const editCard = (card) => {
    setEditingId(card._id);

    setForm({
      category: card.category?._id || card.category || "",

      title: card.title || "",

      description: card.description || "",

      buttonText: card.buttonText || "",

      buttonLink: card.buttonLink || "",

      displayOrder: card.displayOrder || 0,

      backgroundColor: card.backgroundColor || "#ffffff",

      status: card.status ?? true,
    });

    setImage(null);

    setOpen(true);
  };

  /* ================= DELETE ================= */

  const deleteCard = async (id) => {
    if (!window.confirm("Delete this card?")) {
      return;
    }

    try {
      await API.delete(`/cards/${id}`);

      fetchData();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            What We Do Cards
          </h1>

          <p className="text-sm text-slate-500">
            Manage cards inside categories.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Card
        </button>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search cards..."
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 md:w-96"
        />
      </div>

      {/* ================= TABLE ================= */}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4">Image</th>

                <th className="px-5 py-4">Title</th>

                <th className="px-5 py-4">Category</th>

                <th className="px-5 py-4">Color</th>

                <th className="px-5 py-4">Order</th>

                <th className="px-5 py-4">Status</th>

                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cards.length > 0 ? (
                cards.map((card) => (
                  <tr key={card._id} className="border-t border-slate-100">
                    {/* IMAGE */}

                    <td className="px-5 py-4">
                      {card.image ? (
                        <img
                          src={`${IMAGE_URL}${card.image}`}
                          alt={card.title}
                          className="h-14 w-20 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-20 rounded-lg bg-slate-100" />
                      )}
                    </td>

                    {/* TITLE */}

                    <td className="px-5 py-4 font-medium text-slate-900">
                      {card.title}
                    </td>

                    {/* CATEGORY */}

                    <td className="px-5 py-4 text-slate-600">
                      {card.category?.name || "No category"}
                    </td>

                    {/* COLOR */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-7 w-7 rounded-md border border-slate-200"
                          style={{
                            backgroundColor: card.backgroundColor || "#ffffff",
                          }}
                        />

                        <span className="text-xs text-slate-500">
                          {card.backgroundColor || "#ffffff"}
                        </span>
                      </div>
                    </td>

                    {/* ORDER */}

                    <td className="px-5 py-4">{card.displayOrder}</td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          card.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {card.status ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editCard(card)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCard(card._id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
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
                    colSpan="7"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No cards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}

      <Modal
        open={open}
        title={editingId ? "Edit Card" : "Add Card"}
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter card title"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
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
              placeholder="Enter card description"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* IMAGE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-3 text-sm"
            />
          </div>

          {/* BUTTON */}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Button Text
              </label>

              <input
                type="text"
                name="buttonText"
                value={form.buttonText}
                onChange={handleChange}
                placeholder="Learn More"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Button Link
              </label>

              <input
                type="text"
                name="buttonLink"
                value={form.buttonLink}
                onChange={handleChange}
                placeholder="/contact"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* DISPLAY ORDER */}

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
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          {/* BACKGROUND COLOR */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Background Color
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                name="backgroundColor"
                value={form.backgroundColor}
                onChange={handleChange}
                className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
              />

              <input
                type="text"
                name="backgroundColor"
                value={form.backgroundColor}
                onChange={handleChange}
                placeholder="#ffffff"
                className="flex-1 rounded-lg border border-slate-200 px-4 py-3 uppercase outline-none focus:border-slate-900"
              />
            </div>

            {/* PREVIEW */}

            <div
              className="mt-3 h-16 rounded-lg border border-slate-200"
              style={{
                backgroundColor: form.backgroundColor || "#ffffff",
              }}
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

            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            {editingId ? "Update Card" : "Create Card"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Cards;
