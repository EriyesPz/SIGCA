import { addons, types, useGlobals } from "@storybook/manager-api";
import { useEffect } from "react";
import theme from "./theme";

const ThemeClassApplier = () => {
  const [globals] = useGlobals();

  useEffect(() => {
    const docs = document.querySelectorAll(".docs-story");
    docs.forEach((el) => {
      el.classList.remove("light", "dark");
      el.classList.add(globals["theme"] || "light");
    });
  }, [globals]);

  return null;
};

addons.register("docs-theme-applier", () => {
  addons.add("theme-applier", {
    title: "Docs Theme Applier",
    type: types.TOOL,
    render: ThemeClassApplier,
    match: ({ viewMode }) => viewMode === "docs",
  });
});

addons.setConfig({ theme });
