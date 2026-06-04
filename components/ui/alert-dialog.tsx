"use client"

import * as React from "react"
import { Button } from "./button"

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  actionText: string
  cancelText?: string
  onConfirm: () => void
  loading?: boolean
  children?: React.ReactNode
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  actionText,
  cancelText = "Cancel",
  onConfirm,
  loading = false,
  children,
}: AlertDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 sm:items-center"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl animate-slide-down-fade">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-zinc-950">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
          {children && <div className="mt-4">{children}</div>}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:items-center">
            <Button className="w-full sm:w-auto" onClick={onConfirm} disabled={loading}>
              {actionText}
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
              {cancelText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
