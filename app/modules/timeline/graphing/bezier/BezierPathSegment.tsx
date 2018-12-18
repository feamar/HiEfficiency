import BezierCurvePoint from "./BezierCurvePoint";

export default class BezierPathSegment
{
    public readonly cMinus2: BezierCurvePoint | undefined;
    public readonly cMinus1: BezierCurvePoint | undefined;
    public readonly current: BezierCurvePoint;
    public readonly cPlus1: BezierCurvePoint | undefined;
    public readonly cPlus2: BezierCurvePoint | undefined;

    public static fromArray = (index: number, array: Array<BezierCurvePoint>) =>
    {
        return BezierPathSegment.fromPoints(array[index - 2], array[index - 1], array[index], array[index + 1], array[index + 2]);
    }

    public static fromPoints = (cMinus2: BezierCurvePoint | undefined, cMinus1: BezierCurvePoint | undefined, current: BezierCurvePoint, cPlus1: BezierCurvePoint | undefined, cPlus2: BezierCurvePoint | undefined) =>
    {
        return new BezierPathSegment(cMinus2, cMinus1, current, cPlus1, cPlus2);
    }

    private constructor(cMinus2: BezierCurvePoint | undefined, cMinus1: BezierCurvePoint | undefined, current: BezierCurvePoint, cPlus1: BezierCurvePoint | undefined, cPlus2: BezierCurvePoint | undefined) 
    {
        this.cMinus2 = cMinus2;
        this.cMinus1 = cMinus1;
        this.current = current;
        this.cPlus1 = cPlus1;
        this.cPlus2 = cPlus2;
    }

    translate = (deltaX: number, deltaY: number) =>
    {
        return BezierPathSegment.fromPoints(
            this.cMinus2 ? this.cMinus2.translate(deltaX, deltaY) : undefined,
            this.cMinus1 ? this.cMinus1.translate(deltaX, deltaY) : undefined,
            this.current.translate(deltaX, deltaY),
            this.cPlus1 ? this.cPlus1.translate(deltaX, deltaY) : undefined,
            this.cPlus2 ? this.cPlus2.translate(deltaX, deltaY) : undefined
        );
    }

    toLocalCoordinateSystem = () =>
    {   
        return this.translate(0, this.current.type.y - this.current.point.y);
    }

    scale = (width: number, height: number) =>
    {
        return BezierPathSegment.fromPoints(
            this.cMinus2 ? this.cMinus2.scale(width, height) : undefined,
            this.cMinus1 ? this.cMinus1.scale(width, height) : undefined,
            this.current.scale(width, height),
            this.cPlus1 ? this.cPlus1.scale(width, height) : undefined,
            this.cPlus2 ? this.cPlus2.scale(width, height) : undefined
        );
    }
}

