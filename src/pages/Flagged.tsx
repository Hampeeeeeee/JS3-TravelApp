import LoadSpinner from "@/components/loadspinner";
import type { Country } from "@/components/types/Country";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import "/src/components/startQuizBtn.css";
import { QuizTimer } from "@/components/hooks/quizTimer";
import { Button } from "@/components/ui/button";

// Fetching of flags
export default function Flagged() {
  const { timeLeft, setIsRunning, formatTime, resetTimer } = QuizTimer(20 * 60);
  const [quizStarted, setQuizStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shuffleCountries, setShuffleCountries] = useState(0);
  const [showFlag, setShowFlag] = useState(false);
  const [currentFlagIndex, setCurrentFlagIndex] = useState(0);
  const [guessedFlags, setGuessedFlags] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);

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

  const independentCountries = useMemo(() => {
    void shuffleCountries;
    return countries
      .filter((c) => c.independent === true)
      .sort(() => Math.random() - 0.5);
  }, [countries, shuffleCountries]);

  const remainingFlags = useMemo(() => {
    return independentCountries.filter(
      (c) => !guessedFlags.includes(c.name.common),
    );
  }, [independentCountries, guessedFlags]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const correctFlag = remainingFlags[currentFlagIndex]?.name?.common;
    if (value.toLowerCase() === correctFlag?.toLowerCase()) {
      setGuessedFlags((prev) => [...prev, correctFlag]);
      setScore((prev) => prev + 1);
      setResult("correct");
      setInputValue("");
      setTimeout(() => setResult(null), 500);
    }
  };
  
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
        {(!quizStarted || gameOver) && (
          <Button
            className="startQuizBtn rounded border text-2xl font-bold border-glow"
            onClick={() => {
              resetTimer();
              setShuffleCountries((prev) => prev + 1);
              setCurrentFlagIndex(0);
              setGuessedFlags([]);
              setScore(0);
              setIsRunning(true);
              setQuizStarted(true);
              setGameOver(false);
              setShowFlag(true);
            }}
          >
            {gameOver ? "Play again" : "Start Quiz"}
          </Button>
        )}
      </div>
      {isLoading && <LoadSpinner className="mx-auto mt-10" />}
      {isError && (
        <p className="text-center mt-10 text-primary">
          {(error as Error).message}
        </p>
      )}
      {!isLoading && !isError && (
        <>
          <div className="flex items-center justify-between gap-8 mb-12 font-bold text-glow">
            <form
              className={`flex items-center gap-2 text-2xl ${quizStarted ? "flex" : "invisible"}`}
            >
              <label className="whitespace-nowrap">Enter flag name:</label>
              <input
                type="text"
                value={inputValue}
                onChange={handleInput}
                className="bg-primary border rounded border-blue-400 min-w-0 w-full"
              />
            </form>

            {showFlag && (
              <div className="flex items-center gap-4 shrink-0">
                <img
                  src={encodeURI(
                    remainingFlags[currentFlagIndex]?.flags?.svg ||
                      remainingFlags[currentFlagIndex]?.flags?.png ||
                      "",
                  )}
                  alt="Current flag"
                  className={`w-24 h-16 object-cover rounded border ${quizStarted ? "visible" : "invisible"}`}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      setCurrentFlagIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentFlagIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentFlagIndex((prev) =>
                        Math.min(remainingFlags.length - 1, prev + 1),
                      )
                    }
                    disabled={
                      currentFlagIndex === independentCountries.length - 1
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-12 shrink-0">
              <div>
                Score:{" "}
                <span className="text-3xl block mb-5">
                  {score} / {independentCountries.length}
                </span>
              </div>
              <div className="flex flex-col">
                Timer:
                <span className="text-3xl font-bold">
                  {formatTime(timeLeft)}
                </span>
                <span
                  className={`text-sm underline hover:cursor-pointer ${quizStarted ? "visible" : "invisible"}`}
                  onClick={() => {
                    setIsRunning(false);
                    setQuizStarted(false);
                    setGameOver(true);
                    setShowFlag(false);
                  }}
                >
                  Give up
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {independentCountries.map((country) => (
              <div
                key={country.name.common}
                className="flex flex-col items-center"
              >
                <p className="font-bold mb-2 w-full truncate hidden">
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
