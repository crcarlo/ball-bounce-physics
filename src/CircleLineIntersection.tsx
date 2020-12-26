import * as React from "react";
import ReactDOM from "react-dom";
import BaseSVG from "./components/BaseSVG";
import CircleDraggable from "./components/CircleDraggable";
import { Vector2D } from "./util/math";
import { usePointState } from "./util/usePointState";

function CircleLineIntersection() {
  const circleState = usePointState(new Vector2D(50, 50));

  const svgRef = React.createRef<SVGSVGElement>();

  return (
    <BaseSVG
      ref={svgRef}
      onMouseMove={(e) => {
        const boundingRect = svgRef.current?.getBoundingClientRect();
        if (circleState.dragging && boundingRect) {
          circleState.setPosition(
            new Vector2D(
              e.clientX - boundingRect.left,
              e.clientY - boundingRect.top
            )
          );
        }
      }}
    >
      <CircleDraggable
        x={circleState.position.x}
        y={circleState.position.y}
        radius={40}
        dragging={circleState.dragging}
        setDragging={circleState.setDragging}
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
