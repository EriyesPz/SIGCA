import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import "@/index.css";

const meta: Meta<typeof Button> = {
    title: "Button",
    tags: ["autodocs"],
    component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    render: (args) => <Button {...args}>{args.children}</Button>,
    args: {
        children: "Button",
        variant: "default",
        size: "default",
    },
};

export const Variants: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Button {...args} variant="default">Default</Button>
            <Button {...args} variant="destructive">Destructive</Button>
            <Button {...args} variant="outline">Outline</Button>
            <Button {...args} variant="secondary">Secondary</Button>
            <Button {...args} variant="ghost">Ghost</Button>
            <Button {...args} variant="link">Link</Button>
        </div>
    ),
    args: {
        size: "default",
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: "flex", gap: 12 }}>
            <Button {...args} size="sm">Small</Button>
            <Button {...args} size="default">Default</Button>
            <Button {...args} size="lg">Large</Button>
            <Button {...args} size="icon" aria-label="Icon">
                <svg width="16" height="16" fill="currentColor"><circle cx="8" cy="8" r="7" /></svg>
            </Button>
        </div>
    ),
    args: {
        variant: "default",
    },
};