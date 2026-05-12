import CountryDetail from "@/components/CountryDetail";
import type { Country } from "@/components/types/Country";

interface CountryCardProps {
  country: Country;
  onClose: () => void;
}

// Modal component to display further information about a country after quiz is over
export default function CountryCard({ country, onClose }: CountryCardProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 overflow-y-auto py-8"
      onClick={onClose}
    >
      <div
        className="bg-background border border-primary rounded p-6 w-full max-w-4xl mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-foreground hover:text-primary text-xl font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <CountryDetail cca3={country.cca3} hideBackBtn />
      </div>
    </div>
  );
}