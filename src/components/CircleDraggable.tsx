import * as React from "react";
import { Vector2D } from "../util/math";

interface CircleDraggableProps {
  x: number;
  y: number;
  radius: number;
  onDrag?: (coords: Vector2D) => void;
}

export default function CircleDraggable({
  x,
  y,
  radius,
  onDrag,
}: CircleDraggableProps) {
  const [active, setActive] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  return (
    <>
      <circle
        cx={x}
        cy={y}
        r={radius}
        stroke={active ? "red" : "black"}
        fill="transparent"
      />
      <circle
        className="circle-handle"
        cx={x}
        cy={y}
        r={4}
        fill="black"
        onMouseDown={() => {
          setDragging(true);
        }}
        onMouseMove={(e) => {
          if (dragging) {
            onDrag && onDrag(new Vector2D(e.clientX, e.clientY));
          }
        }}
        onMouseUp={() => {
          setDragging(false);
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      />
    </>
  );
}
