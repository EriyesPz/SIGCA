import { ModeToggle } from "./mode-toggle";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "@/components/providers/theme-provider";

const meta: Meta<typeof ModeToggle> = {
  title: "Components/ModeToggle",
  component: ModeToggle,
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ModeToggle>;
export const Default: Story = {
  render: () => <ModeToggle />,
  parameters: {
    layout: "centered",
  },
};