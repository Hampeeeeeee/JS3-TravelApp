import { useQuery } from "@tanstack/react-query";
import LoadSpinner from "./loadspinner";
import { Button } from "./ui/button";
import { useUrlParams } from "./hooks/useUrlParams";

type Country = {
  name: { common: string };
  capital: string[];
  cca3: string;
  region: string;
  subregion?: string;
  population?: number;
  flags: { png?: string; svg?: string; alt?: string };
};

export default function CountriesPagination() {
  const [params, setParams] = useUrlParams();
  const page = params.page;
  const pageSize = params.pageSize;
  const selectedContinent = params.region ?? "All";

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
    if (!selectedContinent || selectedContinent === "All") return true;
    if (selectedContinent === "North America") {
      return c.region === "Americas" && c.subregion !== "South America";
    }
    if (selectedContinent === "South America") {
      return c.region === "Americas" && c.subregion === "South America";
    }
    if (selectedContinent === "Antarctic" || selectedContinent === "Antarctica") {
      return c.region === "Antarctic" || c.region === "Antarctica";
    }
    return c.region === selectedContinent;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // clamp page if it's out of bounds
  if (page > totalPages) {
    // update URL to last page (avoid infinite loop - setParams will dispatch popstate and update params)
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
                  {country.region ?? "—"} ·{" "}
                  {country.population?.toLocaleString() ?? "—"}
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
      </div>
    </>
  );
}