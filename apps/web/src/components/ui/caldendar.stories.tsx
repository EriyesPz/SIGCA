import type { Meta, StoryObj } from "@storybook/react";
import { Calendar } from "./calendar";
import "@/index.css";

const meta: Meta<typeof Calendar> = {
  title: "Calendar",
  component: Calendar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar />,
};

export const WithRange: Story = {
  render: () => <Calendar mode="range" />,
};

export const WithSelectedDate: Story = {
  render: () => <Calendar selected={new Date()} />,
};
