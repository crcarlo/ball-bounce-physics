import * as React from "react";
import ReactDOM from "react-dom";
import InteractivePlot, { getPoint } from "./components/InteractivePlot";
import { distance } from "./util/math";
import { IDerivedElements, IState } from "./util/types";

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

const getDerivedElements = (state: IState): IDerivedElements | undefined => {
  const C = getPoint("C", state);
  const A = getPoint("A", state);
  const B = getPoint("B", state);

  if (A && B && C) {
    return {
      circles: [
        { center: C, radius: 60 },
        { center: A, radius: 60, error: distance(A, C) < 120 },
        {
          center: B,
          radius: 60,
          error: distance(B, C) < 120,
          transparent: true,
        },
      ],
      arrows: [{ start: A, end: B, error: distance(B, C) < 120 }],
    };
  }
};

function CircleLineIntersection() {
  return (
    <InteractivePlot
      initialState={initialState}
      getDerivedElements={getDerivedElements}
    />
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
