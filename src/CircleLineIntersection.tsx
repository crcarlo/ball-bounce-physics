import * as React from "react";
import ReactDOM from "react-dom";
import BaseSVG from "./components/BaseSVG";
import CircleDraggable from "./components/CircleDraggable";
import { Vector2D } from "./util/math";

function CircleLineIntersection() {
  const [circlePosition, setCirclePosition] = React.useState(
    new Vector2D(50, 50)
  );
  const [circleDragging, setCircleDragging] = React.useState(false);

  const svgRef = React.createRef<SVGSVGElement>();

  return (
    <BaseSVG
      ref={svgRef}
      onMouseMove={(e) => {
        const boundingRect = svgRef.current?.getBoundingClientRect();
        if (circleDragging && boundingRect) {
          setCirclePosition(
            new Vector2D(
              e.clientX - boundingRect.left,
              e.clientY - boundingRect.top
            )
          );
        }
      }}
    >
      <CircleDraggable
        x={circlePosition.x}
        y={circlePosition.y}
        radius={40}
        dragging={circleDragging}
        setDragging={setCircleDragging}
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
