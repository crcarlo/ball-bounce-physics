import * as React from "react";
import ReactDOM from "react-dom";
import InteractivePlot, { getPoint } from "../components/InteractivePlot";
import { distance } from "../util/math";
import { IDerivedElements, IState } from "../util/types";

const initialState: IState = {
  points: [
    {
      id: "A",
      x: 290,
      y: 100,
      draggable: true,
    },
    {
      id: "B",
      x: 390,
      y: 100,
      draggable: true,
    },
    {
      id: "C",
      x: 440,
      y: 180,
      draggable: true,
    },
  ],
  dragging: undefined,
};

const getDerivedElements = (state: IState): IDerivedElements | undefined => {
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
    };
  }
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
