import { Point } from "./Point";
import { BezierCurveOpposedLine } from "./BezierCurveOpposedLine";

export class BezierCurveControlPoint
{
    public static fromPoints = (current: Point, previous: Point | undefined, next: Point | undefined, smoothing: number = 0.000125, reversed: boolean = false) =>
    {
        if(smoothing < 0 || smoothing > 1)
        {   
            throw new Error("Smoothing should be a floating point number between 0 and 1, but is currently '" + smoothing + "'.");
        }

        //When current is the first point of the line, there is no previous point. Replace with current.
        if(previous == undefined)
        {
            previous = current;
        }
        
        //When current is the last point of the line, there is no next point. Replace with current.
        if(next == undefined)
        {
            next = current;
        }




        const opposedLine = BezierCurveOpposedLine.fromPoints(previous, next);

        const angle = opposedLine.angle + (reversed ? Math.PI : 0);
        const length = opposedLine.length * smoothing;

        const x = current.x + Math.cos(angle) * length;
        const y = current.y + Math.sin(angle) * length;

        return new Point(x, y); 
    }
}