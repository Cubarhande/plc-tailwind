import { useEffect, useState } from "react";
import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "http://localhost:5000";

const WhatWeDo = () => {
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryResponse, cardResponse] =
          await Promise.all([
            API.get("/categories"),
            API.get("/cards?limit=100"),
          ]);

        const categoryData =
          categoryResponse.data.data || [];

        setCategories(categoryData);

        setCards(
          cardResponse.data.data || []
        );

        // First category active by default
        if (categoryData.length > 0) {
          setActiveCategory(
            categoryData[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Failed to load What We Do:",
          error
        );
      }
    };

    load();
  }, []);

  const selectedCategory = categories.find(
    (category) =>
      category._id === activeCategory
  );

  const categoryCards = cards.filter(
    (card) =>
      card.category?._id ===
        activeCategory &&
      card.status
  );

  return (
    <div className="bg-slate-50 py-16 md:py-20">

      <div className="container-custom">

        {/* ================= HEADER ================= */}

        <div className="mx-auto mb-10 max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Our Work
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            What We Do
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-500 md:text-base">
            Explore the different areas where
            PLC Organisation works to create
            positive change.
          </p>

        </div>

        {/* ================= TAB BUTTONS ================= */}

        {categories.length > 0 && (
          <div className="mb-10">

            <div className="flex flex-wrap justify-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() =>
                    setActiveCategory(
                      category._id
                    )
                  }
                  className={`rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                    activeCategory ===
                    category._id
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {category.name}
                </button>
              ))}

            </div>

          </div>
        )}

        {/* ================= ACTIVE CATEGORY ================= */}

        {selectedCategory && (
          <section>

            {/* CATEGORY TITLE */}

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                {selectedCategory.name}
              </h2>

              {selectedCategory.description && (
                <p className="mt-2 max-w-3xl leading-7 text-slate-500">
                  {selectedCategory.description}
                </p>
              )}

            </div>

            {/* ================= CARDS ================= */}

            {categoryCards.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                {categoryCards.map((card) => (
                  <div
                    key={card._id}
                    className="group overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      backgroundColor:
                        card.backgroundColor ||
                        "#ffffff",
                    }}
                  >

                    {/* IMAGE */}

                    {card.image && (
                      <div className="overflow-hidden">

                        <img
                          src={`${IMAGE_URL}${card.image}`}
                          alt={
                            card.title ||
                            "What We Do"
                          }
                          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="p-6">

                      <h3 className="text-xl font-semibold text-slate-900">
                        {card.title}
                      </h3>

                      {card.description && (
                        <p className="mt-3 text-sm leading-7 line-clamp-6 text-slate-600">
                          {card.description}
                        </p>
                      )}

                      {/* BUTTON */}

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
                ))}

              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">

                <p className="text-sm text-slate-500">
                  No active cards available
                  for this category.
                </p>

              </div>
            )}

          </section>
        )}

        {/* ================= NO CATEGORY ================= */}

        {categories.length === 0 && (
          <div className="rounded-xl bg-white px-6 py-12 text-center shadow-sm">

            <p className="text-slate-500">
              No categories available.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default WhatWeDo;