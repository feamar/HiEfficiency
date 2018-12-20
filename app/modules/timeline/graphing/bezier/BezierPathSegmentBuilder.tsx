import BezierCurvePoint from "./BezierCurvePoint";
import BezierPathSegment from "./BezierPathSegment";

export default class BezierPathSegmentBuilder 
{
    public cMinus2: BezierCurvePoint | undefined;
    public cMinus1: BezierCurvePoint | undefined;
    public current: BezierCurvePoint | undefined;
    public cPlus1: BezierCurvePoint | undefined;
    public cPlus2: BezierCurvePoint | undefined;

    public constructor()
    {

    }

    public addMinus1 = (builder: BezierPathSegmentBuilder | undefined) =>
    {
        if(builder == undefined) return;
        this.cMinus1 = builder.current;
    }

    public addMinus2 = (builder: BezierPathSegmentBuilder | undefined) =>
    {
        if(builder == undefined) return;
        this.cMinus2 = builder.current;
    }

    public addCurrent = (current: BezierCurvePoint) =>
    {
        this.current = current;
    }

    public addPlus1 = (builder: BezierPathSegmentBuilder | undefined) =>
    {
        if(builder == undefined) return;
        this.cPlus1 = builder.current;
    }

    public addPlus2 = (builder: BezierPathSegmentBuilder | undefined) =>
    {
        if(builder == undefined) return;
        this.cPlus2 = builder.current;
    }

    public build = () =>
    {
        if(this.current == undefined) throw new Error("A bezier path segment needs at least a current point in order to be valid. Current point is now undefined.");
        return BezierPathSegment.fromPoints(this.cMinus2, this.cMinus1, this.current, this.cPlus1, this.cPlus2);
    }
}