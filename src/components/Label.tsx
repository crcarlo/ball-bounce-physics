import * as React from "react";
import clsx from "clsx";

interface LabelProps {
  x: number;
  y: number;
  text: string;
  className?: string;
}

export default function Label({ x, y, text, className }: LabelProps) {
  return (
    <g className={clsx("label", className)}>
      <text x={x} y={y} className={"label-outline"}>
        {text}
      </text>
      <text x={x} y={y}>
        {text}
      </text>
    </g>
  );
}
