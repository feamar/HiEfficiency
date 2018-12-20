import BezierCurvePoint from "./graphing/bezier/BezierCurvePoint";
import BezierPathSegmentBuilder from "./graphing/bezier/BezierPathSegmentBuilder";
import ModelEvent from "./models/ModelEvent";
import BezierPathSegment from "./graphing/bezier/BezierPathSegment";
import AbstractTimelineModel from "./models/AbstractTimelineModel";
import ModelStart from "./models/ModelStart";
import ModelFinish from "./models/ModelFinish";
import ModelSkip from "./models/ModelSkip";
import TimelineConstants from "./TimelineConstants";
import { Point } from "./graphing/bezier/Point";
import BezierCurvePointType from "./graphing/bezier/BezierCurvePointType";

interface Activator 
{
    new (timestamp: Date, segment: BezierPathSegment) : AbstractTimelineModel
}

type Intermediate = 
{
    activator: Activator,
    timestamp: Date
}  

export default class TimelineBuilder
{
    private _builders: Array<BezierPathSegmentBuilder>;
    private _intermediates : Array<Intermediate>;
    private _cummulativeY: number;
    private _previousValue: number;

    public get previousValue () {
        return this._previousValue;
    }

    public constructor()
    {
        this._cummulativeY = 0;
        this._previousValue = 100;
        this._builders = [];
        this._intermediates = [];
    }

    public addStart = (timestamp: Date, value: number) =>
    {
        if(this._builders.length != 0) throw new Error("The start of a timeline can only be added if the current builder is empty. Builder currently has '" + this._builders.length + "' items in it.");
        this.addInternal(timestamp, value, BezierCurvePointType.EVENT, TimelineConstants.EVENT_HEIGHT, ModelStart);
    }

    public addEvent = (timestamp: Date, value: number) =>
    {
        if(this._builders.length < 1) throw new Error("An event can only be added if the current builder is not empty. Builder currently has '" + this._builders.length + "' items in it.");
        this.addInternal(timestamp, value, BezierCurvePointType.EVENT, TimelineConstants.EVENT_HEIGHT, ModelEvent);
    }

    public addSkip = (timestamp: Date) =>
    {
        if(this._builders.length < 1) throw new Error("A skip can only be added if the current builder is not empty. Builder currently has '" + this._builders.length + "' items in it.");
        this.addInternal(timestamp, this._previousValue, BezierCurvePointType.SKIP, TimelineConstants.SKIP_HEIGHT, ModelSkip);
    }

    public addFinish = (timestamp: Date, value: number) =>
    {
        if(this._builders.length < 1) throw new Error("The finish of a timeline can only be added if the current builder is not empty. Builder currently has '" + this._builders.length + "' items in it.");
        this.addInternal(timestamp, value, BezierCurvePointType.EVENT, TimelineConstants.EVENT_HEIGHT, ModelFinish);
    }

    private addInternal = (timestamp: Date, value: number, type: BezierCurvePointType, height: number, activator: Activator) =>
    {
        this.offset(height / 2);
        this.addBuilder(this._builders, new BezierCurvePoint(new Point(value, this._cummulativeY), type));
        this._intermediates.push({activator: activator, timestamp: timestamp});
        this.offset(height / 2);
        this._previousValue = value;
    }

    private addBuilder = (builders: Array<BezierPathSegmentBuilder>, point: BezierCurvePoint) =>
    {
        const current = new BezierPathSegmentBuilder();
        const minus1 = builders[builders.length - 1];
        const minus2 = builders[builders.length - 2];

        current.addCurrent(point);
        current.addMinus1(minus1);
        current.addMinus2(minus2);
        if(minus1) minus1.addPlus1(current);
        if(minus2) minus2.addPlus2(current);

        builders.push(current);
    }

    private offset = (amount: number) =>
    {
        this._cummulativeY += amount;
    }

    public build = () =>
    {
        const models: Array<AbstractTimelineModel> = [];
        for(var i = 0 ; i < this._builders.length ; i ++)
        {
            const builder = this._builders[i];
            const intermediate = this._intermediates[i];
            const activator = intermediate.activator;

            const segment = builder.build().toLocalCoordinateSystem();
            const model = new activator(intermediate.timestamp, segment);

            models.push(model);
        }

        return models;
    }
}