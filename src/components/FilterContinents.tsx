export const CONTINENTS = [
  { key: "All", label: "All" },
  { key: "Africa", label: "Africa" },
  { key: "Antarctic", label: "Antarctica" },
  { key: "Asia", label: "Asia" },
  { key: "Europe", label: "Europe" },
  { key: "North America", label: "North America" },
  { key: "Oceania", label: "Oceania" },
  { key: "South America", label: "South America" },
];

export function matchesContinent(
  country: { region?: string; subregion?: string },
  selected: string | undefined
) {
  if (!selected || selected === "All") return true;

  if (selected === "North America") {
    return country.region === "Americas" && country.subregion !== "South America";
  }

  if (selected === "South America") {
    return country.region === "Americas" && country.subregion === "South America";
  }

  if (selected === "Antarctic" || selected === "Antarctica") {
    return country.region === "Antarctic" || country.region === "Antarctica";
  }

  return country.region === selected;
}