import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";
import FormInput from "../../components/admin/FormInput";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

const Hero = () => {
  const [heroes, setHeroes] = useState([]);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [image, setImage] = useState(null);

  const [form, setForm] = useState({
    heading: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    status: true,
  });

  const fetchHeroes = async () => {
    try {
      const response = await API.get("/hero");

      setHeroes(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const resetForm = () => {
    setForm({
      heading: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      status: true,
    });

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
    [name]: type === "checkbox" ? checked : value,
  }));
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("heading", form.heading);
    formData.append("description", form.description);
    formData.append("buttonText", form.buttonText);
    formData.append("buttonLink", form.buttonLink);
    formData.append("status", form.status);

    if (image) {
      formData.append("image", image);
    }

    console.log("Sending Hero Data:");
    console.log("heading:", form.heading);
    console.log("description:", form.description);
    console.log("buttonText:", form.buttonText);
    console.log("buttonLink:", form.buttonLink);
    console.log("status:", form.status);
    console.log("image:", image);

    let response;

    if (editingId) {
      response = await API.put(
        `/hero/${editingId}`,
        formData
      );
    } else {
      response = await API.post(
        "/hero",
        formData
      );
    }

    console.log("Hero response:", response.data);

    alert(
      response.data.message ||
        "Hero saved successfully"
    );

    setOpen(false);
    resetForm();
    fetchHeroes();

  } catch (error) {
    console.error(
      "Hero save error:",
      error
    );

    console.error(
      "Backend response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
        "Hero save failed"
    );
  }
};

  const handleEdit = (hero) => {
    setEditingId(hero._id);

    setForm({
      heading: hero.heading || "",
      description: hero.description || "",
      buttonText: hero.buttonText || "",
      buttonLink: hero.buttonLink || "",
      status: hero.status,
    });

    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero?")) {
      return;
    }

    try {
      await API.delete(`/hero/${id}`);

      fetchHeroes();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hero Section</h1>

          <p className="text-sm text-slate-500">
            Manage homepage hero content.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={18} />
          Add Hero
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">Image</th>

                <th className="px-5 py-4">Heading</th>

                <th className="px-5 py-4">Status</th>

                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {heroes.map((hero) => (
                <tr key={hero._id} className="border-b last:border-0">
                  <td className="px-5 py-4 font-medium">{heroes.indexOf(hero) + 1}</td>
                  <td className="px-5 py-4">
                    {hero.image ? (
                      <img
                        src={`${IMAGE_URL}${hero.image}`}
                        className="h-14 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-14 w-20 rounded-lg bg-slate-100" />
                    )}
                  </td>

                  <td className="px-5 py-4 font-medium">{hero.heading}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        hero.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {hero.status ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(hero)}
                        className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(hero._id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        title={editingId ? "Edit Hero" : "Add Hero"}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
         <FormInput
  label="Heading"
  name="heading"
  required
  value={form.heading}
  onChange={handleChange}
  placeholder="Enter heading"
/>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <FormInput
  label="Button Text"
  name="buttonText"
  value={form.buttonText}
  onChange={handleChange}
  placeholder="Enter button text"
/>

          <FormInput
  label="Button Link"
  name="buttonLink"
  value={form.buttonLink}
  onChange={handleChange}
  placeholder="Enter button link"
/>

          <div>
            <label className="mb-2 block text-sm font-medium">Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0])}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />

            <span className="text-sm">Active</span>
          </label>

          <button className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white">
            {editingId ? "Update Hero" : "Create Hero"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Hero;
