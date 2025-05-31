import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./slider";
import "@/index.css";
import { cn } from "@/lib/utils";

const meta: Meta<typeof Slider> = {
  title: "Slider",
  component: Slider,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;
export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Slider defaultValue={[33]} max={100} step={1} />
    </div>
    
  ),
};
