 
import { useEffect, useState } from "react";
import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Events = () => {
  const [cards, setCards] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [cardRes, eventRes] = await Promise.all([
          API.get("/event-cards"),
          API.get("/events"),
        ]);

        setCards(
          (cardRes.data?.data || [])
            .filter((x) => x.status)
            .sort(
              (a, b) =>
                Number(a.displayOrder || 0) -
                Number(b.displayOrder || 0)
            )
        );

        setEvents(
          (eventRes.data?.data || [])
            .filter((x) => x.status)
            .sort(
              (a, b) =>
                Number(a.displayOrder || 0) -
                Number(b.displayOrder || 0)
            )
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="min-h-screen bg-slate-50 py-20">
      <div className="container-custom">

       
        {/* ================= EVENTS ================= */}

        <div className="mb-10  text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Activities
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            Events
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor:
                  event.backgroundColor || "#ffffff",
              }}
            >
              {event.image && (
                <img
                  src={`${IMAGE_URL}${event.image}`}
                  alt={event.title}
                  className="h-56 w-full object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold">
                  {event.title}
                </h2>

                {event.eventDate && (
                  <p className="mt-2 text-sm font-medium">
                    {new Date(
                      event.eventDate
                    ).toLocaleDateString()}
                  </p>
                )}

                {event.location && (
                  <p className="mt-2 text-sm text-slate-500">
                    {event.location}
                  </p>
                )}

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {event.description}
                </p>
              </div>
            </article>
          ))}
        </div>



         {/* ================= EVENT CARDS ================= */}

        <div className="mb-10 mt-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Activities
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Event Cards
          </h1>
        </div>

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card._id}
                className="overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor:
                    card.backgroundColor || "#ffffff",
                }}
              >
                {card.image && (
                  <img
                    src={`${IMAGE_URL}${card.image}`}
                    alt={card.title}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h2 className="text-xl font-bold">
                    {card.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>

                  {/* {card.buttonText && (
                    <a
                      href={card.buttonLink || "#"}
                      className="mt-5 inline-block rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      {card.buttonText}
                    </a>
                  )} */}
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* ================= EVENT MODAL ONLY ================= */}

      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-black/70 text-2xl text-white"
            >
              ×
            </button>

            {selectedEvent.image && (
              <img
                src={`${IMAGE_URL}${selectedEvent.image}`}
                alt={selectedEvent.title}
                className="h-72 w-full object-cover"
              />
            )}

            <div
              className="p-8"
              style={{
                backgroundColor:
                  selectedEvent.backgroundColor ||
                  "#ffffff",
              }}
            >
              <h2 className="text-3xl font-bold">
                {selectedEvent.title}
              </h2>

              {selectedEvent.eventDate && (
                <p className="mt-3 font-medium">
                  Date:{" "}
                  {new Date(
                    selectedEvent.eventDate
                  ).toLocaleDateString()}
                </p>
              )}

              {selectedEvent.location && (
                <p className="mt-2 text-slate-500">
                  Location: {selectedEvent.location}
                </p>
              )}

              <p className="mt-5 whitespace-pre-line leading-7 text-slate-600">
                {selectedEvent.description}
              </p>

              {selectedEvent.buttonText &&
                selectedEvent.buttonLink && (
                  <a
                    href={selectedEvent.buttonLink}
                    className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white"
                  >
                    {selectedEvent.buttonText}
                  </a>
                )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Events;
 
