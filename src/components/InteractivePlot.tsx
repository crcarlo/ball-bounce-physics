import * as React from "react";

import Arrow from "./Arrow";
import BaseSVG from "./BaseSVG";
import Circle from "./Circle";
import Point from "./Point";
import PointsDebug from "./PointsDebug";
import LineSegment from "./LineSegment";

import { POINTS_DEBUG } from "../util/env";
import { distance, Vector2D } from "../util/math";
import { IState, IAction, IDerivedElements } from "../util/types";
import Line from "./Line";

function reducer(state: IState, action: IAction): IState {
  switch (action.type) {
    case "set-dragging":
      return {
        points: state.points,
        dragging: action.dragging,
        alredyDragged: true,
      };
    case "move":
      const { x, y, pointId } = action;
      return {
        ...state,
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

export const getPoint = (
  id: string,
  state: IState,
  derivedElements?: IDerivedElements
) => {
  const point = state.points.find((point) => point.id === id);
  if (point) {
    return new Vector2D(point.x, point.y);
  }
  const pointDerived = derivedElements?.derivedPoints?.find(
    (point) => point.id === id
  );
  if (pointDerived) {
    return new Vector2D(pointDerived.x, pointDerived.y);
  }
};

const mergeArrays = <T extends unknown>(a?: T[], b?: T[]): T[] => {
  const _a = a || [];
  const _b = b || [];
  return [..._a, ..._b];
};

const mergeDerivedElements = (
  a: IDerivedElements,
  b: IDerivedElements
): IDerivedElements => ({
  arrows: mergeArrays(a.arrows, b.arrows),
  circles: mergeArrays(a.circles, b.circles),
  derivedPoints: mergeArrays(a.derivedPoints, b.derivedPoints),
  lineSegments: mergeArrays(a.lineSegments, b.lineSegments),
  lines: mergeArrays(a.lines, b.lines),
});

const getMergedDerivedElements = (
  state: IState,
  drivedElementsGetters: ((
    state: IState,
    derivedElements: IDerivedElements
  ) => IDerivedElements)[]
): IDerivedElements =>
  drivedElementsGetters.reduce(
    (acc, currGetter) => mergeDerivedElements(acc, currGetter(state, acc)),
    {}
  );

interface InteractivePlotProps {
  initialState: IState;
  drivedElementsGetters?: ((
    state: IState,
    derivedElements: IDerivedElements
  ) => IDerivedElements)[];
  tutorial: string;
}

export default function InteractivePlot({
  initialState,
  drivedElementsGetters,
  tutorial,
}: InteractivePlotProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const svgRef = React.createRef<SVGSVGElement>();

  const mergedDerivedStates = drivedElementsGetters
    ? getMergedDerivedElements(state, drivedElementsGetters)
    : {};

  const { circles, arrows, lineSegments, lines, derivedPoints } =
    mergedDerivedStates;

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
        {POINTS_DEBUG && <PointsDebug x={10} y={10} points={state.points} />}
        {circles?.map(({ center, radius, error, transparent }) => (
          <Circle
            x={center.x}
            y={center.y}
            radius={radius}
            error={error}
            transparent={transparent}
          />
        ))}
        {lineSegments?.map(({ start, end, error, label }) => (
          <LineSegment
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            label={label}
            transparent
            error={error}
          />
        ))}
        {lines?.map(({ through, direction, error, label }) => (
          <Line
            x={through.x}
            y={through.y}
            dx={direction.x}
            dy={direction.y}
            label={label}
            transparent
            error={error}
          />
        ))}
        {arrows?.map(({ start, end, error }) => (
          <Arrow
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            transparent
            error={error}
          />
        ))}
        {derivedPoints?.map(
          ({ x, y, id, hidden }) =>
            !hidden && <Point x={x} y={y} key={id} label={id} />
        )}
        {state.points.map(({ x, y, id, draggable }) => (
          <g key={id}>
            {!state.alredyDragged && id === tutorial && (
              <text className="tutorial-marker" x={x - 40} y={y + 8}>
                👉
              </text>
            )}
            <Point
              x={x}
              y={y}
              key={id}
              label={id}
              draggable={draggable || false}
              dragging={state.dragging === id}
              setDragging={(dragging) => {
                dispatch({
                  type: "set-dragging",
                  dragging: dragging ? id : undefined,
                });
              }}
            />
          </g>
        ))}
      </>
    </BaseSVG>
  );
}
