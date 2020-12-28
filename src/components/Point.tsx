import * as React from "react";
import clsx from "clsx";

import Label from "./Label";

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
  draggable,
  dragging,
}: PointProps) {
  return (
    <>
      {label && <Label x={x + 7} y={y - 7} text={label} />}
      <circle
        className={clsx("point", draggable && "point-draggable")}
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
      />
    </>
  );
}
