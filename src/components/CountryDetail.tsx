import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { Country } from "./types/Country";
import LoadSpinner from "./loadspinner";
import type { Weather } from "./types/Weather";
import { Earth, HandCoins, Landmark, PersonStanding, ScrollText, Speech, Wallpaper } from "lucide-react";

export default function CountryDetail({ cca3 }: { cca3: string }) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setWeather(null);
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
            cca3
          )}?fields=name,capital,cca3,region,subregion,population,flags,tld,currencies,languages,capitalInfo,latlng`
        );
        if (!res.ok) throw new Error("Country not found");
        const data = await res.json();
        const c = Array.isArray(data) ? data[0] : data;
        if (!cancelled) setCountry(c ?? null);

        // --- Fetch weather after country ---
        const coords = c?.capitalInfo?.latlng ?? c?.latlng;
        if (coords && coords.length === 2) {
          const [lat, lon] = coords;
          setWeatherLoading(true);
          try {
            const wres = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min`
            );
            if (!wres.ok) throw new Error("Weather data not found");
            const wdata = await wres.json();
            if (!cancelled && wdata?.current_weather) {
              setWeather(wdata.current_weather);
            }
          } catch (err) {
            if (!cancelled) setWeatherError((err as Error).message);
          } finally {
            if (!cancelled) setWeatherLoading(false);
          }
        }
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

  if (loading)
    return (
      <p className="p-4 text-center">
        <LoadSpinner />
      </p>
    );

  if (error) return <p className="p-4 text-center text-primary">{error}</p>;

  if (!country)
    return (
      <p className="p-4 text-center text-foreground">No country selected.</p>
    );

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "—";
  const currency = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`)
        .join(", ")
    : "—";

  const weatherEmoji = (temperature: number) => {
    if (temperature <= 10) return "❄️";
    if (temperature <= 15) return "🌥️";
    if (temperature <= 20) return "🌤️";
    return "☀️";
  };

  return (
    // Country Details
    <div className="mx-auto max-w-[950px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{country.name.common}</h1>
        <div>
          <Button
            className="bg-primary/50 hover:scale-[1.05] cursor-pointer text-foreground"
            onClick={() => {
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

        <div className="md:col-span-2 space-y-2 text-md text-foreground">
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <ScrollText className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Official name:</strong> {country.name.official ?? "—"}
                </h4>
              </div>
            </div>
          </div>
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Earth className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Region:</strong> {country.region ?? "—"} · {country.subregion ?? "—"}
                </h4>
              </div>
            </div>
          </div>
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Landmark className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Capital:</strong> {country.capital?.[0] ?? "—"}
                </h4>
              </div>
            </div>
          </div>
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <PersonStanding className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Population:</strong> {country.population?.toLocaleString() ?? "—"}
                </h4>
              </div>
            </div>
          </div>
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Wallpaper className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Top level domain:</strong> {country.tld?.join(", ") ?? "—"}
                </h4>
              </div>
            </div>
          </div>
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <Speech className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Languages:</strong> {languages}
                </h4>
              </div>
            </div>
          </div>
          <div className="gradient-border p-2 card-hover">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
                <HandCoins className="h-6 w-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h4 className="font-semibold text-lg text-muted-foreground">
                  <strong>Currency:</strong> {currency}
                </h4>
              </div>
            </div>
          </div>

          {/* Weather Details  */}
          <div className="mt-4 border-t border-primary pt-2">
            <h2 className="font-semibold text-lg text-primary">
              Current Weather
            </h2>
            {weatherLoading && <p>Loading weather...</p>}
            {weatherError && <p className="text-primary">{weatherError}</p>}
            {weather && (
              <p>
                🌡️ {weather.temperature}°C {weatherEmoji(weather.temperature)} ·
                💨 {weather.windspeed} km/h
              </p>
            )}
            {!weather && !weatherLoading && !weatherError && (
              <p>— No weather data available —</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
