import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj;

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/100" alt="User avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithoutImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="" alt="User avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const WithInitials: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  ),
};

export const CustomSizeAndStyle: Story = {
  render: () => (
    <Avatar className="size-16 border-2 border-primary shadow-lg">
      <AvatarImage
        src="https://i.pravatar.cc/150?img=10"
        className="object-cover"
      />
      <AvatarFallback className="text-lg font-semibold bg-blue-200 text-blue-900">
        ZX
      </AvatarFallback>
    </Avatar>
  ),
};

export const LoadingFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="invalid-url.jpg" />
      <AvatarFallback className="animate-pulse bg-gray-300 text-transparent">
        ??
      </AvatarFallback>
    </Avatar>
  ),
};
