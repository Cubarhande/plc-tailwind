import { useEffect, useState } from "react";

import {
  Trash2,
  Eye
} from "lucide-react";

import API from "../../services/api";
import Modal from "../../components/admin/Modal";

const ContactsAdmin = () => {
  const [contacts, setContacts] =
    useState([]);

  const [selected, setSelected] =
    useState(null);

  const fetchContacts = async () => {
    const response =
      await API.get("/contacts");

    setContacts(
      response.data.data || []
    );
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const remove = async (id) => {
    if (
      !confirm(
        "Delete this message?"
      )
    ) {
      return;
    }

    await API.delete(
      `/contacts/${id}`
    );

    fetchContacts();
  };

 const markRead = async (contact) => {
  try {
    await API.put(`/contacts/${contact._id}`, {
      status: "read",
    });

    setSelected({
      ...contact,
      status: "read",
    });

    fetchContacts();
  } catch (error) {
    console.error("Failed to mark message as read:", error);
  }
};

  return (
    <div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Contact Messages
        </h1>

        <p className="text-sm text-slate-500">
          View messages submitted through the website.
        </p>
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
                  Email
                </th>

                <th className="px-5 py-4">
                  Subject
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

              {contacts.map(
                (contact) => (
                  <tr
                    key={contact._id}
                    className="border-t"
                  >
                    <td className="px-5 py-4">
                      {contacts.indexOf(contact) + 1}
                    </td>

                    <td className="px-5 py-4">
                      {contact.name}
                    </td>

                    <td className="px-5 py-4">
                      {contact.email}
                    </td>

                    <td className="px-5 py-4">
                      {contact.subject}
                    </td>

                    <td className="px-5 py-4">

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                        {contact.status}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex gap-2">

                        <button
                          onClick={() => {
                            setSelected(
                              contact
                            );

                            if (
                              contact.status ===
                              "new"
                            ) {
                              markRead(
                                contact
                              );
                            }
                          }}
                          className="rounded-lg bg-slate-100 p-2"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() =>
                            remove(
                              contact._id
                            )
                          }
                          className="rounded-lg bg-red-50 p-2 text-red-600"
                        >
                          <Trash2
                            size={16}
                          />
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
        open={Boolean(selected)}
        title="Contact Message"
        onClose={() =>
          setSelected(null)
        }
      >

        {selected && (
          <div className="space-y-4">

            <div>
              <p className="text-xs text-slate-500">
                Name
              </p>
              <p className="font-medium">
                {selected.name}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Email
              </p>
              <p>
                {selected.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Phone
              </p>
              <p>
                {selected.phone ||
                  "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Subject
              </p>
              <p>
                {selected.subject}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Message
              </p>

              <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4">
                {selected.message}
              </p>
            </div>

          </div>
        )}

      </Modal>

    </div>
  );
};

export default ContactsAdmin;