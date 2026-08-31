import React, { useEffect, useRef, useState } from "react";

// Fades/slides a section in the first time it scrolls into view. Simple
// on purpose - one IntersectionObserver, one CSS transition.
const Reveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`cx-reveal ${visible ? "cx-reveal--visible" : ""} ${className}`}>
      {children}
    </div>
  );
};

export default Reveal;
