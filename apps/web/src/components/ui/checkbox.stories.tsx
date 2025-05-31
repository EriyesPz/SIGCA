import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "./checkbox";
import "@/index.css";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
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
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  render: () => <Checkbox defaultChecked />,
};

export const Unchecked: Story = {
  render: () => <Checkbox />,
};

export const Disabled: Story = {
  render: () => <Checkbox disabled defaultChecked />,
};
