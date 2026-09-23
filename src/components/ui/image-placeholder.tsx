import { type LucideIcon, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  icon: Icon = ImageIcon,
  size = "md",
  rounded = "md",
  className,
}: {
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  rounded?: "md" | "full";
  className?: string;
}) {
  const sizes = { sm: "h-9 w-9", md: "h-12 w-16", lg: "h-16 w-16" };
  const iconSizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-slate-100 text-slate-400",
        sizes[size],
        rounded === "full" ? "rounded-full" : "rounded-md",
        className
      )}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}
