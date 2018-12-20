import React from "react";
import { Circle } from "react-native-svg";
import Theme from "../../../../styles/Theme";


interface Props
{
    x: (n: number) => number,
    y: (n: number) => number,
    data: Array<number>
}

interface State 
{
    x: (n: number) => number,
    y: (n: number) => number,
    data: Array<number>
}

export default class DecoratorCircle extends React.Component<Partial<Props>, State>
{
    constructor(props: Props) 
    {
        super(props);

        this.state = {
            x: props.x,
            y: props.y,
            data: props.data
        }
    }

    render()
    {
        return this.state.data.map((value, index) => {
            if(index == 0 || index == this.state.data.length - 1) return null;   
            else return <Circle
                key={ index }
                cx={ this.state.x(index) }
                cy={ this.state.y(value) }
                r={ 4 }
                stroke={ Theme.colors.primaryDark }
                strokeWidth={2}
                fill={ "white" }
            />
        });
    }
}