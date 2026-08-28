import { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Plus
} from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";
import FormInput from "../../components/admin/FormInput";

const Categories = () => {
  const [categories, setCategories] =
    useState([]);

  const [open, setOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    displayOrder: 0,
    status: true
  });

  const fetchCategories = async () => {
    try {
      const response =
        await API.get("/categories");

      setCategories(
        response.data.data || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const reset = () => {
    setForm({
      name: "",
      description: "",
      displayOrder: 0,
      status: true
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(
          `/categories/${editingId}`,
          form
        );
      } else {
        await API.post(
          "/categories",
          form
        );
      }

      setOpen(false);
      reset();
      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Operation failed."
      );
    }
  };

  const editCategory = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name,
      description:
        category.description || "",
      displayOrder:
        category.displayOrder || 0,
      status: category.status
    });

    setOpen(true);
  };

  const deleteCategory = async (id) => {
    if (
      !window.confirm(
        "Delete category and related cards?"
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/categories/${id}`
      );

      fetchCategories();
    } catch (error) {
      alert("Delete failed.");
    }
  };

  return (
    <div>

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            What We Do Categories
          </h1>

          <p className="text-sm text-slate-500">
            Create and manage categories.
          </p>
        </div>

        <button
          onClick={() => {
            reset();
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={18} />
          Add Category
        </button>

      </div>

      <div className="rounded-xl bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead className="bg-slate-50">

              <tr>
                <th className="px-5 py-4">
                  ID
                </th>
                <th className="px-5 py-4">
                  Name
                </th>

                <th className="px-5 py-4">
                  Order
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {categories.map(
                (category) => (
                  <tr
                    key={category._id}
                    className="border-t"
                  >
<td className="px-5 py-4 font-medium">
                      {categories.indexOf(category) + 1}
                    </td>
                    <td className="px-5 py-4 font-medium">
                      {category.name}
                    </td>

                    <td className="px-5 py-4">
                      {category.displayOrder}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          category.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {category.status
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            editCategory(
                              category
                            )
                          }
                          className="rounded-lg bg-slate-100 p-2"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() =>
                            deleteCategory(
                              category._id
                            )
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      <Modal
        open={open}
        title={
          editingId
            ? "Edit Category"
            : "Add Category"
        }
        onClose={() => {
          setOpen(false);
          reset();
        }}
      >

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <FormInput
            label="Category Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
          />

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value
                })
              }
              rows="4"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <FormInput
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm({
                ...form,
                displayOrder:
                  Number(e.target.value)
              })
            }
          />

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.checked
                })
              }
            />

            Active
          </label>

          <button className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white">
            {editingId
              ? "Update Category"
              : "Create Category"}
          </button>

        </form>

      </Modal>

    </div>
  );
};

export default Categories;