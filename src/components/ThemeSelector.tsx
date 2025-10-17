import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Flame, Droplets, Mountain, Wind, Leaf, Sun, Moon } from "lucide-react";

export function ThemeSelector() {
  const { theme, elementTheme, setTheme, setElementTheme } = useTheme();

  const elementThemes = [
    { value: "default", label: "Default", icon: Leaf, color: "text-green-600" },
    { value: "fire", label: "Fire", icon: Flame, color: "text-orange-600" },
    { value: "water", label: "Water", icon: Droplets, color: "text-blue-600" },
    { value: "earth", label: "Earth", icon: Mountain, color: "text-amber-700" },
    { value: "air", label: "Air", icon: Wind, color: "text-sky-600" },
  ];

  const currentElement = elementThemes.find((t) => t.value === elementTheme) || elementThemes[0];
  const CurrentIcon = currentElement.icon;

  return (
    <div className="flex items-center gap-2">
      {/* Light/Dark Toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="relative overflow-hidden"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Element Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <CurrentIcon className={`h-5 w-5 ${currentElement.color}`} />
            <span className="sr-only">Select element theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Element Themes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {elementThemes.map((element) => {
            const Icon = element.icon;
            return (
              <DropdownMenuItem
                key={element.value}
                onClick={() => setElementTheme(element.value as any)}
                className="cursor-pointer"
              >
                <Icon className={`mr-2 h-4 w-4 ${element.color}`} />
                <span>{element.label}</span>
                {elementTheme === element.value && (
                  <span className="ml-auto">✓</span>
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
