import React from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { Svg, Path, Circle} from "react-native-svg";
import { BezierCurveCommand } from "../graphing/bezier/BezierCurveCommand";
import Theme from "../../../styles/Theme";
import BezierPathSegment from "../graphing/bezier/BezierPathSegment";
import TimelineConstants from "../TimelineConstants";

const styles = StyleSheet.create({
    root:
    {
        flex: 1,
        height: "100%",
        marginRight: 14,
        overflow: "visible"
    },
    filling:
    {
    },
    svg:
    {
        padding: 5
    }
});

interface Props {
    segment: BezierPathSegment,
    mode?: EfficiencyMode,
}

interface State {
    segment: BezierPathSegment,
    width?: number,
    height?: number,
    mode: EfficiencyMode,
}

export class EfficiencyMode 
{
    public static readonly EVENT = new EfficiencyMode(TimelineConstants.EVENT_OPACITY, TimelineConstants.EVENT_HEIGHT);
    public static readonly SKIP = new EfficiencyMode(TimelineConstants.SKIP_OPACITY, TimelineConstants.SKIP_HEIGHT);

    public readonly opacity: number;
    public readonly height: number;

    private constructor(opacity: number, height: number)
    {
        this.opacity = opacity;
        this.height = height;
    }
}

export default class PartialEfficiency extends React.Component<Props, State>
{

    constructor(props: Props)
    {
        super(props);

        this.state = {
            segment: props.segment,
            mode: props.mode || EfficiencyMode.EVENT
        }
    }

    onLayout = (event: LayoutChangeEvent) =>
    {
        if(this.state.width == event.nativeEvent.layout.width)  return;

        const segment = this.state.segment.scale(event.nativeEvent.layout.width - TimelineConstants.GRAPH_PADDING * 2, 100).translate(TimelineConstants.GRAPH_PADDING, 0);

        this.setState({width: event.nativeEvent.layout.width, height: event.nativeEvent.layout.height, segment: segment});
    }

    render()
    {
        let width = this.state.width || 100;
        let height = this.state.mode.height;

        const path = this.getPath(this.state.segment);
        const productive = this.getProductiveFill(this.state.segment);
        const waste = this.getWasteFill(this.state.segment);

        return(
            <View style={styles.root} onLayout={this.onLayout}>
                <Svg width="100%" height={height} viewBox={"0 0 " + width + " " + height} opacity={this.state.mode.opacity}>
                    <Path d={productive} fill={Theme.colors.primaryLight} stroke="none" fillOpacity={0.35}/>
                    <Path d={waste} fill="#FF0000" stroke="none" fillOpacity={0.15}/>
                    <Path d={path} fill="none" stroke={Theme.colors.primaryLight} strokeWidth={2} />   
                    <Circle x={this.state.segment.current.point.x} y={height / 2} r={5} fill={Theme.colors.primaryLight} stroke="none" />
                </Svg>
            </View>
        );
    }

    getPath = (segment: BezierPathSegment) =>
    {
        let commands = [];
        
        if(segment.cMinus1 != undefined)
        {   
            commands.push("M " + segment.cMinus1.point.x + " " + segment.cMinus1.point.y);
            commands.push(BezierCurveCommand.create(segment.cMinus2 ? segment.cMinus2.point : undefined, segment.cMinus1.point, segment.current.point, segment.cPlus1 ? segment.cPlus1.point : undefined));
        }

        if(segment.cPlus1 != undefined)
        {
            commands.push("M " + segment.current.point.x + " " + segment.current.point.y);   
            commands.push(BezierCurveCommand.create(segment.cMinus1 ? segment.cMinus1.point : undefined, segment.current.point, segment.cPlus1.point, segment.cPlus2 ? segment.cPlus2.point : undefined));
        }

        return commands.join(" ");
    }

    getProductiveFill = (segment: BezierPathSegment) =>
    {
        let commands = [];
        const {start, current, next} = this.getSafeRectangle(segment);

        commands.push("M " + TimelineConstants.GRAPH_PADDING + " " + start.point.y);
        commands.push("L " + start.point.x + " " + start.point.y);
        commands.push("L " + current.point.x + " " + current.point.y);
        commands.push("L " + next.point.x + " " + next.point.y);
        commands.push("L " + TimelineConstants.GRAPH_PADDING + " " + next.point.y);

        return commands.join(" ");
    }

    getWasteFill = (segment: BezierPathSegment) =>
    {
        if(this.state.width == undefined) return "";

        let commands = [];
        const {start, current, next} = this.getSafeRectangle(segment);

        commands.push("M " + (this.state.width - TimelineConstants.GRAPH_PADDING) + " " + start.point.y);
        commands.push("L " + start.point.x + " " + start.point.y);
        commands.push("L " + current.point.x + " " + current.point.y);
        commands.push("L " + next.point.x + " " + next.point.y);
        commands.push("L " + (this.state.width - TimelineConstants.GRAPH_PADDING) + " " + next.point.y);

        return commands.join(" ");
    }

    getSafeRectangle = (segment: BezierPathSegment) =>
    {
        const start = segment.cMinus1 || segment.current;
        const current = segment.current;
        const next = segment.cPlus1 || segment.current;

        return {start: start, current: current, next: next};
    }

    /*getPolygonPoints = (start: number, end: number, width: number, height: number) =>
    {
        start = start / 100 * width;
        end = end / 100 * width;

        let c1 = "0,0";
        let c2 = start + ",0";
        let c3 = start + "," + (height / 2);
        let c4 = end + "," + (height / 2);
        let c5 = end + "," + height;
        let c6 = "0," + height;

        return [c1, c2, c3, c4, c5, c6].join(" ");
    }*/
}