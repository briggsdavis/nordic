import { useTheme } from "next-themes"
import type { ComponentProps } from "react"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=success]:border-emerald-500/30 data-[type=success]:bg-emerald-500/10 data-[type=error]:border-destructive/40 data-[type=error]:bg-destructive/10 data-[type=warning]:border-amber-500/40 data-[type=warning]:bg-amber-500/10",
          title: "text-sm font-semibold",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground",
        },
      }}
      {...props}
    />
  )
}

export { toast, Toaster }
