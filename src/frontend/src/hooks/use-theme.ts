import {
  ThemeContext,
  type ThemeContextValue,
} from "@/components/ThemeProvider";
import { useContext } from "react";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
