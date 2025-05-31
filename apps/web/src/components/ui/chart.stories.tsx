import type { Meta, StoryObj } from "@storybook/react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const meta: Meta = {
  title: "Components/Chart",
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj;

const data = [
  { name: "Jan", sales: 4000, profit: 2400 },
  { name: "Feb", sales: 3000, profit: 2210 },
  { name: "Mar", sales: 2000, profit: 2290 },
  { name: "Apr", sales: 2780, profit: 2000 },
  { name: "May", sales: 1890, profit: 2181 },
];

const config = {
  sales: {
    label: "Sales",
    color: "#3b82f6", // blue-500
  },
  profit: {
    label: "Profit",
    color: "#22c55e", // green-500
  },
};

export const LineChartWithTooltip: Story = {
  render: () => (
    <ChartContainer config={config}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" />
        <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" />
      </LineChart>
    </ChartContainer>
  ),
};

export const BarChartWithLegend: Story = {
  render: () => (
    <ChartContainer config={config}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="sales" fill="var(--color-sales)" />
        <Bar dataKey="profit" fill="var(--color-profit)" />
      </BarChart>
    </ChartContainer>
  ),
};

export const CustomTooltipIndicators: Story = {
  render: () => (
    <ChartContainer config={config}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip
          content={
            <ChartTooltipContent indicator="dashed" hideLabel={false} />
          }
        />
        <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" />
        <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" />
      </LineChart>
    </ChartContainer>
  ),
};

export const DarkThemeSupport: Story = {
  render: () => (
    <div className="dark bg-gray-900 min-h-screen p-10">
      <ChartContainer
        config={{
          sales: {
            label: "Sales",
            theme: {
              light: "#3b82f6",
              dark: "#60a5fa",
            },
          },
          profit: {
            label: "Profit",
            theme: {
              light: "#22c55e",
              dark: "#4ade80",
            },
          },
        }}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="sales" fill="var(--color-sales)" />
          <Bar dataKey="profit" fill="var(--color-profit)" />
        </BarChart>
      </ChartContainer>
    </div>
  ),
};
