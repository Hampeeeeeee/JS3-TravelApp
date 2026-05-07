import LoadSpinner from "@/components/loadspinner";
import type { Country } from "@/components/types/Country";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import "/src/components/startQuizBtn.css";
import { QuizTimer } from "@/components/hooks/quizTimer";
import { Button } from "@/components/ui/button";

// Fetching of flags
export default function Flagged() {
  const { timeLeft, setIsRunning, formatTime } = QuizTimer(20 * 60);
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
        <div>
          <h1 className="text-3xl font-bold text-glow">
            Flagged! Welcome to the flag quiz!
          </h1>
          <h3 className="text-xl mt-4 text-glow">
            You will be given 20 minutes to identify as many flags as possible.
            Good luck!
          </h3>
        </div>
        <Button
          className="startQuizBtn rounded border text-2xl font-bold border-glow"
          onClick={() => setIsRunning(true)}
        >
          Start Quiz
        </Button>
      </div>
      {isLoading && <LoadSpinner className="mx-auto mt-10" />}
      {isError && (
        <p className="text-center mt-10 text-primary">
          {(error as Error).message}
        </p>
      )}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between space-x-20 mb-12 font-bold text-glow">
            <div>
              <form className="flex items-center space-x-2 text-2xl">
                <label className="mr-2">Enter flag name:</label>
                <input
                  type="text"
                  className="bg-primary border rounded border-blue-400"
                />
              </form>
            </div>
            <div className="flex items-center space-x-20">
              <p>
                Score:{" "}
                <h3 className="text-3xl mb-5"> 0 / {independentCountries.length}</h3>
              </p>
              <h1>
                Timer:
                <h3 className="text-3xl">{formatTime(timeLeft)}</h3>
                <h5
                  className="text-sm underline hover:cursor-pointer"
                  onClick={() => setIsRunning(false)}
                >
                  Give up
                </h5>
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {independentCountries.map((country) => (
              <div
                key={country.name.common}
                className="flex flex-col items-center"
              >
                <p className="font-bold mb-2 w-full truncate">
                  {country.name.common}
                </p>
                <img
                  src={encodeURI(
                    country.flags?.svg || country.flags?.png || "",
                  )}
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
