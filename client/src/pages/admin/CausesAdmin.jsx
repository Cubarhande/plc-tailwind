import { useEffect, useState } from "react";

import { Plus, Edit, Trash2 } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const CausesAdmin = () => {
  const [causes, setCauses] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);

  const initial = {
    title: "",
    description: "",
    goalAmount: 0,
    raisedAmount: 0,
    buttonText: "Donate",
    buttonLink: "",
    displayOrder: 0,
    status: true,
  };

  const [form, setForm] = useState(initial);

  const fetchCauses = async () => {
    const response = await API.get("/causes");

    setCauses(response.data.data || []);
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const reset = () => {
    setForm(initial);
    setImage(null);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    if (image) {
      data.append("image", image);
    }

    try {
      if (editingId) {
        await API.put(`/causes/${editingId}`, data);
      } else {
        await API.post("/causes", data);
      }

      setOpen(false);
      reset();
      fetchCauses();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed.");
    }
  };

  const edit = (cause) => {
    setEditingId(cause._id);

    setForm({
      title: cause.title || "",
      description: cause.description || "",
      goalAmount: cause.goalAmount || 0,
      raisedAmount: cause.raisedAmount || 0,
      buttonText: cause.buttonText || "Donate",
      buttonLink: cause.buttonLink || "",
      displayOrder: cause.displayOrder || 0,
      status: cause.status,
    });

    setOpen(true);
  };

  const remove = async (id) => {
    if (!confirm("Delete cause?")) return;

    await API.delete(`/causes/${id}`);

    fetchCauses();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Causes</h1>

          <p className="text-sm text-slate-500">Manage donation causes.</p>
        </div>

        <button
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-white"
        >
          <Plus size={18} />
          Add Cause
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {causes.map((cause) => (
          <div
            key={cause._id}
            className="overflow-hidden rounded-xl bg-white shadow-sm"
          >
            {cause.image && (
              <img
                src={`${IMAGE_URL}${cause.image}`}
                className="h-48 w-full object-cover"
              />
            )}

            <div className="p-5">
              <h3 className="font-semibold">{cause.title}</h3>

              <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                {cause.description}
              </p>

              <div className="mt-4 flex justify-between text-sm">
                <span>Goal: ₹{cause.goalAmount}</span>

                <span>Raised: ₹{cause.raisedAmount}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => edit(cause)}
                  className="flex-1 rounded-lg bg-slate-100 py-2"
                >
                  <Edit size={16} className="mx-auto" />
                </button>

                <button
                  onClick={() => remove(cause._id)}
                  className="flex-1 rounded-lg bg-red-50 py-2 text-red-600"
                >
                  <Trash2 size={16} className="mx-auto" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        title={editingId ? "Edit Cause" : "Add Cause"}
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >
        <form onSubmit={submit} className="space-y-5">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title: e.target.value,
              })
            }
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            rows="5"
            className="w-full rounded-lg border px-4 py-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              placeholder="Goal Amount"
              value={form.goalAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  goalAmount: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="number"
              placeholder="Raised Amount"
              value={form.raisedAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  raisedAmount: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0])}
            className="w-full rounded-lg border p-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Button Text"
              value={form.buttonText}
              onChange={(e) =>
                setForm({
                  ...form,
                  buttonText: e.target.value,
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              placeholder="Button Link"
              value={form.buttonLink}
              onChange={(e) =>
                setForm({
                  ...form,
                  buttonLink: e.target.value,
                })
              }
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <button className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white">
            Save Cause
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CausesAdmin;
