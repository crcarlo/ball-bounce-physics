import * as React from "react";
import ReactDOM from "react-dom";
import BaseSVG from "./components/BaseSVG";
import Circle from "./components/Circle";
import Point from "./components/Point";

interface IPoint {
  x: number;
  y: number;
  id: string;
  draggable: boolean;
}

interface IState {
  points: IPoint[];
  dragging?: string;
}

const initialState: IState = {
  points: [
    {
      id: "C",
      x: 100,
      y: 100,
      draggable: true,
    },
    {
      id: "A",
      x: 200,
      y: 200,
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

const getPoint = (id: string, state: IState) =>
  state.points.find((point) => point.id === id);

function CircleLineIntersection() {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const svgRef = React.createRef<SVGSVGElement>();

  const circles = [];

  const C = getPoint("C", state);
  const A = getPoint("A", state);

  if (C) {
    circles.push({ x: C.x, y: C.y, radius: 60 });
  }

  if (A) {
    circles.push({ x: A.x, y: A.y, radius: 60 });
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
        {circles.map(({ x, y, radius }) => (
          <Circle x={x} y={y} radius={radius} />
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
