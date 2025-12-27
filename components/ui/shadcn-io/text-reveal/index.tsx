'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export const TextReveal = ({
  text,
  revealText,
  className,
}: {
  text: string;
  revealText: string;
  className?: string;
}) => {
  const [widthPercentage, setWidthPercentage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [localWidth, setLocalWidth] = useState(0);
  const [isMouseOver, setIsMouseOver] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const { left, width: localWidth } =
        containerRef.current.getBoundingClientRect();
      setLeft(left);
      setLocalWidth(localWidth);
    }
  }, []);

  function mouseMoveHandler(event: React.MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    const { clientX } = event;
    if (containerRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    setWidthPercentage(0);
  }

  function mouseEnterHandler() {
    setIsMouseOver(true);
  }

  function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
    event.preventDefault();
    const clientX = event.touches[0]!.clientX;
    if (containerRef.current) {
      const relativeX = clientX - left;
      setWidthPercentage((relativeX / localWidth) * 100);
    }
  }

  return (
    <div
      onMouseEnter={mouseEnterHandler}
      onMouseLeave={mouseLeaveHandler}
      onMouseMove={mouseMoveHandler}
      onTouchStart={mouseEnterHandler}
      onTouchEnd={mouseLeaveHandler}
      onTouchMove={touchMoveHandler}
      ref={containerRef}
      className={cn(
        'relative flex items-center overflow-hidden cursor-pointer',
        className
      )}
    >
      {/* Revealed text layer */}
      <motion.div
        style={{
          width: '100%',
        }}
        animate={
          isMouseOver
            ? {
                opacity: widthPercentage > 0 ? 1 : 0,
                clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
              }
            : {
                clipPath: `inset(0 ${100 - widthPercentage}% 0 0)`,
              }
        }
        transition={isMouseOver ? { duration: 0 } : { duration: 0.4 }}
        className="absolute z-20 will-change-transform bg-white dark:bg-black"
      >
        <p className="text-2xl md:text-7xl text-gray-950 dark:text-gray-50">
          {revealText}
        </p>
      </motion.div>

      {/* Base text layer */}
      <div className="overflow-hidden">
        <p className="text-2xl md:text-7xl text-gray-950 dark:text-gray-50">
          {text}
        </p>
      </div>
    </div>
  );
};