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
  eventDate: "",
  location: "",
  buttonText: "",
  buttonLink: "",
  status: true,
};

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [image, setImage] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchEvents = async () => {
    try {
      const response = await API.get("/events");

      setEvents(response.data?.data || []);
    } catch (error) {
      console.error(
        "Failed to load events:",
        error
      );
    }
  };

  useEffect(() => {
    fetchEvents();
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
          `/events/${editingId}`,
          data
        );
      } else {
        await API.post(
          "/events",
          data
        );
      }

      setOpen(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  const editEvent = (event) => {
    setEditingId(event._id);

    setForm({
      title: event.title || "",
      description:
        event.description || "",
      eventDate: event.eventDate
        ? event.eventDate.substring(0, 10)
        : "",
      location:
        event.location || "",
      buttonText:
        event.buttonText || "",
      buttonLink:
        event.buttonLink || "",
      status:
        event.status ?? true,
    });

    setImage(null);
    setOpen(true);
  };

  const deleteEvent = async (id) => {
    if (
      !window.confirm(
        "Delete this event?"
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/events/${id}`
      );

      fetchEvents();
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
          <h1 className="text-2xl font-bold text-slate-900">
            Events
          </h1>

          <p className="text-sm text-slate-500">
            Manage organisation events.
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
          Add Event
        </button>

      </div>


      {/* EVENTS */}

      {events.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            No events found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {events.map((event) => (
            <div
              key={event._id}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >

              {event.image && (
                <img
                  src={`${IMAGE_URL}${event.image}`}
                  alt={event.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="p-5">

                <div className="mb-3 flex items-start justify-between gap-3">

                  <h2 className="text-lg font-bold">
                    {event.title}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      event.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {event.status
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>

                {event.eventDate && (
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(
                      event.eventDate
                    ).toLocaleDateString()}
                  </p>
                )}

                {event.location && (
                  <p className="mt-1 text-sm text-slate-500">
                    {event.location}
                  </p>
                )}

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {event.description}
                </p>


                {/* ACTIONS */}

                <div className="mt-5 flex gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      editEvent(event)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 py-2.5 text-sm font-medium hover:bg-slate-200"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteEvent(event._id)
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
            ? "Edit Event"
            : "Add Event"
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
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Event title"
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
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Event description"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Event Date
            </label>

            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>


          <div>
            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Event location"
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
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Read More"
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
              className="w-full rounded-lg border px-4 py-3"
              placeholder="/contact"
            />
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
              ? "Update Event"
              : "Create Event"}
          </button>

        </form>

      </Modal>

    </div>
  );
};

export default EventsAdmin;