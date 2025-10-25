import { useQuery } from "@tanstack/react-query";
import LoadSpinner from "./loadspinner";
import { Button } from "./ui/button";
import { useUrlParams } from "./hooks/useUrlParams";
import type { Country } from "./types/Country";

export default function CountriesPagination() {
  const [params, setParams] = useUrlParams();
  const page = params.page;
  const pageSize = params.pageSize;
  const selectedContinent = params.region ?? "All";
  const query = (params.query ?? "").trim().toLowerCase();

  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,cca3,region,subregion,population,flags"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await res.json();
      return data as Country[];
    },
  });

  const filtered = countries.filter((c) => {
    // continent filtering
    let regionMatch = true;
    if (selectedContinent && selectedContinent !== "All") {
      if (selectedContinent === "North America") {
        regionMatch = c.region === "Americas" && c.subregion !== "South America";
      } else if (selectedContinent === "South America") {
        regionMatch = c.region === "Americas" && c.subregion === "South America";
      } else if (selectedContinent === "Antarctic" || selectedContinent === "Antarctica") {
        regionMatch = c.region === "Antarctic" || c.region === "Antarctica";
      } else {
        regionMatch = c.region === selectedContinent;
      }
    }

    if (!regionMatch) return false;

    // name / query filtering (case-insensitive contains)
    if (!query) return true;
    return (c.name?.common ?? "").toLowerCase().includes(query);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // clamp page if it's out of bounds
  if (page > totalPages) {
    setParams({ page: totalPages });
  }

  const start = (page - 1) * pageSize;
  const CountriesSliced = filtered.slice(start, start + pageSize);

  return (
    <>
      {isLoading && <LoadSpinner className="mx-auto mt-10" />}
      {isError && (
        <p className="text-center mt-10 text-primary">
          {(error as Error).message}
        </p>
      )}

      <div className="mx-auto max-w-3xl p-4">
        <h2 className="mb-3 text-xl font-semibold">
          Countries <span className="text-primary">({total})</span>
        </h2>

        {total === 0 ? (
          <p className="text-center mt-6 text-foreground">No countries match your criteria, try again!</p>
        ) : (
          <ul className="divide-y divide-primary">
            {CountriesSliced.map((country) => (
              <li key={country.cca3} className="flex items-center gap-3 py-3">
                <img
                  src={country.flags?.png || country.flags?.svg}
                  alt={country.flags?.alt || `${country.name.common} flag`}
                  className="h-8 w-12 rounded border object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{country.name.common}</div>
                  <div className="text-xs">{country.capital?.[0] ?? "—"}</div>
                  <div className="text-xs text-foreground">
                    {country.region ?? "—"} · {country.population?.toLocaleString() ?? "—"}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <Button
                    variant="outline"
                    className="mt-2 bg-primary/50 hover:scale-[1.05] cursor-pointer"
                    aria-label={`Read more about ${country.name.common}`}
                    onClick={() => {
                      const newPath = `/country/${country.cca3}`;
                      window.history.pushState({}, "", newPath);
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }}
                  >
                    More
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {total > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => setParams({ page: Math.max(1, page - 1) })}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ← Previous
            </button>
            <span className="text-sm text-foreground">
              Page {page} / {totalPages}
            </span>
            <button
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
              onClick={() => setParams({ page: Math.min(totalPages, page + 1) })}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </>
  );
}