import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://localhost:5000";

// =====================================================
// CREATE URL SLUG
// =====================================================

const createSlug = (name) => {
  return name
    ?.toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

const About = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [about, setAbout] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  // =====================================================
  // LOAD ABOUT + CATEGORIES + CARDS
  // =====================================================

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

        setAbout(aboutResponse.data?.data || null);

        setCategories(
          categoryResponse.data?.data || []
        );

        setCards(
          cardResponse.data?.data || []
        );
      } catch (error) {
        console.error(
          "Failed to load About page:",
          error
        );
      }
    };

    load();
  }, []);

  // =====================================================
  // SELECT CATEGORY FROM URL
  // =====================================================

  useEffect(() => {
    if (categories.length === 0) return;

    const categoryFromUrl =
      searchParams.get("category");

    // Find category using slug
    const selectedCategory = categories.find(
      (category) =>
        createSlug(category.name) ===
        categoryFromUrl
    );

    if (selectedCategory) {
      setActiveCategory(
        selectedCategory._id
      );
    } else {
      // Default first category
      const firstCategory = categories[0];

      setActiveCategory(firstCategory._id);

      setSearchParams(
        {
          category: createSlug(
            firstCategory.name
          ),
        },
        {
          replace: true,
        }
      );
    }
  }, [
    categories,
    searchParams,
    setSearchParams,
  ]);

  // =====================================================
  // CHANGE CATEGORY
  // =====================================================

  const handleCategoryChange = (categoryId) => {
    const category = categories.find(
      (item) => item._id === categoryId
    );

    if (!category) return;

    setActiveCategory(categoryId);

    setSearchParams(
      {
        category: createSlug(category.name),
      },
      {
        replace: true,
      }
    );
  };

  // =====================================================
  // ACTIVE CATEGORY
  // =====================================================

  const activeCategoryData = categories.find(
    (category) =>
      category._id === activeCategory
  );

  // =====================================================
  // ACTIVE CARDS
  // =====================================================

  const activeCards = cards.filter((card) => {
    const cardCategoryId =
      card.category?._id || card.category;

    return (
      cardCategoryId === activeCategory &&
      card.status !== false
    );
  });

  // =====================================================
  // LOADING
  // =====================================================

  if (!about) {
    return (
      <div
        className="
          min-h-[50vh]
          bg-white
          px-4
          py-20
          text-slate-900
          dark:bg-slate-950
          dark:text-white
        "
      >
        <div className="container-custom">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        text-slate-900
        transition-colors
        dark:bg-slate-950
        dark:text-white
      "
    >
      {/* =====================================================
          ABOUT INTRO
      ===================================================== */}

      <section
        className="
          py-16
          dark:bg-slate-950
          md:py-20
        "
      >
        <div
          className="
            container-custom
            grid
            items-center
            gap-10
            md:grid-cols-2
          "
        >
          {/* IMAGE */}

          {about.image && (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={`${IMAGE_URL}${about.image}`}
                alt={about.title || "About PLC"}
                loading="lazy"
                className="
                  h-[350px]
                  w-full
                  rounded-2xl
                  object-cover
                  shadow-md
                  transition
                  duration-500
                  hover:scale-[1.02]
                  md:h-[450px]
                "
              />
            </div>
          )}

          {/* CONTENT */}

          <div>
            <p
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.2em]
                text-slate-500
                dark:text-slate-400
              "
            >
              <span
                className="
                  inline-flex
                  rounded-full
                  bg-yellow-100
                  px-3
                  py-1
                  text-yellow-700
                  dark:bg-yellow-400/10
                  dark:text-yellow-400
                "
              >
                About PLC
              </span>
            </p>

            <h1
              className="
                mt-4
                text-3xl
                font-bold
                tracking-tight
                text-slate-900
                dark:text-white
                md:text-4xl
              "
            >
              {about.title}
            </h1>

            <p
              className="
                mt-6
                whitespace-pre-line
                text-base
                leading-8
                text-slate-600
                dark:text-slate-400
              "
            >
              {about.description}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT CATEGORIES
      ===================================================== */}

      {categories.length > 0 && (
        <section
          className="
            border-t
            border-slate-100
            bg-slate-50
            py-16
            dark:border-slate-900
            dark:bg-slate-900/50
            md:py-20
          "
        >
          <div className="container-custom">

            {/* =================================================
                HEADER
            ================================================= */}

            <div
              className="
                mx-auto
                mb-10
                max-w-3xl
                text-center
              "
            >
              <p
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-slate-500
                  dark:text-slate-400
                "
              >
                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-yellow-100
                    px-3
                    py-1
                    text-yellow-700
                    dark:bg-yellow-400/10
                    dark:text-yellow-400
                  "
                >
                  Learn More
                </span>
              </p>

              <h2
                className="
                  mt-4
                  text-3xl
                  font-bold
                  tracking-tight
                  text-slate-900
                  dark:text-white
                  md:text-4xl
                "
              >
                About Our Organisation
              </h2>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-2xl
                  text-slate-600
                  dark:text-slate-400
                "
              >
                Learn more about our organisation,
                our work, and the difference we aim
                to make.
              </p>
            </div>

            {/* =================================================
                CATEGORY TABS
            ================================================= */}

            <div
              className="
                mb-10
                flex
                flex-wrap
                justify-center
                gap-2
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-2
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() =>
                    handleCategoryChange(
                      category._id
                    )
                  }
                  className={`
                    rounded-lg
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      activeCategory ===
                      category._id
                        ? `
                          bg-slate-900
                          text-white
                          shadow-lg
                          dark:bg-yellow-400
                          dark:text-slate-950
                        `
                        : `
                          text-slate-600
                          hover:bg-slate-100
                          hover:text-slate-900
                          dark:text-slate-400
                          dark:hover:bg-slate-800
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* =================================================
                ACTIVE CATEGORY
            ================================================= */}

            {activeCategoryData && (
              <div
                className="
                  rounded-2xl
                  p-6
                  transition-colors
                  dark:bg-slate-900
                "
              >
                <h3
                  className="
                    text-2xl
                    font-bold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {activeCategoryData.name}
                </h3>

                {activeCategoryData.description && (
                  <p
                    className="
                      mt-3
                      max-w-3xl
                      leading-7
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {activeCategoryData.description}
                  </p>
                )}
              </div>
            )}

            {/* =================================================
                CARDS
            ================================================= */}

            {activeCards.length > 0 ? (
              <div
                className="
                  mt-8
                  grid
                  gap-6
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {activeCards.map((card) => (
                  <div
                    key={card._id}
                    className="
                      group
                      overflow-hidden
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-xl
                      dark:border-slate-800
                      dark:bg-slate-900
                    "
                  >
                    {/* IMAGE */}

                    {card.image && (
                      <div className="overflow-hidden">
                        <img
                          src={`${IMAGE_URL}${card.image}`}
                          alt={
                            card.title ||
                            "About PLC"
                          }
                          loading="lazy"
                          className="
                            h-52
                            w-full
                            object-cover
                            transition
                            duration-500
                            group-hover:scale-105
                          "
                        />
                      </div>
                    )}

                    {/* CONTENT */}

                    <div className="p-6">
                      <h3
                        className="
                          text-xl
                          font-semibold
                          text-slate-900
                          dark:text-white
                        "
                      >
                        {card.title}
                      </h3>

                      {card.description && (
                        <p
                          className="
                            mt-3
                            text-sm
                            leading-7
                            text-slate-600
                            dark:text-slate-400
                          "
                        >
                          {card.description}
                        </p>
                      )}

                      {card.buttonText && (
                        <a
                          href={
                            card.buttonLink || "#"
                          }
                          className="
                            mt-5
                            inline-flex
                            items-center
                            rounded-lg
                            bg-slate-900
                            px-5
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-slate-800
                            dark:bg-white
                            dark:text-slate-900
                            dark:hover:bg-slate-100
                          "
                        >
                          {card.buttonText}

                          <span
                            className="
                              ml-2
                              transition-transform
                              duration-200
                              group-hover:translate-x-1
                            "
                          >
                            →
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-white
                  px-6
                  py-12
                  text-center
                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  No active cards available for
                  this category.
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