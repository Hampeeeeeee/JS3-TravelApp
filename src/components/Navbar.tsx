import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { ContinentDropdown } from "./ContinentDropdown";
import InputField from "./InputField";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDetailRoute, setIsDetailRoute] = useState<boolean>(() =>
    window.location.pathname.startsWith("/country/")
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handlePop = () => {
      setIsDetailRoute(window.location.pathname.startsWith("/country/"));
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePop);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePop);
    };
  }, []);

  return (
    <nav
      className={cn(
        "z-50 fixed w-full transition-all duration-300",
        isScrolled ? "py-3 bg-background/80 backdrop-blur-md shadow-xs" : "py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        <a
          className="text-xl font-bold text-primary flex items-center"
          href="/"
        >
          <span className="relative z-10 hidden md:inline">
            <span className="text-glow text-foreground"> Travel </span> App
          </span>
        </a>

        {!isDetailRoute && (
          <div className="">
          <div className="w-full max-w-xs">
            <InputField />
          </div>
        </div>
        )}

        <div className="flex items-center gap-2">
          {!isDetailRoute && <ContinentDropdown />}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
