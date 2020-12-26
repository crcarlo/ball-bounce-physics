import * as React from "react";
import ReactDOM from "react-dom";
import BaseSVG from "./components/BaseSVG";
import CircleDraggable from "./components/CircleDraggable";
import { Vector2D } from "./util/math";

function CircleLineIntersection() {
  const [circlePosition, setCirclePosition] = React.useState(
    new Vector2D(50, 50)
  );

  const svgRef = React.createRef<SVGSVGElement>();

  return (
    <BaseSVG ref={svgRef}>
      <CircleDraggable
        x={circlePosition.x}
        y={circlePosition.y}
        radius={40}
        onDrag={({ x, y }) => {
          const boundingRect = svgRef.current?.getBoundingClientRect();
          if (boundingRect) {
            setCirclePosition(
              new Vector2D(x - boundingRect.left, y - boundingRect.top)
            );
          }
        }}
      />
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
