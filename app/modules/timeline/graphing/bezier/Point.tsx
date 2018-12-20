export class Point
{
    public x: number;
    public y: number;

    constructor(x: number, y: number) 
    {
        this.x = x;
        this.y = y;
    }

    static scale = (point: Point, width: number, height: number) =>
    {
        if(point == undefined) return undefined;
        return point.scale(width, height);
    }

    static translate = (point: Point | undefined, deltaX: number, deltaY: number) =>
    {
        if(point == undefined) return undefined;
        return point.translate(deltaX, deltaY);
    }

    static translateX = (point: Point | undefined, delta: number) =>
    {
        if(point == undefined) return undefined;
        return point.translateX(delta);
    }
    
    static translateY = (point: Point | undefined, delta: number) =>
    {
        if(point == undefined) return undefined;
        return point.translateY(delta);
    }
    
    scale = (width: number, height: number) =>
    {
        return new Point(this.x / 100 * width, this.y / 100 * height);
    }

    translateX = (delta: number) =>
    {
        return this.translate(delta, 0);
    }

    translateY = (delta: number) =>
    {
        return this.translate(0, delta);
    }

    translate = (deltaX: number, deltaY: number) =>
    {
        return new Point(this.x + deltaX, this.y + deltaY);
    }
}