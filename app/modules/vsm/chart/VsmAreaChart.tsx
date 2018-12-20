import React from "react";
import { AreaChart, Grid,  XAxis} from 'react-native-svg-charts';
import { StyleSheet, View, ViewStyle, LayoutChangeEvent,  ScrollView } from "react-native";
import * as shape from 'd3-shape'
import UtilityDate from "../../../utilities/UtilityDate";
import Theme from "../../../styles/Theme";
import DecoratorCircle from "./decorators/DecoratorCircle";
import DecoratorAxisY from "./decorators/DecoratorAxisY";


interface Props
{
    data: Promise<Array<number>>
}

interface State
{
    data: Array<number>,
    width?: number,
}

const styles = StyleSheet.create({
    root:{
    },
    wrapper:
    {
    },
    chart: {
        height: 300,
    },
    xAxis:
    {
        justifyContent: "flex-start"
    },
    scroll:
    {

    }
});

const POINTS_PER_SCREEN = 15;

export default class VsmAreaChart extends React.Component<Props, State>
{
    constructor(props: Props) 
    {
        super(props)

        this.state = {
            data: []
        }
    }

    componentDidMount = async () => 
    {
        const data = await this.props.data;
        this.setState({data: data});
    }

    componentWillReceiveProps = async (_props: Props) =>
    {
        const data = await this.props.data;
        if(this.state.data != data)
        {
            console.log("AGGREGATED DATA: " + data);
            this.setState({data: data});
        }
    }

    getChartStyle = (data: Array<number>): ViewStyle =>
    {
        if(this.state.width == undefined) return {  height: 300}
        
        const ratio = data.length * (this.state.width / POINTS_PER_SCREEN + 1)

        return {
            height: 350,
            width: Math.max(this.state.width, ratio)
        }
    }

    onLayout = (event: LayoutChangeEvent) =>
    {
        if(this.state.width == event.nativeEvent.layout.width) return;
        this.setState({width: event.nativeEvent.layout.width});
    }

    render()
    {
        const inset = 30;
     
        const svg = {
            fill:Theme.colors.primaryLight, 
            fillOpacity:0.75, 
            stroke:Theme.colors.primary,
            strokeWidth: 2
        };


        return (
            <View style={styles.root} onLayout={this.onLayout}>
                <ScrollView horizontal={true} style={styles.scroll} >
                    <AreaChart gridProps={{ticks: [0, 100]}} numberOfTicks={5} gridMin={0} gridMax={100} style={this.getChartStyle(this.state.data)} data={this.state.data} contentInset={{top: inset, bottom: inset}} curve={shape.curveNatural} svg={svg} >
                        <Grid  />
                        <DecoratorCircle />
                        <DecoratorAxisY metric="%" values={[20, 40, 60, 80, 100]}/>
                    </AreaChart>
                    <XAxis style={styles.xAxis} data={this.state.data} formatLabel={(_value, index) => UtilityDate.getDayNameAbbreviated(index - 1)} />
                </ScrollView>
            </View>
        );
    }
}