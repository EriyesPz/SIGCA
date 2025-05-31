import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";
import "@/index.css";

const meta: Meta<typeof Textarea> = {
  title: "Components/Textarea",
  component: Textarea,
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
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: () => (
    <Textarea placeholder="Type something..." className="w-96" />
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-96">
      <label htmlFor="textarea-id" className="text-sm font-medium">
        Your Message
      </label>
      <Textarea id="textarea-id" placeholder="Type your message here..." />
    </div>
  ),
};

export const Resizable: Story = {
  render: () => (
    <Textarea placeholder="Resizable textarea..." className="w-96 resize" />
  ),
};
