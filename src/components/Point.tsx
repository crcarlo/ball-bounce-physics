import * as React from "react";
import clsx from "clsx";

import Label from "./Label";

interface PointProps {
  x: number;
  y: number;
  draggable?: boolean;
  dragging?: boolean;
  label?: string;
  key: string;
  setDragging?: (dragging: boolean) => void;
}

export default function Point({
  x,
  y,
  label,
  setDragging,
  draggable,
  dragging,
}: PointProps) {
  return (
    <g
      className={clsx(
        "point",
        draggable && "point-draggable",
        dragging && "dragging"
      )}
    >
      {label && (
        <Label x={x + 7} y={y - 7} text={label} className="point-label" />
      )}
      <circle
        className="point-dot"
        cx={x}
        cy={y}
        r={4}
        fill="black"
        onMouseDown={() => setDragging && setDragging(true)}
        onMouseUp={() => setDragging && setDragging(false)}
      />
    </g>
  );
}
