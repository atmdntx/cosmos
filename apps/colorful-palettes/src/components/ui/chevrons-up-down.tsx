"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "#/lib/utils";

export interface ChevronsUpDownIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ChevronsUpDownIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animate?: boolean;
  play?: boolean;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
};

const ChevronsUpDownIcon = forwardRef<ChevronsUpDownIconHandle, ChevronsUpDownIconProps>(
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
        void controls.start(shouldAnimate ? "animate" : "normal");
      }
    }, [controls, isPropControlled, shouldAnimate]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (imperativeControlRef.current || isPropControlled) {
          onMouseEnter?.(e);
        } else {
          void controls.start("animate");
        }
      },
      [controls, onMouseEnter, isPropControlled],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (imperativeControlRef.current || isPropControlled) {
          onMouseLeave?.(e);
        } else {
          void controls.start("normal");
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
            d="m7 15 5 5 5-5"
            initial={shouldAnimate ? "animate" : "normal"}
            transition={DEFAULT_TRANSITION}
            variants={{
              normal: { translateY: "0%" },
              animate: { translateY: "2px" },
            }}
          />
          <motion.path
            animate={controls}
            d="m7 9 5-5 5 5"
            initial={shouldAnimate ? "animate" : "normal"}
            transition={DEFAULT_TRANSITION}
            variants={{
              normal: { translateY: "0%" },
              animate: { translateY: "-2px" },
            }}
          />
        </svg>
      </div>
    );
  },
);

ChevronsUpDownIcon.displayName = "ChevronsUpDownIcon";

export { ChevronsUpDownIcon };
