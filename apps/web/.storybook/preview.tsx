import type { Decorator, Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import "@/index.css";

export const decorators: Decorator[] = [
  withThemeByClassName({
    themes: {
      light: "light",
      dark: "dark",
    },
    defaultTheme: "light",
  }),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;