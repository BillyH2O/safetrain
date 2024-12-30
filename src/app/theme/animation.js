// animations.js

export const mainVariant = {
    initial: { x: 0, y: 0 },
    animate: { x: 20, y: -20, opacity: 0.9 },
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  };
  
  export const secondaryVariant = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };
  
  export const dropTextVariant = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3, ease: "easeOut" },
  };
  