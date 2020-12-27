import * as React from "react";
interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  error?: boolean;
  transparent?: boolean;
}

export default function Arrow({
  x1,
  y1,
  x2,
  y2,
  error,
  transparent,
}: ArrowProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan(dy / dx) * (180 / Math.PI) + 90 + (dx >= 0 ? 180 : 0);

  return (
    <>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={error ? "red" : "black"}
        stroke-dasharray={transparent ? 4 : 0}
      />
      <g transform={`translate(${x2},${y2}) rotate(${angle})`}>
        <line x1={-5} y1={-10} x2={0} y2={0} stroke={error ? "red" : "black"} />
        <line x1={5} y1={-10} x2={0} y2={0} stroke={error ? "red" : "black"} />
        <line
          x1={5}
          y1={-10}
          x2={-5}
          y2={-10}
          stroke={error ? "red" : "black"}
        />
      </g>
    </>
  );
}
