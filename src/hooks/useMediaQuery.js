// enables JS to adjust CSS based on screenszie 
// links to styles/breakpoints.js

import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  // window.matchMedia(query) is browser API takes css media and returns object
  //    .matches is boolean test checking if send query (which is the current breakpoint) matches what is being loaded
  //    .useState(() => ...) runs check once on first redner to get starting value
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  // this is a lsitener
  //  
  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e) => setMatches(e.matches);
    // browser fires a change even if matches indicates false (query, ie. breakpoint is not matching)
    media.addEventListener('change', listener);
    // clean up function to removes listener to avoid memory leak
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
