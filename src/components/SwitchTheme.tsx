"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "./Button";

const SwitchTheme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return (
    <div>
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? "Dark" : "Light"}
      </Button>
    </div>
  );
};

export default SwitchTheme;
