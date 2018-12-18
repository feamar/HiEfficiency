import React from "react";
import {Text} from "react-native-svg"

interface Props
{
    x?: (n: number) => number,
    y?: (n: number) => number,
    data?: Array<number>,
    values: Array<number>,
    metric?: string,
}

interface State 
{
    x: (n: number) => number,
    y: (n: number) => number,
    data: Array<number>,
    values: Array<number>,
    metric?: string,
}

export default class DecoratorAxisY extends React.Component<Partial<Props>, State>
{

    constructor(props: Props) 
    {
        super(props);

        this.state = {
            x: props.x!,        //Force unwrapped, because react-native-svg-charts guarantees that these props are passed down to the decorator.
            y: props.y!,        //Force unwrapped, because react-native-svg-charts guarantees that these props are passed down to the decorator.
            data: props.data!,   //Force unwrapped, because react-native-svg-charts guarantees that these props are passed down to the decorator.
            values: props.values,
            metric: props.metric,
        }

    }


    render()
    {
        const props = {
            fill: "gray",
            fontSize: 10
        }

        return this.state.values.map((value, _index) => 
        {
            return <Text key={value} {...props} y={this.state.y(value + 3)} x={5}>{value}{this.state.metric}</Text>
        });
    }
}