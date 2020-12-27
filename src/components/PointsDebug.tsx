import * as React from "react";
import { IPoint } from "../util/types";

interface PointsDebugProps {
  x: number;
  y: number;
  points: IPoint[];
}

export default function PointsDebug({ x, y, points }: PointsDebugProps) {
  return (
    <>
      {points.map((point, index) => (
        <text x={x} y={y + 18 * index} className="point-debug">
          {point.id}: ({point.x | 0}, {point.y | 0})
        </text>
      ))}
    </>
  );
}
