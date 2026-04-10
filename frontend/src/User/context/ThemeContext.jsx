import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ dark: false, toggle: () => {} });

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("esociety-theme") === "dark"; } catch { return false; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
    try {
      localStorage.setItem("esociety-theme", dark ? "dark" : "light");
    } catch { /* ignore */ }
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
