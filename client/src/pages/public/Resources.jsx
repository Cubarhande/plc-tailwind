import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import API from "../../services/api";
import Partners from "./Partners";

const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // =====================================================
  // CREATE CATEGORY SLUG
  // "Community Development" -> "community-development"
  // =====================================================

  const createSlug = (name = "") => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/-+/g, "-");
  };

  // =====================================================
  // LOAD RESOURCES
  // =====================================================

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryResponse, cardResponse] =
          await Promise.all([
            API.get("/resource-categories"),
            API.get("/resource-cards?limit=100"),
          ]);

        setCategories(categoryResponse.data?.data || []);
        setCards(cardResponse.data?.data || []);
      } catch (error) {
        console.error("Failed to load Resources:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // =====================================================
  // SELECT CATEGORY FROM URL
  // =====================================================

  useEffect(() => {
    if (categories.length === 0) return;

    const categoryFromUrl = searchParams.get("category");

    // Find category by slug
    const selectedCategory = categories.find(
      (category) =>
        createSlug(category.name) === categoryFromUrl
    );

    if (selectedCategory) {
      // URL category found
      setActiveCategory(selectedCategory._id);
    } else {
      // No valid category in URL
      const firstCategory = categories[0];

      setActiveCategory(firstCategory._id);

      // Set first category name as URL slug
      setSearchParams(
        {
          category: createSlug(firstCategory.name),
        },
        {
          replace: true,
        }
      );
    }
  }, [categories, searchParams, setSearchParams]);

  // =====================================================
  // SELECTED CATEGORY
  // =====================================================

  const selectedCategory = categories.find(
    (category) => category._id === activeCategory
  );

  // =====================================================
  // CATEGORY CARDS
  // =====================================================

  const categoryCards = cards.filter((card) => {
    const categoryId =
      card.category?._id || card.category;

    return (
      categoryId === activeCategory &&
      card.status !== false
    );
  });

  // =====================================================
  // CHANGE CATEGORY
  // =====================================================

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(
      (item) => item._id === categoryId
    );

    if (!category) return;

    setActiveCategory(categoryId);

    // URL uses category name instead of ID
    setSearchParams({
      category: createSlug(category.name),
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <section className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <BookOpen
              size={36}
              className="mx-auto animate-pulse text-yellow-500"
            />

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading resources...
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50 py-16 transition-colors duration-300 sm:py-20 lg:py-24 dark:border-white/5 dark:bg-slate-950">

        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="container-custom relative">
          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-50 text-yellow-600 shadow-sm dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
              <BookOpen size={26} />
            </div>

            <span className="mt-6 inline-flex rounded-full border border-yellow-400/30 bg-yellow-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-700 dark:border-yellow-400/20 dark:bg-yellow-400/10 dark:text-yellow-400">
              Resources
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
              {selectedCategory?.name || "Helpful Resources"}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
              Explore our collection of useful information, guides and
              resources designed to help communities and partners.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="bg-white py-12 transition-colors duration-300 sm:py-16 lg:py-20 dark:bg-slate-950">
        <div className="container-custom">

          {/* =================================================
              CATEGORY TABS
          ================================================= */}

          {categories.length > 0 && (
            <div className="mb-12">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:shadow-xl">

                <div className="flex min-w-max justify-center gap-2">

                  {categories.map((category) => {
                    const isActive =
                      activeCategory === category._id;

                    return (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() =>
                          handleCategoryChange(category._id)
                        }
                        className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-slate-900 text-white shadow-lg dark:bg-yellow-400 dark:text-slate-950"
                            : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                        }`}
                      >
                        {category.name}
                      </button>
                    );
                  })}

                </div>
              </div>
            </div>
          )}

          {/* =================================================
              ACTIVE CATEGORY
          ================================================= */}

          {selectedCategory && (
            <section>

              <div className="mb-10 max-w-3xl">

                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {selectedCategory.name}
                </h2>

                {selectedCategory.description && (
                  <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                    {selectedCategory.description}
                  </p>
                )}

              </div>

              {/* =================================================
                  RESOURCE CARDS
              ================================================= */}

              {categoryCards.length > 0 ? (

                <div className="grid gap-6">

                  {categoryCards.map((card) => (

                    <article
                      key={card._id}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/40 hover:shadow-xl sm:p-8 dark:border-white/10 dark:bg-slate-900 dark:shadow-xl dark:hover:border-yellow-400/30"
                    >

                      {/* LEFT ACCENT */}

                      <div className="absolute left-0 top-0 h-full w-1   opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                      <div className="min-w-0">

                        {/* TITLE */}

                        <h3 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                          {card.title}
                        </h3>

                        {/* NUMBER LIST */}

                        {card.listType === "number" &&
                          card.listItems?.length > 0 && (
                            <ol className="mt-6 list-decimal space-y-3 pl-6 text-sm leading-7 text-slate-600 marker:font-semibold marker:text-yellow-600 dark:text-slate-400 dark:marker:text-yellow-400">
                              {card.listItems.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ol>
                          )}

                        {/* BULLET LIST */}

                        {card.listType === "bullet" &&
                          card.listItems?.length > 0 && (
                            <ul className="mt-6 list-disc space-y-3 pl-6 text-sm leading-7 text-slate-600 marker:text-yellow-600 dark:text-slate-400 dark:marker:text-yellow-400">
                              {card.listItems.map(
                                (item, index) => (
                                  <li key={index}>
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                        {/* DESCRIPTION */}

                        {card.listType === "none" &&
                          card.description && (
                            <div className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
                              {card.description}
                            </div>
                          )}

                      </div>
                    </article>

                  ))}

                </div>

              ) : (

                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-white/10 dark:bg-slate-900">

                  <BookOpen
                    size={32}
                    className="mx-auto text-slate-400 dark:text-slate-600"
                  />

                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
                    No resources available for this category.
                  </p>

                </div>

              )}

            </section>
          )}

          {/* =================================================
              NO CATEGORIES
          ================================================= */}

          {categories.length === 0 && (

            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">

              <BookOpen
                size={32}
                className="mx-auto text-slate-400 dark:text-slate-600"
              />

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
                No categories available.
              </p>

            </div>

          )}

        </div>
      </section>

      {/* =====================================================
          PARTNERS
      ===================================================== */}

      <div className="border-t border-slate-200 bg-white dark:border-white/5 dark:bg-slate-950">
        <Partners />
      </div>

    </main>
  );
};

export default Resources; 