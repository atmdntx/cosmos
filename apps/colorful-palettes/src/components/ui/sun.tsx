"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "#/lib/utils";

export interface SunIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SunIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animate?: boolean;
  play?: boolean;
}

const PATH_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const SunIcon = forwardRef<SunIconHandle, SunIconProps>(
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
          <circle cx="12" cy="12" r="4" />
          {[
            "M12 2v2",
            "m19.07 4.93-1.41 1.41",
            "M20 12h2",
            "m17.66 17.66 1.41 1.41",
            "M12 20v2",
            "m6.34 17.66-1.41 1.41",
            "M2 12h2",
            "m4.93 4.93 1.41 1.41",
          ].map((d, index) => (
            <motion.path
              animate={controls}
              custom={index + 1}
              d={d}
              initial={shouldAnimate ? "animate" : "normal"}
              key={d}
              variants={PATH_VARIANTS}
            />
          ))}
        </svg>
      </div>
    );
  },
);

SunIcon.displayName = "SunIcon";

export { SunIcon };
