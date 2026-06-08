"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type CheckboxProps = Omit<React.ComponentProps<"button">, "checked" | "onChange"> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({ className, checked = false, onCheckedChange, disabled, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn(
        "peer size-4 shrink-0 rounded-[4px] border border-zinc-300 bg-white shadow-xs outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-zinc-950 data-[state=checked]:bg-zinc-950 data-[state=checked]:text-white",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {checked && <CheckIcon className="size-3.5" />}
    </button>
  )
}

export { Checkbox }
