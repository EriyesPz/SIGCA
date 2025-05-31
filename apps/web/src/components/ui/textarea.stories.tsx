import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import "@/index.css";

const meta: Meta<typeof Textarea> = {
  title: "Textarea",
  component: Textarea,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;
export const Default: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Textarea placeholder="Type something..." className="w-96" />
    </div>
  ),
};
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Your Message
      </label>
      <Textarea placeholder="Type your message here..." className="w-96" />
    </div>
  ),
};
export const Resizable: Story = {
  render: () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Textarea placeholder="Resizable textarea..." className="w-96 resize" />
    </div>
  ),
};
