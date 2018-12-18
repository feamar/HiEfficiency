import BezierPathSegment from "../graphing/bezier/BezierPathSegment";

export default abstract class AbstractTimelineModel
{
    public readonly timestamp: Date;
    public segment: BezierPathSegment;

    constructor(timestamp: Date, segment: BezierPathSegment)
    {
        this.timestamp = timestamp;
        this.segment = segment;
    }
}