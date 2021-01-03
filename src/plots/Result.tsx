import * as React from "react";
import ReactDOM from "react-dom";
import InteractivePlot, { getPoint } from "../components/InteractivePlot";
import {
  circleLineIntersection,
  distance,
  linesIntersection,
  MathCircle,
  MathLine,
  perpendicularLine,
  symmetricPoint,
} from "../util/math";
import { ICircle, IDerivedElements, IPoint, IState } from "../util/types";

const initialState: IState = {
  points: [
    {
      id: "A",
      x: 210,
      y: 230,
      draggable: true,
    },
    {
      id: "B",
      x: 350,
      y: 110,
      draggable: true,
    },
    {
      id: "C",
      x: 400,
      y: 190,
      draggable: true,
    },
  ],
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
          { center: A, radius: 60 },
          // { center: B, radius: 60, transparent: true },
          { center: C, radius: 60 },
        ],
        arrows: [{ start: A, end: B, error: bInside }],
        derivedPoints: points.map(({ x, y }, index) => ({
          id: `P${String(index + 1)}`,
          x,
          y,
          hidden: true,
        })),
      };
    }

    return {};
  },
  (state: IState, derivedElements: IDerivedElements): IDerivedElements => {
    const B = getPoint("B", state, derivedElements);
    const C = getPoint("C", state, derivedElements);
    const P1 = getPoint("P1", state, derivedElements);

    if (B && C && P1) {
      const radiusDirection = P1.subtract(C);

      const tangent = perpendicularLine({
        direction: radiusDirection,
        through: P1,
      });

      const reflectionLine: MathLine = {
        through: B,
        direction: radiusDirection,
      };

      const M = linesIntersection(tangent, reflectionLine);
      const B1 = M && symmetricPoint(B, M);

      const B1circle = B1 && { center: B1, radius: 60 };

      const derivedPoints: IPoint[] = B1 ? [{ ...B1, id: "B1" }] : [];

      return {
        derivedPoints: derivedPoints,
        circles: [{ center: P1, radius: 60, transparent: true }],
      };
    }

    return {};
  },
  (state: IState, derivedElements: IDerivedElements): IDerivedElements => {
    const B1 = getPoint("B1", state, derivedElements);
    const P1 = getPoint("P1", state, derivedElements);

    if (B1 && P1) {
      return {
        circles: [{ center: B1, radius: 60 }],
        arrows: [{ start: P1, end: B1 }],
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
