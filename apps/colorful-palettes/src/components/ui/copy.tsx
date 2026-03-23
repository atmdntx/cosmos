"use client";

import type { Transition } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "#/lib/utils";

export interface CopyIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CopyIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animate?: boolean;
  play?: boolean;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 17,
  mass: 1,
};

const CopyIcon = forwardRef<CopyIconHandle, CopyIconProps>(
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
          <motion.rect
            animate={controls}
            height="14"
            initial={shouldAnimate ? "animate" : "normal"}
            rx="2"
            ry="2"
            transition={DEFAULT_TRANSITION}
            variants={{
              normal: { translateY: 0, translateX: 0 },
              animate: { translateY: -3, translateX: -3 },
            }}
            width="14"
            x="8"
            y="8"
          />
          <motion.path
            animate={controls}
            d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
            initial={shouldAnimate ? "animate" : "normal"}
            transition={DEFAULT_TRANSITION}
            variants={{
              normal: { x: 0, y: 0 },
              animate: { x: 3, y: 3 },
            }}
          />
        </svg>
      </div>
    );
  },
);

CopyIcon.displayName = "CopyIcon";

export { CopyIcon };
