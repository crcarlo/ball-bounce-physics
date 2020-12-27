import clsx from "clsx";
import * as React from "react";
import { Vector2D } from "../util/math";

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
  const [active, setActive] = React.useState(false);

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
    </>
  );
}
