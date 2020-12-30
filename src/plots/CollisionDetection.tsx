import * as React from "react";
import ReactDOM from "react-dom";
import InteractivePlot, { getPoint } from "../components/InteractivePlot";
import { distance } from "../util/math";
import { IDerivedElements, IState } from "../util/types";

const initialState: IState = {
  points: [
    {
      id: "A",
      x: 250,
      y: 120,
      draggable: true,
    },
    {
      id: "B",
      x: 350,
      y: 120,
      draggable: true,
    },
    {
      id: "C",
      x: 400,
      y: 200,
      draggable: true,
    },
  ],
  dragging: undefined,
};

const getDerivedElements = (state: IState): IDerivedElements => {
  const A = getPoint("A", state);
  const B = getPoint("B", state);
  const C = getPoint("C", state);

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
      lines: [
        {
          start: B,
          end: C,
          label:
            distance(B, C) < 120
              ? "distance(B, C) < rB + rC = Collision!"
              : "distance(B, C) > rB + rC = No collision",
          error: distance(B, C) < 120,
        },
      ],
      derivedPoints: [],
    };
  }

  return {};
};

export const mount = (id: string) => {
  ReactDOM.render(
    <React.StrictMode>
      <InteractivePlot
        initialState={initialState}
        getDerivedElements={getDerivedElements}
      />
    </React.StrictMode>,
    document.getElementById(id)
  );
};
