import type { Meta, StoryObj } from "@storybook/react";
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarGroupLabel, SidebarGroup, SidebarFooter, SidebarSeparator, SidebarInset, SidebarTrigger } from "./sidebar";
import { HomeIcon, SettingsIcon } from "lucide-react";
import "@/index.css";

const meta: Meta = {
  title: "Components/Sidebar",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar className="border-r">
            <SidebarHeader>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Home">
                    <HomeIcon className="mr-2" />
                    Home
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <SettingsIcon className="mr-2" />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarSeparator />
            </SidebarContent>
            <SidebarFooter>
              <SidebarGroupLabel>Footer</SidebarGroupLabel>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="p-4">
            <SidebarTrigger />
            <div>Main Content Area</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
