import clsx from "clsx";
import * as React from "react";
import { Vector2D } from "../util/math";

interface PointProps {
  x: number;
  y: number;
  draggable: boolean;
  dragging: boolean;
  label?: string;
  key: string;
  setDragging: (dragging: boolean) => void;
}

export default function Point({
  x,
  y,
  label,
  setDragging,
  dragging,
}: PointProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <>
      {label && (
        <text x={x + 7} y={y - 7} className="point-label">
          {label}
        </text>
      )}
      <circle
        className="point"
        cx={x}
        cy={y}
        r={4}
        fill="black"
        onMouseDown={() => {
          setDragging(true);
        }}
        onMouseUp={() => {
          setDragging(false);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </>
  );
}
