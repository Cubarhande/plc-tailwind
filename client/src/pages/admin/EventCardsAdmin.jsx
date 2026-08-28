import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "http://localhost:5000";

const initialForm = {
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
  displayOrder: 0,
  backgroundColor: "#ffffff",
  status: true,
};

const EventCardsAdmin = () => {
  const [cards, setCards] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchCards = async () => {
    try {
      const response =
        await API.get("/event-cards");

      const data =
        response.data?.data || [];

      setCards(
        data.sort(
          (a, b) =>
            Number(a.displayOrder || 0) -
            Number(b.displayOrder || 0)
        )
      );
    } catch (error) {
      console.error(
        "Failed to load event cards:",
        error
      );
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(form).forEach(
        ([key, value]) => {
          data.append(key, value);
        }
      );

      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        await API.put(
          `/event-cards/${editingId}`,
          data
        );
      } else {
        await API.post(
          "/event-cards",
          data
        );
      }

      setOpen(false);
      resetForm();
      fetchCards();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const editCard = (card) => {
    setEditingId(card._id);

    setForm({
      title: card.title || "",
      description:
        card.description || "",
      buttonText:
        card.buttonText || "",
      buttonLink:
        card.buttonLink || "",
      displayOrder:
        card.displayOrder || 0,
      backgroundColor:
        card.backgroundColor ||
        "#ffffff",
      status:
        card.status ?? true,
    });

    setImage(null);
    setOpen(true);
  };

  const deleteCard = async (id) => {
    if (
      !window.confirm(
        "Delete this event card?"
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/event-cards/${id}`
      );

      fetchCards();
    } catch (error) {
      console.error(error);

      alert("Delete failed");
    }
  };

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Event Cards
          </h1>

          <p className="text-sm text-slate-500">
            Manage reusable event cards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Event Card
        </button>

      </div>


      {/* CARDS */}

      {cards.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            No event cards found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {cards.map((card) => (
            <div
              key={card._id}
              className="overflow-hidden rounded-xl shadow-sm"
              style={{
                backgroundColor:
                  card.backgroundColor ||
                  "#ffffff",
              }}
            >

              {card.image && (
                <img
                  src={`${IMAGE_URL}${card.image}`}
                  alt={card.title}
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="p-5">

                <div className="mb-3 flex items-start justify-between gap-3">

                  <h2 className="text-lg font-bold">
                    {card.title}
                  </h2>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs ${
                      card.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {card.status
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>

                <div className="mt-3 text-xs text-slate-400">
                  Display Order:{" "}
                  {card.displayOrder}
                </div>


                <div className="mt-5 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      editCard(card)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-medium hover:bg-slate-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteCard(card._id)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}


      {/* MODAL */}

      <Modal
        open={open}
        title={
          editingId
            ? "Edit Event Card"
            : "Add Event Card"
        }
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Card title"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Card description"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] ||
                    null
                )
              }
              className="w-full rounded-lg border p-3"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Button Text
            </label>

            <input
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
              placeholder="Read More"
              className="w-full rounded-lg border px-4 py-3"
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
              placeholder="/contact"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Display Order
            </label>

            <input
              type="number"
              name="displayOrder"
              value={form.displayOrder}
              onChange={handleChange}
              min="0"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Background Color
            </label>

            <div className="flex gap-3">

              <input
                type="color"
                value={
                  form.backgroundColor
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    backgroundColor:
                      e.target.value,
                  }))
                }
                className="h-12 w-16 cursor-pointer rounded-lg border p-1"
              />

              <input
                name="backgroundColor"
                value={
                  form.backgroundColor
                }
                onChange={handleChange}
                className="flex-1 rounded-lg border px-4 py-3"
              />

            </div>
          </div>


          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="h-4 w-4"
            />

            <span className="text-sm font-medium">
              Active
            </span>
          </label>


          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800"
          >
            {editingId
              ? "Update Event Card"
              : "Create Event Card"}
          </button>

        </form>

      </Modal>

    </div>
  );
};

export default EventCardsAdmin;