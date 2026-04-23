import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[10px] border font-medium whitespace-nowrap outline-none select-none cursor-pointer transition-[transform,background-color,border-color] duration-[80ms,150ms,150ms] ease-out active:translate-y-px focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:border-primary/90",
        secondary: "bg-card text-foreground border-ring hover:bg-card/80 hover:border-ring/80",
        ghost: "bg-transparent text-foreground border-transparent hover:bg-muted hover:border-muted",
        danger: "bg-card text-destructive border-destructive hover:bg-card/80 hover:border-destructive/80",
        dangerFilled: "bg-destructive text-white border-destructive hover:bg-destructive/90 hover:border-destructive/90",
        link: "text-primary underline-offset-4 hover:underline border-transparent bg-transparent",
      },
      size: {
        sm: "px-3.5 py-2 text-[13px] h-[34px] gap-2",
        md: "px-4.5 py-2.5 text-sm h-[42px] gap-2",
        lg: "px-5.5 py-3.5 text-[15px] h-[50px] gap-2",
        icon: "size-9",
        "icon-sm": "size-[34px]",
        "icon-md": "size-[42px]",
        "icon-lg": "size-[50px]",
      },
    },
    defaultVariants: { size: "md", variant: "primary" },
  },
);

type Props = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";

    return (
      <Comp
        ref={ref}
        data-size={size}
        data-slot="button"
        data-variant={variant}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
