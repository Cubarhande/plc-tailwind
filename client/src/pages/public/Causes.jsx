import { useEffect, useState } from "react";

import API from "../../services/api";

const IMAGE_URL =
  import.meta.env.VITE_IMAGE_URL;

const Causes = () => {
  const [causes, setCauses] =
    useState([]);

  useEffect(() => {
    API.get("/causes")
      .then((response) =>
        setCauses(
          response.data.data || []
        )
      )
      .catch(console.error);
  }, []);

  return (
    <section className="py-20">

      <div className="container-custom">

        <div className="mb-10 text-center">

          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Support Us
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Our Causes
          </h1>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {causes
            .filter((cause) => cause.status)
            .map((cause) => {

              const percentage =
                cause.goalAmount > 0
                  ? Math.min(
                      100,
                      (cause.raisedAmount /
                        cause.goalAmount) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={cause._id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm"
                >

                  {cause.image && (
                    <img
                      src={`${IMAGE_URL}${cause.image}`}
                      alt={cause.title}
                      className="h-52 w-full object-cover"
                    />
                  )}

                  <div className="p-6">

                    <h2 className="text-xl font-bold">
                      {cause.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {cause.description}
                    </p>

                    <div className="mt-5">

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className="h-full bg-slate-900"
                          style={{
                            width:
                              `${percentage}%`
                          }}
                        />

                      </div>

                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>
                          ₹
                          {cause.raisedAmount}
                          {" "}raised
                        </span>

                        <span>
                          Goal ₹
                          {cause.goalAmount}
                        </span>
                      </div>

                    </div>

                    {cause.buttonText && (
                      <a
                        href={
                          cause.buttonLink ||
                          "#"
                        }
                        className="mt-5 block rounded-lg bg-slate-900 py-3 text-center font-semibold text-white"
                      >
                        {cause.buttonText}
                      </a>
                    )}

                  </div>

                </div>
              );
            })}

        </div>

      </div>

    </section>
  );
};

export default Causes;