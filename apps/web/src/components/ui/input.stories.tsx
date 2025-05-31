import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import "@/index.css";

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-8">
        <div className="w-full max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here.",
    value: "Hello, world!",
  },
};
