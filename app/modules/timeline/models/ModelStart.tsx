import AbstractTimelineModel from "./AbstractTimelineModel";
import BezierPathSegment from "../graphing/bezier/BezierPathSegment";

export default class ModelStart extends AbstractTimelineModel
{
    constructor(timestamp: Date, segment: BezierPathSegment)
    {
        super(timestamp, segment);
    }
}