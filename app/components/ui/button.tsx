import React from "react";
import { cn } from "@/app/lib/utils";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
