import { useEffect, useState } from "react";

import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "http://localhost:5000";

const About = () => {
  const [about, setAbout] = useState(null);

  const [categories, setCategories] =
    useState([]);

  const [cards, setCards] =
    useState([]);

  const [activeCategory, setActiveCategory] =
    useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [
          aboutResponse,
          categoryResponse,
          cardResponse,
        ] = await Promise.all([
          API.get("/about"),
          API.get("/about-categories"),
          API.get("/about-cards?limit=100"),
        ]);

        setAbout(
          aboutResponse.data.data
        );

        const categoryData =
          categoryResponse.data.data || [];

        setCategories(categoryData);

        setCards(
          cardResponse.data.data || []
        );

        if (categoryData.length > 0) {
          setActiveCategory(
            categoryData[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Failed to load About page:",
          error
        );
      }
    };

    load();
  }, []);

  if (!about) {
    return (
      <div className="container-custom py-20">
        Loading...
      </div>
    );
  }

  const activeCards = cards.filter(
    (card) =>
      card.category?._id ===
        activeCategory &&
      card.status
  );

  const activeCategoryData =
    categories.find(
      (category) =>
        category._id === activeCategory
    );

  return (
    <div>

      {/* ================= ABOUT INTRO ================= */}

      <section className="py-16 md:py-20">

        <div className="container-custom grid items-center gap-10 md:grid-cols-2">

          {about.image && (
            <img
              src={`${IMAGE_URL}${about.image}`}
              alt={about.title}
              className="h-[350px] w-full rounded-2xl object-cover md:h-[450px]"
            />
          )}

          <div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              About PLC
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              {about.title}
            </h1>

            <p className="mt-6 whitespace-pre-line leading-8 text-slate-600">
              {about.description}
            </p>

          </div>

        </div>

      </section>

      {/* ================= ABOUT CATEGORIES ================= */}

      {categories.length > 0 && (
        <section className="bg-slate-50 py-16 md:py-20">

          <div className="container-custom">

            {/* HEADER */}

            <div className="mx-auto mb-10 max-w-3xl text-center">

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Learn More
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                About Our Organisation
              </h2>

            </div>

            {/* TABS */}

            <div className="mb-10 flex flex-wrap justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

              {categories.map(
                (category) => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() =>
                      setActiveCategory(
                        category._id
                      )
                    }
                    className={`rounded-lg px-5 py-3 text-sm font-semibold transition ${
                      activeCategory ===
                      category._id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {category.name}
                  </button>
                )
              )}

            </div>

            {/* ACTIVE CATEGORY */}

            {activeCategoryData && (
              <div>

                <h3 className="text-2xl font-bold text-slate-900">
                  {activeCategoryData.name}
                </h3>

                {activeCategoryData.description && (
                  <p className="mt-2 max-w-3xl text-slate-500">
                    {
                      activeCategoryData.description
                    }
                  </p>
                )}

              </div>
            )}

            {/* CARDS */}

            {activeCards.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {activeCards.map(
                  (card) => (
                    <div
                      key={card._id}
                      className="group overflow-hidden rounded-xl border border-slate-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      style={{
                        backgroundColor:
                          card.backgroundColor ||
                          "#ffffff",
                      }}
                    >

                      {card.image && (
                        <div className="overflow-hidden">

                          <img
                            src={`${IMAGE_URL}${card.image}`}
                            alt={card.title}
                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                        </div>
                      )}

                      <div className="p-6">

                        <h3 className="text-xl font-semibold text-slate-900">
                          {card.title}
                        </h3>

                        {card.description && (
                          <p className="mt-3 text-sm leading-7 text-slate-600">
                            {card.description}
                          </p>
                        )}

                        {card.buttonText && (
                          <a
                            href={
                              card.buttonLink ||
                              "#"
                            }
                            className="mt-5 inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                          >
                            {card.buttonText}

                            <span className="ml-2">
                              →
                            </span>
                          </a>
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

                <p className="text-sm text-slate-500">
                  No active cards available
                  for this category.
                </p>

              </div>
            )}

          </div>

        </section>
      )}

    </div>
  );
};

export default About;