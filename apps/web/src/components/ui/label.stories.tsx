import type { Meta, StoryObj } from "@storybook/react";
import "@/index.css";
import { Label } from "@/components/ui/label";

const meta: Meta<typeof Label> = {
    title: "Label",
    tags: ["autodocs"],
    component: Label,
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