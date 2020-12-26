import * as React from "react";
import { Vector2D } from "./math";

export function usePointState(initialPosition: Vector2D) {
  const [position, setPosition] = React.useState(initialPosition);
  const [dragging, setDragging] = React.useState(false);

  return { position, setPosition, dragging, setDragging };
}
