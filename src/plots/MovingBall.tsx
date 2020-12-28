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
      y: 150,
      draggable: true,
    },
    {
      id: "B",
      x: 390,
      y: 150,
      draggable: true,
    },
  ],
  dragging: undefined,
};

const getDerivedElements = (state: IState): IDerivedElements | undefined => {
  const A = getPoint("A", state);
  const B = getPoint("B", state);

  if (A && B) {
    return {
      circles: [
        { center: A, radius: 60 },
        {
          center: B,
          radius: 60,
          transparent: true,
        },
      ],
      arrows: [{ start: A, end: B }],
      lines: [],
      derivedPoints: [],
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
