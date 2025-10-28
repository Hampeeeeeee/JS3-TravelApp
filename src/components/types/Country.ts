// Define the Country type used in the application
export type Country = {
  name: { common: string; official?: string };
  capital?: string[];
  cca3: string;
  region?: string;
  subregion?: string;
  population?: number;
  flags?: { png?: string; svg?: string; alt?: string };
  tld?: string[];
  currencies?: Record<string, { name: string; symbol?: string }>;
  languages?: Record<string, string>;
};