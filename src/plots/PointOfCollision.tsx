import * as React from "react";
import ReactDOM from "react-dom";
import InteractivePlot, { getPoint } from "../components/InteractivePlot";
import {
  circleLineIntersection,
  distance,
  MathCircle,
  MathLine,
  perpendicularLine,
} from "../util/math";
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

const drivedElementsGetters = [
  (state: IState): IDerivedElements => {
    const A = getPoint("A", state);
    const B = getPoint("B", state);
    const C = getPoint("C", state);

    if (A && B && C) {
      const circle: MathCircle = { center: C, radius: 120 };
      const line: MathLine = { through: A, direction: B.subtract(A) };

      const aInside = distance(A, C) < 120;
      const bInside = distance(B, C) < 120;

      const points =
        !aInside && bInside ? circleLineIntersection(circle, line) : [];

      return {
        circles: [
          { center: C, radius: 60 },
          { center: C, radius: 120, transparent: true },
        ],
        arrows: [{ start: A, end: B, error: bInside }],
        derivedPoints: points.map(({ x, y }, index) => ({
          id: `P${String(index + 1)}`,
          x,
          y,
        })),
      };
    }

    return {};
  },
  (state: IState, derivedElements: IDerivedElements): IDerivedElements => {
    const C = getPoint("C", state, derivedElements);
    const P1 = getPoint("P1", state, derivedElements);

    if (C && P1) {
      const tangent = perpendicularLine({
        direction: P1.subtract(C),
        through: P1,
      });

      const intersectionRadius = { start: C, end: P1 };

      const tangentLine = {
        start: tangent.through,
        end: tangent.through.add(tangent.direction),
      };

      return {
        lineSegments: [intersectionRadius, tangentLine],
      };
    }

    return {};
  },
];

export const mount = (id: string) => {
  ReactDOM.render(
    <React.StrictMode>
      <InteractivePlot
        initialState={initialState}
        drivedElementsGetters={drivedElementsGetters}
      />
    </React.StrictMode>,
    document.getElementById(id)
  );
};
