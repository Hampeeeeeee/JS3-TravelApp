import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadSpinner from "./loadspinner";
import { Button } from "./ui/button";

type Country = {
  name: { common: string };
  capital: string[];
  cca3: string;
  region: string;
  population?: number;
  flags: { png?: string; svg?: string; alt?: string };
};

const PAGE_SIZE = 14;

export default function CountriesPagination() {
  const [page, setPage] = useState(1);

  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,cca3,region,population,flags"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await res.json();

      return data;
    },
  });

  const total = countries!.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const CountriesSliced = countries!.slice(start, start + PAGE_SIZE);

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
          Länder <span className="text-foreground">({total})</span>
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
                <div className="text-xs">{country.capital[0]}</div>
                <div className="text-xs text-foreground">
                  {country.region ?? "—"} ·{" "}
                  {country.population?.toLocaleString() ?? "—"}
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" className="mt-2 bg-primary/50 hover:scale-[1.05] cursor-pointer" aria-label={`Läs mer om ${country.name.common}`}>
                  Läs mer
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Föregående sida"
          >
            ← Föregående
          </button>
          <span className="text-sm text-foreground">
            Sida {page} / {totalPages}
          </span>
          <button
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Nästa sida"
          >
            Nästa →
          </button>
        </div>
      </div>
    </>
  );
}
