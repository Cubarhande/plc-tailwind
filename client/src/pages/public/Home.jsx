import { useEffect, useState } from "react";
import API from "../../services/api";
import HeroSlider from "../../components/public/HeroSlider";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

const Home = () => {
  const [about, setAbout] = useState(null);
  const [cards, setCards] = useState([]);
  const [causes, setCauses] = useState([]);
  const [event, setEvent] = useState(null);

  /* ================= LOAD HOME DATA ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aboutRes, cardsRes, causesRes, eventsRes] =
          await Promise.all([
            API.get("/about"),
            API.get("/cards?limit=6"),
            API.get("/causes?limit=3"),
            API.get("/events?limit=1"),
          ]);

        /* ABOUT */
        setAbout(aboutRes.data?.data || null);

        /* WHAT WE DO */
        setCards(
          (cardsRes.data?.data || []).filter(
            (item) => item.status !== false
          )
        );

        /* CAUSES */
        setCauses(
          (causesRes.data?.data || []).filter(
            (item) => item.status !== false
          )
        );

        /* LATEST ACTIVE EVENT */
        const activeEvent = (eventsRes.data?.data || []).find(
          (item) => item.status !== false
        );

        setEvent(activeEvent || null);
      } catch (error) {
        console.error("Failed to load homepage:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <HeroSlider />


      {/* =====================================================
          ABOUT
      ===================================================== */}

      {about && (
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="container-custom">

            <div className="grid items-center gap-10 md:grid-cols-2">

              {/* IMAGE */}

              <div>
                {about.image ? (
                  <img
                    src={`${IMAGE_URL}${about.image}`}
                    alt={about.title || "About PLC"}
                    className="h-72 w-full rounded-2xl object-cover sm:h-96"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center rounded-2xl bg-slate-100 sm:h-96">
                    <span className="text-sm text-slate-400">
                      No Image
                    </span>
                  </div>
                )}
              </div>


              {/* CONTENT */}

              <div>

                <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                  About Us
                </p>

                <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
                  {about.title}
                </h2>

                {about.description && (
                  <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base">
                    {about.description}
                  </p>
                )}

                {about.buttonText && about.buttonLink && (
                  <a
                    href={about.buttonLink}
                    className="mt-6 inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    {about.buttonText}
                  </a>
                )}

              </div>

            </div>

          </div>
        </section>
      )}


      {/* =====================================================
          WHAT WE DO
      ===================================================== */}

      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container-custom">

          {/* HEADER */}

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              What We Do
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Work
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Discover how PLC Organisation works with communities
              and partners to create positive change.
            </p>

          </div>


          {/* CARDS */}

          {cards.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {cards.map((card) => (
                <article
                  key={card._id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor:
                      card.backgroundColor || "#ffffff",
                  }}
                >

                  {/* IMAGE */}

                  {card.image ? (
                    <div className="overflow-hidden">
                      <img
                        src={`${IMAGE_URL}${card.image}`}
                        alt={card.title || "Our work"}
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-100">
                      <span className="text-sm text-slate-400">
                        No Image
                      </span>
                    </div>
                  )}


                  {/* CONTENT */}

                  <div className="p-6">

                    {card.category?.name && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {card.category.name}
                      </p>
                    )}

                    <h3 className="mt-2 text-xl font-bold text-slate-900">
                      {card.title}
                    </h3>

                    {card.description && (
                      <p className="mt-3 line-clamp-5 text-sm leading-6 text-slate-600">
                        {card.description}
                      </p>
                    )}

                    {card.buttonText && card.buttonLink && (
                      <a
                        href={card.buttonLink}
                        className="mt-5 inline-flex text-sm font-semibold text-slate-900 hover:underline"
                      >
                        {card.buttonText}
                      </a>
                    )}

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="rounded-xl bg-white p-10 text-center text-slate-500">
              No content available.
            </div>
          )}

        </div>
      </section>


      {/* =====================================================
          CAUSES
      ===================================================== */}

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-custom">

          {/* HEADER */}

          <div className="mx-auto mb-10 max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              Support
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Causes
            </h2>

            <p className="mt-4 text-sm text-slate-500">
              Support the causes that help create meaningful
              change in our communities.
            </p>

          </div>


          {/* CAUSES */}

          {causes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {causes.map((cause) => (
                <article
                  key={cause._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* IMAGE */}

                  {cause.image ? (
                    <img
                      src={`${IMAGE_URL}${cause.image}`}
                      alt={cause.title || "Cause"}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-100">
                      <span className="text-sm text-slate-400">
                        No Image
                      </span>
                    </div>
                  )}


                  {/* CONTENT */}

                  <div className="p-6">

                    <h3 className="text-xl font-bold text-slate-900">
                      {cause.title}
                    </h3>

                    {cause.description && (
                      <p className="mt-3 line-clamp-5 text-sm leading-6 text-slate-600">
                        {cause.description}
                      </p>
                    )}


                    {/* AMOUNTS */}

                    <div className="mt-5 flex justify-between border-t pt-4 text-sm">

                      <span className="text-slate-600">
                        Goal: ₹{cause.goalAmount || 0}
                      </span>

                      <span className="font-medium text-slate-900">
                        Raised: ₹{cause.raisedAmount || 0}
                      </span>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="py-10 text-center text-slate-500">
              No causes available.
            </div>
          )}

        </div>
      </section>


      {/* =====================================================
          LATEST EVENT
      ===================================================== */}

      <section className="bg-slate-50 py-16 sm:py-20 lg:py-24">
        <div className="container-custom">

          <div className="grid gap-8 lg:grid-cols-12">

            {/* LEFT CONTENT */}

            <div className="flex flex-col justify-center lg:col-span-5">

              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Activities
              </p>

              <h2 className="mt-3 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Join our upcoming events
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Stay connected with our latest events,
                activities and community initiatives.
              </p>

              <a
                href="/events"
                className="mt-8 w-fit rounded-full border border-slate-900 px-7 py-3 text-sm font-bold uppercase transition hover:bg-slate-900 hover:text-white"
              >
                Event Gallery
              </a>

            </div>


            {/* EVENT */}

            <div className="lg:col-span-7">

              {event ? (
                <article className="overflow-hidden rounded-tl-[60px] rounded-br-[60px] border border-slate-200 bg-white shadow-sm">

                  <div className="grid lg:grid-cols-5">

                    {/* IMAGE */}

                    {event.image && (
                      <div className="lg:order-2 lg:col-span-2">

                        <img
                          src={`${IMAGE_URL}${event.image}`}
                          alt={event.title || "Event"}
                          className="h-64 w-full object-cover lg:h-full"
                        />

                      </div>
                    )}


                    {/* EVENT DETAILS */}

                    <div className="p-6 sm:p-10 lg:col-span-3">

                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Latest Event
                      </p>

                      <h3 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                        {event.title}
                      </h3>


                      {event.subtitle && (
                        <p className="mt-5 text-lg font-medium text-slate-700">
                          {event.subtitle}
                        </p>
                      )}


                      {event.description && (
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                          {event.description}
                        </p>
                      )}


                      {/* DATE */}

                      {event.eventDate && (
                        <div className="mt-6 flex items-center gap-3">

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300">
                            📅
                          </span>

                          <div>
                            <p className="text-xs text-slate-400">
                              Event Date
                            </p>

                            <p className="text-sm font-medium text-slate-700">
                              {new Date(
                                event.eventDate
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                        </div>
                      )}


                      {/* LOCATION */}

                      {event.location && (
                        <div className="mt-4 flex items-center gap-3">

                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300">
                            📍
                          </span>

                          <div>
                            <p className="text-xs text-slate-400">
                              Location
                            </p>

                            <p className="text-sm font-medium text-slate-700">
                              {event.location}
                            </p>
                          </div>

                        </div>
                      )}


                      {/* BUTTON */}

                      {event.buttonText && event.buttonLink && (
                        <a
                          href={event.buttonLink}
                          className="mt-7 inline-flex rounded-full border border-slate-900 px-7 py-3 text-sm font-bold uppercase transition hover:bg-slate-900 hover:text-white"
                        >
                          {event.buttonText}
                        </a>
                      )}

                    </div>

                  </div>

                </article>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
                  <p className="text-slate-500">
                    No active events available.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;