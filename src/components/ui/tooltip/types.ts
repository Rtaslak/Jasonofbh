
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import React from "react"

export interface TooltipContentProps 
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  sideOffset?: number
}
