"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = (props) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-green-600 drop-shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-yellow-400 animate-pulse drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-600 animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,1)]" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-red-400" />
        ),
      }}
      style={{
        "--normal-bg": "rgba(10,10,10,0.9)",
        "--normal-text": "#f5f5f5",
        "--normal-border": "rgba(12, 61, 80, 0.842)",
        "--border-radius": "0.75rem",
        backdropFilter: "blur(12px)",
      }}
      toastOptions={{
        classNames: {
          toast:
            "relative overflow-hidden border border-red-500/30 bg-black/80 text-white backdrop-blur-xl" +
            "shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all duration-300 ease-out " +
            "hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]",

          // 🔥 subtle glowing gradient border animation
          container:
            "before:absolute before:inset-0 before:rounded-xl before:p-[1px] " +
            "before:bg-gradient-to-r before:from-red-500/40 before:via-transparent before:to-red-500/40 " +
            "before:animate-[pulse_3s_infinite] before:-z-10",

          title: "font-semibold tracking-wide",
          description: "text-gray-300 text-sm",

          actionButton:
            "bg-red-600/90 text-white hover:bg-red-700 transition-all duration-200 rounded-md",

          cancelButton:
            "bg-gray-800 text-gray-300 hover:bg-gray-700 rounded-md",
        },
      }}
      {...props}
    />
  )
}


export { Toaster }