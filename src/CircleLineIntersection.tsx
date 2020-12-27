import * as React from "react";
import ReactDOM from "react-dom";
import Arrow from "./components/Arrow";
import BaseSVG from "./components/BaseSVG";
import Circle from "./components/Circle";
import Point from "./components/Point";
import PointsDebug from "./components/PointsDebug";
import { distance, Vector2D } from "./util/math";

const initialState: IState = {
  points: [
    {
      id: "A",
      x: 200,
      y: 200,
      draggable: true,
    },
    {
      id: "B",
      x: 100,
      y: 200,
      draggable: true,
    },
    {
      id: "C",
      x: 100,
      y: 100,
      draggable: true,
    },
  ],
  dragging: undefined,
};

interface IAction {
  type: "set-dragging" | "move";
  pointId?: string;
  dragging?: string;
  x?: number;
  y?: number;
}

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "set-dragging":
      return { points: state.points, dragging: action.dragging };
    case "move":
      const { x, y, pointId } = action;
      return {
        points: state.points.map(({ id, ...restPoint }) =>
          pointId === id
            ? { id, ...restPoint, x: x || 0, y: y || 0 }
            : { id, ...restPoint }
        ),
        dragging: state.dragging,
      };
    default:
      throw new Error();
  }
}

const getPoint = (id: string, state: IState) => {
  const point = state.points.find((point) => point.id === id);
  if (point) {
    return new Vector2D(point.x, point.y);
  }
};

function CircleLineIntersection() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const svgRef = React.createRef<SVGSVGElement>();

  const arrows = [];
  const circles = [];

  const C = getPoint("C", state);
  const A = getPoint("A", state);
  const B = getPoint("B", state);

  if (A && B && C) {
    circles.push({ center: C, radius: 60 });

    circles.push({ center: A, radius: 60, error: distance(A, C) < 120 });

    circles.push({
      center: B,
      radius: 60,
      error: distance(B, C) < 120,
      transparent: true,
    });

    arrows.push({ start: A, end: B, error: distance(B, C) < 120 });
  }

  return (
    <BaseSVG
      ref={svgRef}
      onMouseMove={(e) => {
        if (state.dragging) {
          const boundingRect = svgRef.current?.getBoundingClientRect();
          if (boundingRect) {
            dispatch({
              type: "move",
              pointId: state.dragging,
              x: e.clientX - boundingRect.left,
              y: e.clientY - boundingRect.top,
            });
          }
        }
      }}
    >
      <>
        <PointsDebug x={10} y={10} points={state.points}></PointsDebug>
        {circles.map(({ center, radius, error, transparent }) => (
          <Circle
            x={center.x}
            y={center.y}
            radius={radius}
            error={error}
            transparent={transparent}
          />
        ))}
        {arrows.map(({ start, end, error }) => (
          <Arrow
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            transparent
            error={error}
          />
        ))}
        {state.points.map(({ x, y, id, draggable }) => (
          <Point
            x={x}
            y={y}
            key={id}
            label={id}
            draggable={draggable}
            dragging={state.dragging === id}
            setDragging={(dragging) => {
              dispatch({
                type: "set-dragging",
                dragging: dragging ? id : undefined,
              });
            }}
          />
        ))}
      </>
    </BaseSVG>
  );
}

export const mount = (id: string) => {
  ReactDOM.render(
    <React.StrictMode>
      <CircleLineIntersection />
    </React.StrictMode>,
    document.getElementById(id)
  );
};
