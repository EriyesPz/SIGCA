import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { CircleAlert, Bell, Trash2 } from "lucide-react"; // Opcional: si usas íconos
import "@/index.css";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Default",
    variant: "default",
    size: "default",
  },
};

export const Destructive: Story = {
  args: {
    children: (
      <>
        <Trash2 className="size-4" />
        Delete
      </>
    ),
    variant: "destructive",
    size: "default",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
    size: "default",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
    size: "default",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost",
    variant: "ghost",
    size: "default",
  },
};

export const Link: Story = {
  args: {
    children: "Link",
    variant: "link",
    size: "default",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    children: <Bell className="size-4" />,
    size: "icon",
    "aria-label": "Notification",
  },
};

export const WithIconAndText: Story = {
  args: {
    children: (
      <>
        <CircleAlert className="size-4" />
        Alert
      </>
    ),
    variant: "outline",
    size: "default",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
