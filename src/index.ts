import * as CircleCollision from "./plots/CircleCollision";
import * as MovingBall from "./plots/MovingBall";
import * as TheProblem from "./plots/TheProblem";
import * as CollisionDetection from "./plots/CollisionDetection";
import * as CollisionDetectionSingleBall from "./plots/CollisionDetectionSingleBall";
import * as PointOfIntersection from "./plots/PointOfIntersection";
import * as PointOfCollision from "./plots/PointOfCollision";
import * as Result from "./plots/Result";

// Fig. 1
Result.mount("result");
// Fig. 2
MovingBall.mount("movingBall");
// Fig. 3
CircleCollision.mount("circleLineIntersection");
// Fig. 4
TheProblem.mount("theProblem");
// Fig. 5
CollisionDetection.mount("collisionDetection");
// Fig. 6
CollisionDetectionSingleBall.mount("collisionDetectionSingleBall");
// Fig. 8
PointOfIntersection.mount("pointOfIntersection");
// Fig. 8
PointOfCollision.mount("pointOfCollision");
