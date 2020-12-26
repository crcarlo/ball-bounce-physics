import clsx from "clsx";
import * as React from "react";
import { Vector2D } from "../util/math";

interface CircleDraggableProps {
  x: number;
  y: number;
  radius: number;
  dragging: boolean;
  setDragging: (dragging: boolean) => void;
  //onDrag?: (coords: Vector2D) => void;
}

export default function CircleDraggable({
  x,
  y,
  radius,
  setDragging,
  dragging,
}: //onDrag,
CircleDraggableProps) {
  const [active, setActive] = React.useState(false);
  //const [dragging, setDragging] = React.useState(false);

  return (
    <>
      <circle
        className={clsx(dragging && "circle-dragging")}
        cx={x}
        cy={y}
        r={radius}
        stroke={active ? "red" : "black"}
        fill="white"
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
        onMouseUp={() => {
          setDragging(false);
        }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      />
    </>
  );
}
