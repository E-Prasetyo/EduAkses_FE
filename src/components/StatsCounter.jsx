import React, { useState, useEffect } from "react";

const StatsCounter = ({ number, suffix = "", label, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * number));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [number, duration]);

  return (
    <div className="text-center p-4">
      <div
        className="d-inline-flex align-items-center justify-content-center mb-3 bg-edu-primary rounded-circle"
        style={{ width: "80px", height: "80px" }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      <h2 className="display-4 font-exo fw-bold text-edu-primary mb-2">
        {count.toLocaleString("id-ID")}
        <span className="text-edu-primary">{suffix}</span>
      </h2>
      <p className="text-muted font-jost fw-medium mb-0">{label}</p>
    </div>
  );
};

export default StatsCounter;
