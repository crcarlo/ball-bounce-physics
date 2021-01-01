import { Vector2D } from "./math";

export interface IPoint {
  x: number;
  y: number;
  id: string;
  draggable?: boolean;
}

export interface IState {
  points: IPoint[];
  dragging?: string;
}

export interface ICircle {
  center: Vector2D;
  radius: number;
  transparent?: boolean;
  error?: boolean;
}

export interface IArrow {
  start: Vector2D;
  end: Vector2D;
  error?: boolean;
}

export interface ILineSegment {
  start: Vector2D;
  end: Vector2D;
  label?: string;
  error?: boolean;
}

export interface IDerivedElements {
  circles?: ICircle[];
  arrows?: IArrow[];
  lineSegments?: ILineSegment[];
  derivedPoints?: IPoint[];
}

export interface IAction {
  type: "set-dragging" | "move";
  pointId?: string;
  dragging?: string;
  x?: number;
  y?: number;
}
