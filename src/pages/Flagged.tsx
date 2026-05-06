import LoadSpinner from "@/components/loadspinner";
import type { Country } from "@/components/types/Country";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import "./startQuizBtn.css";
import { Link } from "react-router";

// Fetching of flags
export default function Flagged() {
  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery<Country[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,flags,independent",
      );
      if (!res.ok) {
        throw new Error("Failed to fetch countries");
      }
      const data = await res.json();
      return data as Country[];
    },
  });

  // Variable to hold independent countries and randomize their positions
  const independentCountries = useMemo(() => {
    return countries
      .filter((c) => c.independent === true)
      .sort(() => Math.random() - 0.5);
  }, [countries]);

  // Rendered component
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-32">
      <h1 className="text-3xl font-bold text-glow">
        Flagged! Welcome to the flag quiz!
      </h1>
      <Link to="/quiz" className="startQuizBtn rounded border text-2xl font-bold border-glow">
        Start Quiz
      </Link>
      </div>
      {isLoading && <LoadSpinner className="mx-auto mt-10" />}
      {isError && (
        <p className="text-center mt-10 text-primary">
          {(error as Error).message}
        </p>
      )}
      {!isLoading && !isError && (
        <>
        <span></span>
        <div className="grid grid-cols-4 gap-4">
          {independentCountries.map((country) => (
            <div
            key={country.name.common}
            className="flex flex-col items-center"
            >
              <p className="font-bold mb-2 w-full truncate">{country.name.common}</p>
              <img
                src={encodeURI(country.flags?.svg || country.flags?.png || "")}
                alt={country.name.common}
                className="w-full h-38 object-cover rounded border border-blue-400"
                loading="lazy"
                />
            </div>
          ))}
        </div>
        </>
      )}
    </section>
  );
}
