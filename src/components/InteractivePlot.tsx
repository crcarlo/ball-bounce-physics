import * as React from "react";
import { distance, Vector2D } from "../util/math";
import Arrow from "./Arrow";
import BaseSVG from "./BaseSVG";
import Circle from "./Circle";
import Point from "./Point";
import PointsDebug from "./PointsDebug";
import { IState, IAction, IDerivedElements } from "../util/types";

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

export const getPoint = (id: string, state: IState) => {
  const point = state.points.find((point) => point.id === id);
  if (point) {
    return new Vector2D(point.x, point.y);
  }
};

interface InteractivePlotProps {
  initialState: IState;
  getDerivedElements: (state: IState) => IDerivedElements | undefined;
}

export default function InteractivePlot({
  initialState,
  getDerivedElements,
}: InteractivePlotProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const svgRef = React.createRef<SVGSVGElement>();

  const derivedState = getDerivedElements(state);

  if (!derivedState) {
    throw new Error(
      "getDerivedElements is returning null! Check it and fix it!"
    );
  }

  const { circles, arrows } = derivedState;

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
        <PointsDebug x={10} y={10} points={state.points} />
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
