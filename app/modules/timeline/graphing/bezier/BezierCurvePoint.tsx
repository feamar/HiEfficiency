import { Point } from "./Point";
import BezierCurvePointType from "./BezierCurvePointType";

export default class BezierCurvePoint
{
    public readonly point: Point;
    public readonly type: BezierCurvePointType;

    public constructor(point: Point, type: BezierCurvePointType) 
    {
        this.point = point;
        this.type = type;
    }

    translateX = (delta: number) =>
    {
        return new BezierCurvePoint(this.point.translateX(delta), this.type);
    }

    translateY = (delta: number) =>
    {
        return new BezierCurvePoint(this.point.translateY(delta), this.type);
    }

    translate = (deltaX: number, deltaY: number) =>
    {
        return new BezierCurvePoint(this.point.translate(deltaX, deltaY), this.type);
    }

    scale = (width: number, height: number) =>
    {
        return new BezierCurvePoint(this.point.scale(width, height), this.type);
    }
}
