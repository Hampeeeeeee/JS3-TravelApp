import LoadSpinner from "@/components/loadspinner";
import type { Country } from "@/components/types/Country";
import { useQuery } from "@tanstack/react-query";

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

  const independentCountries = countries.filter((c) => c.independent === true);

  return (
    <section className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-32">
        Flagged! Welcome to the flag quiz!
      </h1>
      {isLoading && <LoadSpinner className="mx-auto mt-10" />}
      {isError && (
        <p className="text-center mt-10 text-primary">
          {(error as Error).message}
        </p>
      )}
      {!isLoading && !isError && (
        <div className="grid grid-cols-4 gap-4">
          {independentCountries.map((country) => (
            <div
              key={country.name.common}
              className="flex flex-col items-center"
            >
              <img
                src={encodeURI(country.flags?.svg || country.flags?.png || "")}
                alt={country.name.common}
                className="w-full h-32 object-cover rounded border border-blue-400"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
