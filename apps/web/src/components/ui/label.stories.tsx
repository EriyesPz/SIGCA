import type { Meta, StoryObj } from "@storybook/react";
import "@/index.css";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Label> = {
  title: "Label",
  component: Label,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Primary: Story = {
  render: (args) => <Label {...args}>{args.children}</Label>,
  args: {
    children: "Label",
    htmlFor: "input-id",
  },
};
