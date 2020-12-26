import * as React from "react";

interface BaseSVGProps {
  children?: JSX.Element;
}

export default React.forwardRef(function BaseSVG(
  { children }: BaseSVGProps,
  ref: React.ForwardedRef<SVGSVGElement>
) {
  return (
    <svg viewBox="0 0 700 300" ref={ref}>
      {children}
    </svg>
  );
});
