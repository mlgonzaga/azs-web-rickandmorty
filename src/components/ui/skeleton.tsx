import React from 'react'
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-gradient-to-r from-black via-black to-green-600 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
