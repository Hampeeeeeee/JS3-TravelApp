import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUrlParams } from "./hooks/useUrlParams";

// ContinentDropdown component
export function ContinentDropdown() {
  const [params, setParams] = useUrlParams();
  const continent = params.region ?? "All";

  // List of continent options
  const items = [
    "All",
    "Africa",
    "Antarctic",
    "Asia",
    "Europe",
    "North America",
    "Oceania",
    "South America",
  ];

  // render component
  return (
    <div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">
          Continents
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="shadow-md border divide-y divide-[color:var(--color-border)]"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            backdropFilter: "none",
            backgroundBlendMode: "normal",
            opacity: 1,
          }}
        >
          <DropdownMenuLabel>Continents</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownMenuItem
              key={item}
              onSelect={() => setParams({ region: item })}
              aria-checked={item === continent}
              className={item === continent ? "font-semibold hover:scale-[1.05]" : "hover:scale-[1.05]"}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
