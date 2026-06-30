// standard breakpoints for websites

export const breakpoints = {
  sm: 480,   // large phones
  md: 768,   // tablets
  lg: 1024,  // small desktops / landscape tablets
  xl: 1280,  // desktop
};

// use these in JS (useMediaQuery hook, conditional rendering)
export const mq = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
};