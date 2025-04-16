
// Re-export all sidebar components from a single entry point

// Context and Provider
export { useSidebar, SidebarProvider } from "./context"

// Main components
export { Sidebar } from "./main"
export { SidebarTrigger } from "./trigger"
export { SidebarRail } from "./rail"
export { SidebarInset } from "./inset"
export { SidebarInput } from "./input"

// Section components
export { 
  SidebarHeader, 
  SidebarFooter, 
  SidebarSeparator, 
  SidebarContent 
} from "./sections"

// Group components
export { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupAction, 
  SidebarGroupContent 
} from "./group"

// Menu button
export { SidebarMenuButton } from "./menu-button"

// Menu components
export { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuAction, 
  SidebarMenuBadge, 
  SidebarMenuSkeleton 
} from "./menu"

// Sub-menu components
export { 
  SidebarMenuSub, 
  SidebarMenuSubItem, 
  SidebarMenuSubButton 
} from "./menu-sub"

// Types
export type { SidebarContext } from "./types"
