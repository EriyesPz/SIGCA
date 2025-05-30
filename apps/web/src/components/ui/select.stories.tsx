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
} from "@/components/ui/select";
import "@/index.css";

const meta: Meta<typeof Select> = {
  title: "Select",
  tags: ["autodocs"],
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;
export const Primary: Story = {
  render: (args) => (
    <Select {...args}>
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
  ),
  args: {},
};