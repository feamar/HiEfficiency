
export default class BezierCurvePointType 
{
    public static readonly EVENT = new BezierCurvePointType(30);
    public static readonly SKIP = new BezierCurvePointType(15);

    public readonly y: number;

    private constructor(y: number)
    {
        this.y = y;
    }
}