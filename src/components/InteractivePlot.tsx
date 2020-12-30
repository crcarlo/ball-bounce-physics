import * as React from "react";
import { distance, Vector2D } from "../util/math";
import Arrow from "./Arrow";
import BaseSVG from "./BaseSVG";
import Circle from "./Circle";
import Point from "./Point";
import PointsDebug from "./PointsDebug";
import { IState, IAction, IDerivedElements } from "../util/types";
import { POINTS_DEBUG } from "../util/env";
import Line from "./Line";

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

interface InteractivePlotProps {
  initialState: IState;
  getDerivedElements: (state: IState) => IDerivedElements;
  nextDerivedElementsGetters?: ((
    state: IState,
    derivedElements: IDerivedElements
  ) => IDerivedElements)[];
}

const mergeArrays = <T extends unknown>(a?: T[], b?: T[]): T[] => {
  const _a = a || [];
  const _b = b || [];
  return [..._a, ..._b];
};

const mergeDerivedStates = (
  a: IDerivedElements,
  b: IDerivedElements
): IDerivedElements => ({
  arrows: mergeArrays(a.arrows, b.arrows),
  circles: mergeArrays(a.circles, b.circles),
  derivedPoints: mergeArrays(a.derivedPoints, b.derivedPoints),
  lines: mergeArrays(a.lines, b.lines),
});

const getMergedDerivedStates = (
  state: IState,
  derivedState: IDerivedElements,
  nextDerivedElementsGetters: ((
    state: IState,
    derivedElements: IDerivedElements
  ) => IDerivedElements)[]
) =>
  mergeDerivedStates(
    derivedState,
    nextDerivedElementsGetters.reduce(
      (acc, currGetter) => currGetter(state, acc),
      derivedState
    )
  );

export default function InteractivePlot({
  initialState,
  getDerivedElements,
  nextDerivedElementsGetters,
}: InteractivePlotProps) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const svgRef = React.createRef<SVGSVGElement>();

  const derivedState = getDerivedElements(state);

  const mergedDerivedStates = nextDerivedElementsGetters
    ? getMergedDerivedStates(state, derivedState, nextDerivedElementsGetters)
    : derivedState;

  const { circles, arrows, lines, derivedPoints } = mergedDerivedStates;

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
        {lines?.map(({ start, end, error, label }) => (
          <Line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
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
        {derivedPoints?.map(({ x, y, id }) => (
          <Point
            x={x}
            y={y}
            key={id}
            label={id}
            draggable={false}
            dragging={state.dragging === id}
            setDragging={(dragging) => {
              dispatch({
                type: "set-dragging",
                dragging: dragging ? id : undefined,
              });
            }}
          />
        ))}
        {state.points.map(({ x, y, id, draggable }) => (
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
        ))}
      </>
    </BaseSVG>
  );
}
