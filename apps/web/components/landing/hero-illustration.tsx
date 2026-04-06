"use client";

import { useEffect, useId } from "react";
import { motion, useAnimationControls } from "motion/react";

type HeroIllustrationProps = {
  className?: string;
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const HeroIllustration = ({ className }: HeroIllustrationProps) => {
  const uid = useId().replace(/:/g, "");
  const logoMaskId = `hero-logo-mask-${uid}`;

  const baseControls = useAnimationControls();
  const strokeControls = useAnimationControls();
  const logoControls = useAnimationControls();

  useEffect(() => {
    let isActive = true;

    const runSequence = async () => {
      await sleep(900);
      if (!isActive) return;

      await baseControls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.75, ease: "easeOut" },
      });

      await sleep(140);
      if (!isActive) return;

      await strokeControls.start({
        opacity: 1,
        y: 0,
        pathLength: 1,
        transition: { duration: 0.75, ease: "easeInOut" },
      });

      await sleep(180);
      if (!isActive) return;

      await logoControls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
      });
    };

    void runSequence();

    return () => {
      isActive = false;
    };
  }, [baseControls, strokeControls, logoControls]);

  return (
    <svg
      width="606"
      height="409"
      viewBox="0 0 606 409"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shapeRendering="geometricPrecision"
    >
      <motion.g initial={{ opacity: 0, y: -80 }} animate={baseControls}>
        <path
          d="M271.958 65.5C283.915 58.5965 303.302 58.5964 315.259 65.5L594.506 226.724C606.464 233.627 606.464 244.82 594.506 251.723L333.354 402.5C321.396 409.404 302.01 409.404 290.052 402.5L10.8051 241.276C-1.15221 234.373 -1.1522 223.18 10.8051 216.277L271.958 65.5Z"
          stroke="#D4D4D4"
          strokeWidth="3"
        />
        <rect
          width="250"
          height="80"
          transform="matrix(0.866025 -0.5 0 1 330.947 287.5)"
          fill="#006045"
          stroke="#006045"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M287.646 12.5C299.603 5.59644 318.99 5.59644 330.947 12.5L547.453 137.5C559.411 144.404 559.411 155.596 547.453 162.5L330.947 287.5C318.99 294.404 299.603 294.404 287.646 287.5L71.1393 162.5C59.182 155.596 59.182 144.404 71.1393 137.5L287.646 12.5Z"
          fill="#FFFDF4"
        />
        <rect
          width="250"
          height="80"
          transform="matrix(0.866025 0.5 0 1 71.1393 162.5)"
          fill="#006045"
          stroke="#006045"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M62.1713 150C62.1713 154.882 65.5984 159.301 71.1393 162.5V242.5C65.5984 239.301 62.1713 234.882 62.1713 230V150Z"
          fill="#006045"
          stroke="#006045"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M287.646 287.5C299.603 294.404 318.99 294.404 330.947 287.5V367.5C318.99 374.404 299.603 374.404 287.646 367.5V287.5Z"
          fill="#006045"
          stroke="#006045"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M556.421 150C556.421 154.882 552.994 159.301 547.453 162.5V242.5C552.994 239.301 556.421 234.882 556.421 230V150Z"
          fill="#006045"
          stroke="#006045"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.g>

      <motion.path
        d="M287.311 12.5C299.269 5.59644 318.655 5.59644 330.613 12.5L547.119 137.5C559.076 144.404 559.076 155.596 547.119 162.5L330.613 287.5C318.655 294.404 299.269 294.404 287.311 287.5L70.8051 162.5C58.8478 155.596 58.8478 144.404 70.8051 137.5L287.311 12.5Z"
        stroke="#006045"
        strokeWidth="2"
        initial={{ opacity: 0, y: -46, pathLength: 0 }}
        animate={strokeControls}
      />

      <mask id={logoMaskId} style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="125" y="43" width="373" height="215">
        <path d="M125.154 158.703L325.558 43L497.154 142.071L296.751 257.774L125.154 158.703Z" fill="white" />
      </mask>
      <g mask={`url(#${logoMaskId})`}>
        <motion.path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M287.284 207.058C265.658 219.544 231.757 220.247 211.628 208.625C192.889 197.806 192.63 180.123 210.18 167.655C187.46 147.704 192.856 119.616 225.357 100.851C257.857 82.0873 306.507 78.9717 341.066 92.0876C362.66 81.9565 393.288 82.1062 412.027 92.9253C430.618 103.659 431.008 121.137 413.966 133.574C435.327 153.44 429.582 180.907 397.645 199.346C397.324 199.531 397.043 199.694 396.719 199.881L396.68 199.904C388.544 204.601 378.415 206.379 374.068 203.87C369.682 201.337 372.765 195.491 380.901 190.794C389.076 186.074 399.202 184.294 403.588 186.826C404.3 187.237 404.852 187.742 405.162 188.34C423.594 172.289 425.121 152.106 409.312 136.605L338.695 95.8348C306.566 83.0069 260.427 85.7103 229.779 103.405C199.131 121.099 194.449 147.737 216.668 166.287L287.284 207.058ZM362.896 149.987C372.369 156.897 369.04 168.555 354.704 176.832C340.407 185.086 320.214 187.008 308.247 181.539C320.203 182.816 335.505 179.653 347.547 172.7C359.629 165.724 365.109 156.89 362.896 149.987Z"
          fill="#006045"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ opacity: 0, y: -72, scale: 0.82 }}
          animate={logoControls}
        />
      </g>
    </svg>
  );
};

