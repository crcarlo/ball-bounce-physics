import * as React from "react";

interface LabelProps {
  x: number;
  y: number;
  text: string;
}

export default function Label({ x, y, text }: LabelProps) {
  return (
    <>
      <text x={x} y={y} className="label-outline">
        {text}
      </text>
      <text x={x} y={y}>
        {text}
      </text>
    </>
  );
}
