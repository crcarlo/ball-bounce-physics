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
import { IDerivedElements, IPoint, IState } from "../util/types";

const initialState: IState = {
  points: [
    {
      id: "A",
      x: 240,
      y: 140,
      draggable: true,
    },
    {
      id: "B",
      x: 430,
      y: 140,
      draggable: true,
    },
    {
      id: "C",
      x: 430,
      y: 220,
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

      const intersectionRadius = { start: C, end: P1 };

      const M = linesIntersection(tangent, reflectionLine);

      const derivedPoints: IPoint[] = M
        ? [
            { id: "M", ...M },
            { ...symmetricPoint(B, M), id: "B1" },
          ]
        : [];

      return {
        derivedPoints: derivedPoints,
        lineSegments: [intersectionRadius],
        lines: [
          { direction: tangent.direction, through: tangent.through },
          reflectionLine,
        ],
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
