import { Point } from "./Point";
import { BezierCurveControlPoint } from "./BezierCurveControlPoint";

export class BezierCurveCommand
{
    public static create = (previous: Point | undefined, start: Point, end: Point, next: Point | undefined) =>
    {
        const cp1 = BezierCurveControlPoint.fromPoints(start, previous, end);
        const cp2 = BezierCurveControlPoint.fromPoints(end, start, next);

        const command = "C " + cp1.x + "," + cp1.y + " " + cp2.x + "," + cp2.y + " " + end.x + "," + end.y;

        return command;
    }
}