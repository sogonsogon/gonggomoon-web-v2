import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/shared/lib/cn';

const buttonVariants = cva(
  "inline-flex cursor-pointer shrink-0 items-center justify-center gap-[var(--gap-sm)] rounded-[var(--radius-sm)] text-[13px] leading-[1.42] font-bold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[15px]",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-primary-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-border bg-card text-foreground hover:bg-muted hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-[var(--button-padding-x)] py-[var(--button-padding-y)]',
        xs: "gap-1 px-2 py-1 text-xs leading-[1.3] has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'gap-1.5 px-3 py-2 has-[>svg]:px-2.5',
        lg: 'px-6 py-2.5 text-sm has-[>svg]:px-4 [&_svg:not([class*="size-"])]:size-4',
        icon: 'size-9 p-0',
        'icon-xs': "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 p-0',
        'icon-lg': 'size-10 p-0 [&_svg:not([class*="size-"])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
