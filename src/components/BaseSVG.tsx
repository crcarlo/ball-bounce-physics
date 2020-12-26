import * as React from "react";

interface BaseSVGProps {
  children?: JSX.Element;
  onMouseMove: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export default React.forwardRef(function BaseSVG(
  { children, onMouseMove }: BaseSVGProps,
  ref: React.ForwardedRef<SVGSVGElement>
) {
  return (
    <svg viewBox="0 0 700 300" ref={ref} onMouseMove={onMouseMove}>
      {children}
    </svg>
  );
});
