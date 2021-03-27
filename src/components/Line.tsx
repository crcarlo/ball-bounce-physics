import * as React from "react";

import Label from "./Label";

import { MathLine, Vector2D } from "../util/math";

interface LineProps {
  x: number;
  y: number;
  dx: number;
  dy: number;
  label?: string;
  error?: boolean;
  transparent?: boolean;
}

export default function Line({
  x,
  y,
  dx,
  dy,
  label,
  error,
  transparent,
}: LineProps) {
  const middle = { x: x + (dx - x) / 2, y: y + (dy - y) / 2 };
  const line: MathLine = {
    through: new Vector2D(x, y),
    direction: new Vector2D(dx, dy),
  };
  const aFar = line.through.add(line.direction.multiplyScalar(100));
  const bFar = line.through.add(line.direction.multiplyScalar(-100));
  return (
    <>
      {label && (
        <Label x={middle.x} y={middle.y} text={label} className="line-label" />
      )}
      <line
        x1={aFar.x}
        y1={aFar.y}
        x2={bFar.x}
        y2={bFar.y}
        stroke={error ? "red" : "black"}
        strokeDasharray={transparent ? 4 : 0}
      />
    </>
  );
}
