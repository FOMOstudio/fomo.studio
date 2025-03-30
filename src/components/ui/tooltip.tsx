"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";
import { CommandIcon } from "lucide-react";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

const CommandShortcut = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  const isMac =
    typeof window !== "undefined" &&
    window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  const renderShortcut = () => {
    if (children === "mod") {
      return isMac ? <CommandIcon size={11} /> : "Ctrl";
    }
    return children;
  };

  return (
    <span
      className={cn(
        "ml-auto inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-sm border border-primary/10 bg-primary-foreground/15 px-0.5 text-[10px] capitalize tracking-widest text-primary-foreground",
        className
      )}
      {...props}
    >
      {renderShortcut()}
    </span>
  );
};
CommandShortcut.displayName = "CommandShortcut";

export function TooltipOnHover({
  children,
  content,
  shortcuts,
  className,
  side = "top",
  align,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  shortcuts?: string[];
  side?: "bottom" | "left" | "right" | "top";
  align?: "center" | "end" | "start";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        sideOffset={8}
        side={side}
        align={align}
        className={cn("px-0 py-0", className)}
      >
        <div className="flex items-center justify-center gap-4 px-2 py-1.5 opacity-100">
          {content}
          {shortcuts && (
            <div className="flex gap-0.5">
              {shortcuts.map((shortcut) => (
                <CommandShortcut key={`key-${shortcut}`}>
                  {shortcut}
                </CommandShortcut>
              ))}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
