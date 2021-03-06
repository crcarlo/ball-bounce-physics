export class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector2D) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector2D) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  multiplyScalar(scalar: number) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  divideScalar(scalar: number) {
    return this.multiplyScalar(1 / scalar);
  }

  toUnitVector() {
    const length = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    return this.divideScalar(length);
  }

  transform(callback: (startVector: Vector2D) => Vector2D) {
    const _this = new Vector2D(this.x, this.y);
    const modified = callback(_this) || _this;
    return Vector2D.copy(modified);
  }

  static copy(vector: Vector2D) {
    return new Vector2D(vector.x, vector.y);
  }

  static cross(a: Vector2D, b: Vector2D) {
    return a.x * b.y - a.y * b.x;
  }
}

class Vector2DPolar {
  radius: number;
  angle: number;

  constructor(radius: number, angle: number) {
    this.radius = radius;
    this.angle = angle;
  }

  toCartesianVector() {
    const x = this.radius * Math.cos(this.angle);
    const y = this.radius * Math.sin(this.angle);
    return new Vector2D(x, y);
  }

  static fromCartesianVector(cartesianVector: Vector2D) {
    const { x, y } = cartesianVector;
    const angle = Math.atan(y / x);
    const radius = distance(new Vector2D(0, 0), cartesianVector);
    return new Vector2DPolar(radius, angle);
  }
}

export interface MathCircle {
  center: Vector2D;
  radius: number;
}

export interface MathLine {
  through: Vector2D;
  direction: Vector2D;
}

const sign = (x: number): number => (x < 0 ? -1 : 1);

/**
 * Source https://mathworld.wolfram.com/Circle-LineIntersection.html
 */
const ceneteredCircleLineIntersection = (
  radius: number,
  a: Vector2D,
  b: Vector2D
): Vector2D[] => {
  const { x: x_1, y: y_1 } = a;
  const { x: x_2, y: y_2 } = b;

  const d_x = x_2 - x_1;
  const d_y = y_2 - y_1;
  const d_r = Math.sqrt(d_x * d_x + d_y * d_y);
  const D = x_1 * y_2 - x_2 * y_1;

  const delta = radius * radius * d_r * d_r - D * D;

  if (delta < 0) {
    return [];
  }

  const x_m_1 = (D * d_y + sign(d_y) * d_x * Math.sqrt(delta)) / (d_r * d_r);
  const y_m_1 = (-D * d_x + Math.abs(d_y) * Math.sqrt(delta)) / (d_r * d_r);

  if (delta === 0) {
    return [new Vector2D(x_m_1, y_m_1)];
  }

  const x_m_2 = (D * d_y - sign(d_y) * d_x * Math.sqrt(delta)) / (d_r * d_r);
  const y_m_2 = (-D * d_x - Math.abs(d_y) * Math.sqrt(delta)) / (d_r * d_r);

  return [new Vector2D(x_m_1, y_m_1), new Vector2D(x_m_2, y_m_2)];
};

export const circleLineIntersection = (
  circle: MathCircle,
  line: MathLine
): Vector2D[] => {
  const linePoint1 = line.through;
  const linePoint2 = line.through.add(line.direction);

  const linePoint1Centered = linePoint1.subtract(circle.center);
  const linePoint2Centered = linePoint2.subtract(circle.center);

  const resultCentered = ceneteredCircleLineIntersection(
    circle.radius,
    linePoint1Centered,
    linePoint2Centered
  );

  return resultCentered
    .map((point) => point.add(circle.center))
    .sort((a, b) => distance(a, linePoint1) - distance(b, linePoint1));
};

export const distance = (a: Vector2D, b: Vector2D) =>
  a && b && Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const perpendicularLine = ({
  direction,
  through,
}: MathLine): MathLine => {
  const polarDirection = Vector2DPolar.fromCartesianVector(direction);
  const perpendicularDirection = new Vector2DPolar(
    polarDirection.radius,
    polarDirection.angle + Math.PI / 2
  );
  return { direction: perpendicularDirection.toCartesianVector(), through };
};

export const linesIntersection = (
  lineA: MathLine,
  lineB: MathLine
): Vector2D | undefined => {
  const directionCross = Vector2D.cross(lineA.direction, lineB.direction);
  if (directionCross === 0) {
    return;
  }
  const u =
    Vector2D.cross(lineB.through.subtract(lineA.through), lineA.direction) /
    directionCross;
  return lineB.through.add(lineB.direction.multiplyScalar(u));
};

export const symmetricPoint = (
  original: Vector2D,
  mirror: Vector2D
): Vector2D => {
  return mirror.add(mirror.subtract(original));
};
