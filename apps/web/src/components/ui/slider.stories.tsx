import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";
import "@/index.css";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
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
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => <Slider defaultValue={[33]} max={100} step={1} />,
};
