import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

const meta: Meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj;

export const SingleItem: Story = {
  render: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          Our return policy lasts 30 days. If 30 days have gone by since your
          purchase, unfortunately, we can’t offer you a refund or exchange.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <AccordionContent>
          You can return any item within 30 days of purchase.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Do you ship internationally?</AccordionTrigger>
        <AccordionContent>
          Yes, we ship to most countries around the world.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How can I track my order?</AccordionTrigger>
        <AccordionContent>
          You will receive a tracking link via email once your order ships.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Accordion type="single" defaultValue="item-2" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>What are the store hours?</AccordionTrigger>
        <AccordionContent>
          We are open from 9am to 9pm, Monday through Saturday.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is curbside pickup available?</AccordionTrigger>
        <AccordionContent>
          Yes, select curbside pickup at checkout and follow instructions.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
