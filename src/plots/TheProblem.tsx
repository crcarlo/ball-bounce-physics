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
      y: 120,
      draggable: true,
    },
    {
      id: "B",
      x: 390,
      y: 120,
      draggable: true,
    },
    {
      id: "C",
      x: 440,
      y: 200,
      draggable: true,
    },
    {
      id: "?",
      x: 370,
      y: 85,
      draggable: true,
    },
  ],
  dragging: undefined,
};

const getDerivedElements = (state: IState): IDerivedElements => {
  const A = getPoint("A", state);
  const B = getPoint("B", state);
  const C = getPoint("C", state);
  const Q = getPoint("?", state);

  if (A && B && C && Q) {
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
        {
          center: Q,
          radius: 60,
          error: distance(Q, C) < 120,
          transparent: true,
        },
      ],
      arrows: [
        { start: A, end: B, error: distance(B, C) < 120 },
        { start: B, end: Q },
      ],
      lines: [],
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
        drivedElementsGetters={[getDerivedElements]}
      />
    </React.StrictMode>,
    document.getElementById(id)
  );
};
