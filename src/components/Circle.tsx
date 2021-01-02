import clsx from "clsx";
import * as React from "react";

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
        strokeDasharray={transparent ? 4 : 0}
      />
    </>
  );
}
