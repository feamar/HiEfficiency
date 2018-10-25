import React from "react";
import withStaticFields from "./WithStaticFields";
import AbstractHigherOrderComponent, { ConcreteOrHigher, ConcreteOrHigherConstructor, ConcreteComponent } from './AbstractHigherOrderComponent';
import { View, Text, StyleSheet } from "react-native";
import ListFillerOption from "../dtos/options/ListFillerOption";

interface RequiredFunctions
{
    shouldShowEmptyListFiller: () => boolean;
}

interface HocProps 
{
}

interface HocState
{
    shouldShowEmptyListFiller: boolean
}

const styles = StyleSheet.create(
{
    wrapper: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 20

    },
    filler:
    {
        width: "100%",
        height: "35%",
        marginBottom: 55,
        marginTop: 75
    },
    title:
    {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 17,
    },
    subtitle:
    {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 13
    }
});

export default <B extends ConcreteComponent & RequiredFunctions, C extends ConcreteOrHigher<B, C, RequiredFunctions, P>, P>(WrappedComponent: ConcreteOrHigherConstructor<B, C, RequiredFunctions, P>, options: ListFillerOption) =>
{
    const hoc = class WithKeyboardListener extends AbstractHigherOrderComponent<B, C, RequiredFunctions, P, HocProps & P, HocState>
    {
        constructor(props: P & HocProps)
        {
            super(props);

            this.state = {
                shouldShowEmptyListFiller: false
            }
        }

        onComponentDidMount = () =>
        {
            const concrete = this.concrete;
            if(concrete)
            {
                this.setShouldShowFiller(concrete.shouldShowEmptyListFiller());
            }
        }

        componentDidUpdate = (_1: HocProps, _2: {}) =>
        {
            const concrete = this.concrete;
            if(concrete)
            {
                const shouldShow = concrete.shouldShowEmptyListFiller();
                if(shouldShow != this.state.shouldShowEmptyListFiller)
                {   this.setShouldShowFiller(shouldShow);}
            }
        }

        setShouldShowFiller = (shouldShow: boolean) =>
        {
            if(this.state.shouldShowEmptyListFiller == shouldShow)
            {   return;}
            
            this.setState({shouldShowEmptyListFiller: shouldShow});
        }
      
        render()
        {

            return (
                <View>
                    {this.state.shouldShowEmptyListFiller && 
                    
                        <View style={styles.wrapper}>
                            <View style={styles.filler}>
                                {options.viewConstructor}
                            </View>
                            <Text style={styles.title}>{options.title}</Text>
                            <Text style={styles.subtitle}>{options.subtitle}</Text>
                        </View>
                    }
                    <WrappedComponent ref={this.onReference} {...this.props} />
                </View>
            );
            
        }
    }
    
    return withStaticFields(WrappedComponent, hoc);
}