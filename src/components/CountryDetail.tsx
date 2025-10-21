import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { Country } from "./types/Country";
import LoadSpinner from "./loadspinner";


export default function CountryDetail({ cca3 }: { cca3: string }) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
            cca3
          )}?fields=name,capital,cca3,region,subregion,population,flags,tld,currencies,languages`
        );
        if (!res.ok) throw new Error("Country not found");
        const data = await res.json();
        // API returns an array for this endpoint
        const c = Array.isArray(data) ? data[0] : data;
        if (!cancelled) setCountry(c ?? null);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [cca3]);

  if (loading) return <p className="p-4 text-center"><LoadSpinner /></p>;
  if (error) return <p className="p-4 text-center text-primary">{error}</p>;
  if (!country)
    return <p className="p-4 text-center text-foreground">No country selected.</p>;

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "—";
  const currency = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`)
        .join(", ")
    : "—";

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{country.name.common}</h1>
        <div>
          <Button
            className="bg-primary/50 hover:scale-[1.05] cursor-pointer text-foreground"
            onClick={() => {
              // go back in history, or fallback to root
              if (window.history.length > 1) window.history.back();
              else {
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }
            }}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <div className="md:col-span-1">
          <img
            src={country.flags?.png || country.flags?.svg}
            alt={country.flags?.alt || `${country.name.common} flag`}
            className="w-full rounded border object-cover"
            loading="lazy"
          />
        </div>

        <div className="md:col-span-2 space-y-2 text-sm text-foreground">
          <p>
            <strong>Official name:</strong> {country.name.official ?? "—"}
          </p>
          <p>
            <strong>Region:</strong> {country.region ?? "—"}{" "}
            {country.subregion ? `· ${country.subregion}` : ""}
          </p>
          <p>
            <strong>Capital:</strong> {country.capital?.[0] ?? "—"}
          </p>
          <p>
            <strong>Population:</strong>{" "}
            {country.population?.toLocaleString() ?? "—"}
          </p>
          <p>
            <strong>Top-level domain:</strong> {country.tld?.join(", ") ?? "—"}
          </p>
          <p>
            <strong>Languages:</strong> {languages}
          </p>
          <p>
            <strong>Currencies:</strong> {currency}
          </p>
        </div>
      </div>
    </div>
  );
}