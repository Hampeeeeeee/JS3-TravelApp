import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ContinentDropdown() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Kontinenter</DropdownMenuTrigger>
        <DropdownMenuContent className="shadow-md border"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
            backdropFilter: "none",
            backgroundBlendMode: "normal",
            opacity: 1,
          }}>
          <DropdownMenuLabel className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Kontinenter</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Alla</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Afrika</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Antarktis</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Asien</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Europa</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Nordamerika</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Oceanien</DropdownMenuItem>
          <DropdownMenuItem className="text-glow text-foreground font-bold cursor-pointer hover:scale-[1.1]">Sydamerika</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
