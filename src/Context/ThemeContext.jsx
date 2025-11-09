import { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Create context
const ThemeContext = createContext();

// 2️⃣ Create provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  // 3️⃣ Check saved theme in localStorage on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // 4️⃣ Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Tailwind uses "dark" class on <html>
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 5️⃣ Custom hook for easy use
export const useTheme = () => useContext(ThemeContext);
