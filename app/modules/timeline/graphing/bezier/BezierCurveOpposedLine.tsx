import { Point } from "./Point";

export class BezierCurveOpposedLine
{
    public readonly length: number;
    public readonly angle: number;

    constructor(length: number, angle: number)
    {
        this.length = length;
        this.angle = angle;
    }

    public static fromCoordinates = (x1: number, y1: number, x2: number, y2: number) =>
    {
        //console.log("INPUT: " + x1 + " AND " + y1 + " AND " + x2 + " AND " + y2);

        const lengthX = x2 - x1;
        const lengthY = y2 - y1;

        //console.log("LENTHS: " + lengthX + " AND " + lengthY);

        const length = Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2));
        const angle = Math.atan2(lengthY, lengthX);

        //console.log("ANGLE: " + angle + ", " + length)

        return new BezierCurveOpposedLine(length, angle);
    }

    public static fromPoints = (start: Point, end: Point) =>
    {
        //console.log("POINTS:  "+ UtilityObject.stringify(start) + " AND " + UtilityObject.stringify(end));
        return BezierCurveOpposedLine.fromCoordinates(start.x, start.y, end.x, end.y);
    }
}