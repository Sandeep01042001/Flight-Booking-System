'use client'

import { useToast } from "@/components/ui/use-toast"
import { Toaster as Sonner } from "@/components/ui/toast"

const Toaster = () => {
  const { toasts } = useToast()

  return (
    <Sonner
      toasts={toasts}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  )
}

export { Toaster }
