import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

import API from "../../services/api";

const Contact = () => {
  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  // Get contact settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await API.get("/settings");

        setSettings(response.data?.data || null);
      } catch (err) {
        console.error("Settings error:", err);
      }
    };

    loadSettings();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await API.post("/contacts", form);

      setSuccess("Your message has been submitted successfully.");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-50 py-14 sm:py-20">
      <div className="container-custom">
        {/* HEADER */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Get In Touch
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Contact Us
          </h1>

          <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
            Have a question or want to get in touch? Send us a message or use
            the contact details below.
          </p>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="mx-auto mb-6 max-w-6xl rounded-lg bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mx-auto mb-6 max-w-6xl rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8">
          {/* ================= CONTACT INFO ================= */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Contact Information
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We would love to hear from you. Contact us using the information
              below.
            </p>

            <div className="mt-7 space-y-5">
              {/* ADDRESS */}
              <div className="flex items-start gap-4 rounded-xl   p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">Address</h3>

                  <p className="mt-1 break-words text-sm leading-6 text-slate-500">
                    {settings?.address || "Address not available"}
                  </p>
                </div>
              </div>

              {/* PHONE */}
              <div className="flex items-start gap-4 rounded-xl   p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Phone size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">Phone</h3>

                  {settings?.phone ? (
                    <a
                      href={`tel:${settings.phone}`}
                      className="mt-1 block break-all text-sm text-slate-500 hover:text-slate-900"
                    >
                      {settings.phone}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">
                      Phone not available
                    </p>
                  )}
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex items-start gap-4 rounded-xl   p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">Email</h3>

                  {settings?.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="mt-1 block break-all text-sm text-slate-500 hover:text-slate-900"
                    >
                      {settings.email}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-slate-500">
                      Email not available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* MAP */}
            {settings?.map && (
              <div className="mt-6 overflow-hidden rounded-xl  ">
                <iframe
                  title="PLC Organisation Location"
                  src={settings.map.trim()}
                  className="h-64 w-full border-0 sm:h-72"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* ================= CONTACT FORM ================= */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Send Us a Message
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Fill out the form and our team will get back to you as soon as
              possible.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-5">
              {/* NAME + EMAIL */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* SUBJECT */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={6}
                  className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
