import { useEffect, useState } from "react"
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { ContinentDropdown } from "./ContinentDropdown";
import InputField from "./InputField";

export function Navbar() {

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll)
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
          href="#hero"
        >
          <span className="relative z-10">
            <span className="relative z-10 hidden md:inline">
            <span className="text-glow text-foreground"> Travel </span>{" "}
            App
            </span>
          </span>
        </a>

        {/* Desktop Nav */}

        <div>
            <InputField />
        </div>

        <div className="flex items-center gap-2">
          <ContinentDropdown />
            <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

