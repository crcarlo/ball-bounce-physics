import clsx from "clsx";
import * as React from "react";
import { Vector2D } from "../util/math";

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  error?: boolean;
  transparent?: boolean;
}

export default function Circle({
  x,
  y,
  radius,
  error,
  transparent,
}: CircleProps) {
  const [active, setActive] = React.useState(false);

  return (
    <>
      <circle
        className={clsx(
          "circle",
          error && "circle-error",
          transparent && "circle-transparent"
        )}
        cx={x}
        cy={y}
        r={radius}
        stroke={error ? "red" : "black"}
        fill="transparent"
        stroke-dasharray={transparent ? 4 : 0}
      />
    </>
  );
}
