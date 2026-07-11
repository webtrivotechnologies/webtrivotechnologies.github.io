import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeChoice = "light" | "dark" | "system";

const choices: ThemeChoice[] = ["system", "light", "dark"];

function resolveTheme(choice: ThemeChoice) {
  if (choice === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return choice;
}

function applyTheme(choice: ThemeChoice) {
  const resolved = resolveTheme(choice);
  document.documentElement.dataset.themeChoice = choice;
  if (resolved === "dark") {
    document.documentElement.dataset.theme = "dark";
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

export default function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>(() => {
    const stored = localStorage.getItem("webtrivo-theme");
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });

  useEffect(() => {
    applyTheme(choice);
    localStorage.setItem("webtrivo-theme", choice);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (choice === "system") applyTheme("system");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [choice]);

  const Icon = choice === "light" ? Sun : choice === "dark" ? Moon : Laptop;
  const nextChoice = choices[(choices.indexOf(choice) + 1) % choices.length];

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Theme: ${choice}. Switch to ${nextChoice}.`}
      title={`Theme: ${choice}`}
      onClick={() => setChoice(nextChoice)}
    >
      <Icon size={18} />
      <span>{choice}</span>
    </button>
  );
}
