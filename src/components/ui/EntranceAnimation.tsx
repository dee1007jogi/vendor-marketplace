import React from "react";
import { motion, HTMLMotionProps, Variants, AnimatePresence } from "framer-motion";

export type AnimationDirection = "up" | "down" | "left" | "right" | "zoom" | "flip" | "none";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  className?: string;
}

export const entranceVariants: Record<AnimationDirection, (distance: number) => Variants> = {
  up: (distance) => ({
    hidden: { opacity: 0, y: distance },
    visible: { opacity: 1, y: 0 },
  }),
  down: (distance) => ({
    hidden: { opacity: 0, y: -distance },
    visible: { opacity: 1, y: 0 },
  }),
  left: (distance) => ({
    hidden: { opacity: 0, x: distance },
    visible: { opacity: 1, x: 0 },
  }),
  right: (distance) => ({
    hidden: { opacity: 0, x: -distance },
    visible: { opacity: 1, x: 0 },
  }),
  zoom: () => ({
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  }),
  flip: (distance) => ({
    hidden: { opacity: 0, rotateX: 18, y: distance },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  }),
  none: () => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }),
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 24,
  once = true,
  amount = 0.15,
  className = "",
  ...props
}) => {
  const variantFactory = entranceVariants[direction] || entranceVariants.up;
  const variants = variantFactory(distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number | "some" | "all";
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerChildren = 0.08,
  delayChildren = 0,
  once = true,
  amount = 0.1,
  className = "",
  ...props
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  direction?: AnimationDirection;
  distance?: number;
  duration?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  direction = "up",
  distance = 20,
  duration = 0.45,
  className = "",
  ...props
}) => {
  const variantFactory = entranceVariants[direction] || entranceVariants.up;
  const itemVariants = variantFactory(distance);

  return (
    <motion.div
      variants={{
        ...itemVariants,
        visible: {
          ...itemVariants.visible,
          transition: {
            duration,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const EntranceSection: React.FC<FadeInProps> = (props) => {
  return <FadeIn amount={0.1} duration={0.6} {...props} />;
};

export const PageEntrance: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* Tab Content Slide/Fade Transition */
export const TabTransition: React.FC<{
  tabKey: string | number;
  children: React.ReactNode;
  className?: string;
}> = ({ tabKey, children, className = "" }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        initial={{ opacity: 0, x: 12, y: 6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: -12, y: -6 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/* Button Click Press & Spring Micro-Interaction */
export const ButtonPress: React.FC<HTMLMotionProps<"button">> = ({
  children,
  className = "",
  whileHover = { scale: 1.02, y: -1 },
  whileTap = { scale: 0.96 },
  ...props
}) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

/* Viewport Scroll-Driven Section Slide Transition */
export const SectionScrollSlide: React.FC<{
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  className?: string;
  delay?: number;
}> = ({ children, direction = "left", className = "", delay = 0 }) => {
  const initialOffset = {
    left: { x: -45, opacity: 0 },
    right: { x: 45, opacity: 0 },
    up: { y: 45, opacity: 0 },
    down: { y: -45, opacity: 0 },
  }[direction];

  return (
    <motion.div
      initial={initialOffset}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* Accordion Open/Close Expansion Transition */
export const AccordionTransition: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, children, className = "" }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className={`overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FadeIn;
