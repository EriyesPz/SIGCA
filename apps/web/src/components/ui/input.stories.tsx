import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import "@/index.css";

const meta: Meta<typeof Input> = {
    title: "Input",
    tags: ["autodocs"],
    component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;
export const Primary: Story = {
    render: (args) => <Input {...args} />,
    args: {
        placeholder: "Type here...",
        size: 14,
    },
};