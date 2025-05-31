import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "./form";
import { Input } from "./input";
import { Button } from "./button"
import "@/index.css";

const meta: Meta = {
  title: "Components/Form",
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
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        name: "",
      },
    });

    const onSubmit = (values: any) => {
      alert(JSON.stringify(values));
    };

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full max-w-sm"
        >
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "This field is required." }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormDescription>This is your display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant="default"
            type="submit"
          >
            Send
          </Button>
        </form>
      </Form>
    );
  },
};
