import * as React from "react";
import Label from "./Label";

interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  error?: boolean;
  transparent?: boolean;
}

export default function Line({
  x1,
  y1,
  x2,
  y2,
  label,
  error,
  transparent,
}: LineProps) {
  const middle = { x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2 };
  return (
    <>
      {label && <Label x={middle.x} y={middle.y} text={label} />}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={error ? "red" : "black"}
        strokeDasharray={transparent ? 4 : 0}
      />
    </>
  );
}
