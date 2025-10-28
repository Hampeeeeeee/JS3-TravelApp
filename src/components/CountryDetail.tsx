import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import type { Country } from "./types/Country";
import LoadSpinner from "./loadspinner";
import type { Weather } from "./types/Weather";
import {
  Earth,
  HandCoins,
  Landmark,
  PersonStanding,
  ScrollText,
  Speech,
  Wallpaper,
} from "lucide-react";
import type { WikiSummary } from "./types/WikiSummary";

export default function CountryDetail({ cca3 }: { cca3: string }) {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [weather, setWeather] = useState<Weather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const [wiki, setWiki] = useState<WikiSummary | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState<string | null>(null);

  const [image, setImage] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const cancelRef = useRef(false);

  // shared load function so refetching is possible if needed
  async function loadAll(cancelFlagRef: { current: boolean }) {
    setLoading(true);
    setError(null);
    setWeather(null);
    setWeatherError(null);
    setWiki(null);
    setWikiError(null);
    setImage([]);
    setImageError(null);

    // --- Fetching country data ---
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
          cca3
        )}?fields=name,capital,cca3,region,subregion,population,flags,tld,currencies,languages,capitalInfo,latlng`
      );
      if (!res.ok) throw new Error("Country not found");
      const data = await res.json();
      const c = Array.isArray(data) ? data[0] : data;
      if (!cancelFlagRef.current) setCountry(c ?? null);

      // fetch wikipedia summary (using country name)
      if (!cancelFlagRef.current) {
        const countryTitle = c?.name?.common ?? c?.name?.official ?? c?.cca3;
        if (countryTitle) {
          setWikiLoading(true);
          setWikiError(null);
          try {
            const slug = encodeURIComponent(
              String(countryTitle).replace(/\s+/g, "_")
            );
            const wikires = await fetch(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`
            );
            if (!wikires.ok) throw new Error("Wikipedia summary not found");
            const wdata = await wikires.json();
            if (!cancelFlagRef.current) {
              const url =
                wdata?.content_urls?.desktop?.page ??
                wdata?.content_urls?.mobile?.page ??
                `https://en.wikipedia.org/wiki/${slug}`;
              setWiki({
                title: wdata.title ?? countryTitle,
                extract: wdata.extract ?? "",
                url,
              });
            }
          } catch (err) {
            if (!cancelFlagRef.current) setWikiError((err as Error).message);
          } finally {
            if (!cancelFlagRef.current) setWikiLoading(false);
          }
        }
      }

      // --- Fetch weather after country (using capital coordinates || fallback country coordinates) ---
      const coords = c?.capitalInfo?.latlng ?? c?.latlng;
      if (!cancelFlagRef.current && coords && coords.length === 2) {
        const [lat, lon] = coords;
        setWeatherLoading(true);
        try {
          const wres = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
          );
          if (!wres.ok) throw new Error("Weather data not found");
          const wdata = await wres.json();
          if (!cancelFlagRef.current && wdata?.current_weather) {
            setWeather(wdata.current_weather);
          }
        } catch (err) {
          if (!cancelFlagRef.current) setWeatherError((err as Error).message);
        } finally {
          if (!cancelFlagRef.current) setWeatherLoading(false);
        }
      }

      // fetching Unsplash images using the selected country's name
      if (!cancelFlagRef.current) {
        const countryQuery = String(c?.name?.common);
        if (countryQuery) {
          setImageLoading(true);
          setImageError(null);
          try {
            const q = encodeURIComponent(countryQuery);
            const key =
              import.meta.env.VITE_TRAVEL_APP_API_KEY ??
              import.meta.env.TRAVEL_APP_API_KEY;
            if (!key) throw new Error("Missing Unsplash API key");

            // request 3 photos and store their urls
            const imageRes = await fetch(
              `https://api.unsplash.com/search/photos?query=${q}&per_page=3&client_id=${key}`
            );
            if (!imageRes.ok)
              throw new Error(`Image API error: ${imageRes.status}`);
            const imageData = await imageRes.json();
            const urls =
              (imageData?.results ?? [])
                .map(
                  (result: { urls: { regular: string; small: string } }) =>
                    result?.urls?.regular ?? result?.urls?.small
                )
                .filter(Boolean) || [];

            if (!urls.length)
              throw new Error("No images found for this country");
            if (!cancelFlagRef.current) setImage(urls);
          } catch (err) {
            if (!cancelFlagRef.current) setImageError((err as Error).message);
            if (!cancelFlagRef.current) setImage([]);
          } finally {
            if (!cancelFlagRef.current) setImageLoading(false);
          }
        }
      }
    } catch (err) {
      if (!cancelFlagRef.current) setError((err as Error).message);
    } finally {
      if (!cancelFlagRef.current) setLoading(false);
    }
  }

  // initial load + cleanup
  useEffect(() => {
    cancelRef.current = false;
    loadAll(cancelRef);
    return () => {
      cancelRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cca3]);

  // retry handlers
  const retryCountry = () => {
    cancelRef.current = false;
    loadAll(cancelRef);
  };

  // retry wikipedia fetch
  const retryWiki = async () => {
    if (!country) return;
    setWiki(null);
    setWikiError(null);
    setWikiLoading(true);
    const title =
      country.name?.common ?? country.name?.official ?? country.cca3;
    try {
      const slug = encodeURIComponent(String(title).replace(/\s+/g, "_"));
      const wikires = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`
      );
      if (!wikires.ok) throw new Error("Wikipedia summary not found");
      const wdata = await wikires.json();
      setWiki({
        title: wdata.title ?? title,
        extract: wdata.extract ?? "",
        url:
          wdata?.content_urls?.desktop?.page ??
          wdata?.content_urls?.mobile?.page ??
          `https://en.wikipedia.org/wiki/${slug}`,
      });
    } catch (err) {
      setWikiError((err as Error).message);
    } finally {
      setWikiLoading(false);
    }
  };

  // loadspinner while loading
  if (loading)
    return (
      <section className="p-4 text-center" aria-busy="true">
        <LoadSpinner />
      </section>
    );

  if (error)
    return (
      <section className="p-4 text-center" role="alert">
        <p className="mb-3 text-primary font-semibold">
          Something went wrong loading country data.
        </p>
        <p className="mb-4 text-sm text-foreground">{error}</p>
        <Button onClick={retryCountry}>Try again</Button>
      </section>
    );

  if (!country)
    return (
      <section className="p-4 text-center text-foreground">
        No country selected.
      </section>
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
    <main className="mx-auto max-w-[950px] p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{country.name.common}</h1>
        <Button
          className="bg-primary/50 hover:scale-[1.05] cursor-pointer text-foreground"
          onClick={() => {
            if (window.history.length > 1) window.history.back();
            else {
              window.history.pushState({}, "", "/");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }
          }}
          aria-label="Go back to previous page"
        >
          Back
        </Button>
      </header>

      <article className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* FLAG & IMAGES */}
        <aside className="md:col-span-1">
          <figure>
            <img
              src={country.flags?.png || country.flags?.svg}
              alt={country.flags?.alt || `${country.name.common} flag`}
              className="w-full rounded border object-cover"
              loading="lazy"
            />
            <figcaption className="sr-only">
              Flag of {country.name.common}
            </figcaption>
          </figure>

          {imageLoading && (
            <p className="mt-2 text-sm text-foreground">Loading image...</p>
          )}
          {imageError && (
            <p className="mt-2 text-sm text-primary">{imageError}</p>
          )}
          {image.length > 0 && (
            <section aria-label={`${country.name.common} photos`}>
              <ul className="mt-2 grid grid-cols-1 gap-2 md:col-span-1">
                {image.slice(0, 3).map((src, i) => (
                  <li key={i}>
                    <img
                      src={src}
                      alt={`${country.name.common} landscape ${i + 1}`}
                      className="w-full h-40 md:h-56 rounded border object-cover"
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* COUNTRY INFO */}
        <section
          className="md:col-span-2 space-y-2 text-md text-foreground"
          aria-labelledby="country-info"
        >
          <h2 id="country-info" className="sr-only">
            Country Information
          </h2>

          {/* FACT CARDS */}
          <dl className="space-y-2">
            <InfoItem icon={ScrollText} label="Official name" value={country.name.official ?? "—"} />
            <InfoItem icon={Earth} label="Region" value={`${country.region} · ${country.subregion ?? "—"}`} />
            <InfoItem icon={Landmark} label="Capital" value={country.capital?.[0] ?? "—"} />
            <InfoItem icon={PersonStanding} label="Population" value={country.population?.toLocaleString() ?? "—"} />
            <InfoItem icon={Speech} label="Languages" value={languages} />
            <InfoItem icon={HandCoins} label="Currency" value={currency} />
            <InfoItem icon={Wallpaper} label="Top level domain" value={country.tld?.join(", ") ?? "—"} />
          </dl>

          {/* WEATHER */}
          <section className="mt-4 border-t border-primary pt-2">
            <h3 className="font-semibold text-lg text-primary">
              Current Weather
            </h3>
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
          </section>

          {/* WIKIPEDIA */}
          <section className="mt-4 border-t border-primary pt-2">
            <h3 className="font-semibold text-lg text-primary">About</h3>
            {wikiLoading && <p>Loading article summary...</p>}
            {wikiError && (
              <div>
                <p className="text-primary mb-2">
                  Failed to load Wikipedia summary.
                </p>
                <p className="mb-2 text-sm text-foreground">{wikiError}</p>
                <Button onClick={retryWiki}>Try again</Button>
              </div>
            )}
            {wiki && !wikiError && (
              <article className="mt-2 text-sm text-foreground">
                <h4 className="font-bold">{wiki.title}</h4>
                <p className="mt-2 font-semibold">
                  {wiki.extract || "No summary available."}
                </p>
                <p className="mt-2">
                  <a
                    className="text-primary underline"
                    href={wiki.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read full article on Wikipedia
                  </a>
                </p>
              </article>
            )}
          </section>
        </section>
      </article>
    </main>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="gradient-border p-2 card-hover">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center p-3 rounded-full bg-primary/10 flex-shrink-0">
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="text-left flex-1">
          <dt className="font-semibold text-lg text-muted-foreground">
            {label}:
          </dt>
          <dd>{value}</dd>
        </div>
      </div>
    </div>
  );
}
