import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
import "@/index.css";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-10">
        <Story />
      </div>
    ),
  ],
  subcomponents: {
    SelectTrigger: SelectTrigger as React.ComponentType<any>,
    SelectValue: SelectValue as React.ComponentType<any>,
    SelectContent: SelectContent as React.ComponentType<any>,
    SelectGroup: SelectGroup as React.ComponentType<any>,
    SelectLabel: SelectLabel as React.ComponentType<any>,
    SelectItem: SelectItem as React.ComponentType<any>,
    SelectScrollUpButton: SelectScrollUpButton as React.ComponentType<any>,
    SelectScrollDownButton: SelectScrollDownButton as React.ComponentType<any>,
    SelectSeparator: SelectSeparator as React.ComponentType<any>,
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Primary: Story = {
  render: () => (
    <div className="w-64">
      <Select defaultValue="option2">
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton />
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectScrollDownButton />
        </SelectContent>
      </Select>
    </div>
  ),
};
