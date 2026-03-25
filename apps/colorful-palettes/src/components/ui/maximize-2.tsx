"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "#/lib/utils";

export interface Maximize2IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface Maximize2IconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animate?: boolean;
  play?: boolean;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const Maximize2Icon = forwardRef<Maximize2IconHandle, Maximize2IconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, animate, play, ...props }, ref) => {
    const controls = useAnimation();
    const imperativeControlRef = useRef(false);
    const isPropControlled = animate !== undefined || play !== undefined;
    const shouldAnimate = animate ?? play ?? false;

    useImperativeHandle(ref, () => {
      imperativeControlRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    useEffect(() => {
      if (isPropControlled) {
        controls.start(shouldAnimate ? "animate" : "normal");
      }
    }, [controls, isPropControlled, shouldAnimate]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (imperativeControlRef.current || isPropControlled) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter, isPropControlled],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (imperativeControlRef.current || isPropControlled) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave, isPropControlled],
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            animate={controls}
            d="M3 16.2V21m0 0h4.8M3 21l6-6"
            initial={shouldAnimate ? "animate" : "normal"}
            transition={DEFAULT_TRANSITION}
            variants={{
              normal: { translateX: "0%", translateY: "0%" },
              animate: { translateX: "-2px", translateY: "2px" },
            }}
          />
          <motion.path
            animate={controls}
            d="M21 7.8V3m0 0h-4.8M21 3l-6 6"
            initial={shouldAnimate ? "animate" : "normal"}
            transition={DEFAULT_TRANSITION}
            variants={{
              normal: { translateX: "0%", translateY: "0%" },
              animate: { translateX: "2px", translateY: "-2px" },
            }}
          />
        </svg>
      </div>
    );
  },
);

Maximize2Icon.displayName = " Maximize2Icon";

export { Maximize2Icon };
