import { useEffect, useState } from "react";

import {
  Plus,
  Edit,
  Trash2
} from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL;

const PartnersAdmin = () => {
  const [partners, setPartners] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [logo, setLogo] =
    useState(null);

  const initial = {
    name: "",
    website: "",
    displayOrder: 0,
    status: true
  };

  const [form, setForm] =
    useState(initial);

  const fetchPartners = async () => {
    const response =
      await API.get("/partners");

    setPartners(
      response.data.data || []
    );
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const reset = () => {
    setForm(initial);
    setLogo(null);
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(
      ([key, value]) =>
        data.append(key, value)
    );

    if (logo) {
      data.append("logo", logo);
    }

    try {
      if (editingId) {
        await API.put(
          `/partners/${editingId}`,
          data
        );
      } else {
        await API.post(
          "/partners",
          data
        );
      }

      setOpen(false);
      reset();
      fetchPartners();
    } catch (error) {
      alert("Operation failed.");
    }
  };

  const edit = (partner) => {
    setEditingId(partner._id);

    setForm({
      name: partner.name || "",
      website:
        partner.website || "",
      displayOrder:
        partner.displayOrder || 0,
      status: partner.status
    });

    setOpen(true);
  };

  const remove = async (id) => {
    if (!confirm("Delete partner?"))
      return;

    await API.delete(
      `/partners/${id}`
    );

    fetchPartners();
  };

  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            Partners
          </h1>

          <p className="text-sm text-slate-500">
            Manage organisation partners.
          </p>
        </div>

        <button
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-white"
        >
          <Plus size={18} />
          Add Partner
        </button>

      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        {partners.map((partner) => (
          <div
            key={partner._id}
            className="rounded-xl bg-white p-5 text-center shadow-sm"
          >

            {partner.logo ? (
              <img
                src={`${IMAGE_URL}${partner.logo}`}
                className="mx-auto h-24 w-full object-contain"
              />
            ) : (
              <div className="h-24 rounded-lg bg-slate-100" />
            )}

            <h3 className="mt-4 font-semibold">
              {partner.name}
            </h3>

            <div className="mt-4 flex gap-2">

              <button
                onClick={() =>
                  edit(partner)
                }
                className="flex-1 rounded-lg bg-slate-100 py-2"
              >
                <Edit
                  size={16}
                  className="mx-auto"
                />
              </button>

              <button
                onClick={() =>
                  remove(partner._id)
                }
                className="flex-1 rounded-lg bg-red-50 py-2 text-red-600"
              >
                <Trash2
                  size={16}
                  className="mx-auto"
                />
              </button>

            </div>

          </div>
        ))}

      </div>

      <Modal
        open={open}
        title={
          editingId
            ? "Edit Partner"
            : "Add Partner"
        }
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          <input
            placeholder="Partner Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            required
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            placeholder="Website"
            value={form.website}
            onChange={(e) =>
              setForm({
                ...form,
                website:
                  e.target.value
              })
            }
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setLogo(
                e.target.files?.[0]
              )
            }
            className="w-full rounded-lg border p-3"
          />

          <button className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white">
            Save Partner
          </button>

        </form>

      </Modal>

    </div>
  );
};

export default PartnersAdmin;