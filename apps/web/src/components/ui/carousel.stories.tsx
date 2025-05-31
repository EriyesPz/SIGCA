import type { Meta, StoryObj } from "@storybook/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./carousel";
import "@/index.css";

const meta: Meta<typeof Carousel> = {
  title: "Carousel",
  component: Carousel,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-10">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  render: () => (
    <Carousel className="w-[400px]">
      <CarouselPrevious />
      <CarouselContent>
        <CarouselItem>
          <div className="h-40 flex items-center justify-center bg-white dark:bg-muted rounded shadow">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ718nztPNJfCbDJjZG8fOkejBnBAeQw5eAUA&s"
              alt="Example"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="h-40 flex items-center justify-center bg-white dark:bg-muted rounded shadow">
            Item 2
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="h-40 flex items-center justify-center bg-white dark:bg-muted rounded shadow">
            Item 3
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselNext />
    </Carousel>
  ),
};
