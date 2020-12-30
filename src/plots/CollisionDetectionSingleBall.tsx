import * as React from "react";
import ReactDOM from "react-dom";
import InteractivePlot, { getPoint } from "../components/InteractivePlot";
import { distance } from "../util/math";
import { IDerivedElements, IState } from "../util/types";

const initialState: IState = {
  points: [
    {
      id: "A",
      x: 230,
      y: 90,
      draggable: true,
    },
    {
      id: "B",
      x: 330,
      y: 90,
      draggable: true,
    },
    {
      id: "C",
      x: 380,
      y: 170,
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
        { center: C, radius: 120, transparent: true },
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
