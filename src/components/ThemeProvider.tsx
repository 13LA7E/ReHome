import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ElementTheme = "fire" | "water" | "earth" | "air" | "default";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultElement?: ElementTheme;
};

type ThemeProviderState = {
  theme: Theme;
  elementTheme: ElementTheme;
  setTheme: (theme: Theme) => void;
  setElementTheme: (element: ElementTheme) => void;
  toggleTheme: () => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  elementTheme: "default",
  setTheme: () => null,
  setElementTheme: () => null,
  toggleTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  defaultElement = "default",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || defaultTheme
  );
  
  const [elementTheme, setElementTheme] = useState<ElementTheme>(
    () => (localStorage.getItem("elementTheme") as ElementTheme) || defaultElement
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Remove all element theme classes
    root.classList.remove("fire", "water", "earth", "air", "default");
    root.classList.add(elementTheme);
    
    localStorage.setItem("theme", theme);
    localStorage.setItem("elementTheme", elementTheme);
  }, [theme, elementTheme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const value = {
    theme,
    elementTheme,
    setTheme,
    setElementTheme,
    toggleTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
