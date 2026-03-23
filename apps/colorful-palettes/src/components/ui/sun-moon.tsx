"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

import { cn } from "#/lib/utils";

export interface SunMoonIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface SunMoonIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  animate?: boolean;
  play?: boolean;
}

const SUN_VARIANTS: Variants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [0, -5, 5, -2, 2, 0],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

const MOON_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};

const SunMoonIcon = forwardRef<SunMoonIconHandle, SunMoonIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 28, animate, play, ...props }, ref) => {
    const sunControls = useAnimation();
    const moonControls = useAnimation();
    const imperativeControlRef = useRef(false);
    const isPropControlled = animate !== undefined || play !== undefined;
    const shouldAnimate = animate ?? play ?? false;

    useImperativeHandle(ref, () => {
      imperativeControlRef.current = true;

      return {
        startAnimation: () => {
          void sunControls.start("animate");
          void moonControls.start("animate");
        },
        stopAnimation: () => {
          void sunControls.start("normal");
          void moonControls.start("normal");
        },
      };
    });

    useEffect(() => {
      if (!isPropControlled) {
        return;
      }

      if (shouldAnimate) {
        void sunControls.start("animate");
        void moonControls.start("animate");
      } else {
        void sunControls.start("normal");
        void moonControls.start("normal");
      }
    }, [isPropControlled, shouldAnimate, sunControls, moonControls]);

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (imperativeControlRef.current || isPropControlled) {
          onMouseEnter?.(e);
        } else {
          void sunControls.start("animate");
          void moonControls.start("animate");
        }
      },
      [sunControls, moonControls, onMouseEnter, isPropControlled],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (imperativeControlRef.current || isPropControlled) {
          onMouseLeave?.(e);
        } else {
          void sunControls.start("normal");
          void moonControls.start("normal");
        }
      },
      [sunControls, moonControls, onMouseLeave, isPropControlled],
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
          <motion.g
            animate={sunControls}
            initial={shouldAnimate ? "animate" : "normal"}
            variants={SUN_VARIANTS}
          >
            <path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4" />
          </motion.g>
          {[
            "M12 2v2",
            "M12 20v2",
            "m4.9 4.9 1.4 1.4",
            "m17.7 17.7 1.4 1.4",
            "M2 12h2",
            "M20 12h2",
            "m6.3 17.7-1.4 1.4",
            "m19.1 4.9-1.4 1.4",
          ].map((d, index) => (
            <motion.path
              animate={moonControls}
              custom={index + 1}
              d={d}
              initial={shouldAnimate ? "animate" : "normal"}
              key={d}
              variants={MOON_VARIANTS}
            />
          ))}
        </svg>
      </div>
    );
  },
);

SunMoonIcon.displayName = "SunMoonIcon";

export { SunMoonIcon };
