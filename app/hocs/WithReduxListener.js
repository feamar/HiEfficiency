import React from "react";
import {View} from "react-native";
import withStaticFields from "./WithStaticFields";
import withFocusListener from "./WithFocusListener";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import {connect} from 'react-redux';
import UtilityObject from "../utilities/UtilityObject";
import Theme from "../styles/Theme";
import * as Progress from 'react-native-progress';

const styles = {
    wrapper:{
        height: "100%",
        width: "100%"
    },
    loading: {
        wrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
        },
        loader: {

        }
    }
}

export default withReduxListener = (mapStateToProps, mapDispatchToProps, WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);
            this.hasNotified = false;
            this.focussed = false;
            //console.log(WrappedComponent.displayName + ": constructor");
        }

        onReference = (instance) =>
        {
            this.wrapped = instance;
            //console.log(WrappedComponent.displayName + ": on Reference");
        }

        componentWillMount()
        {
            //console.log(WrappedComponent.displayName + ": component Will Mount");

            this.focussed = true;
            this.onReduxStateChanged(this.props);
        }

        onScreenWillFocus = (payload) =>
        {
            //console.log(WrappedComponent.displayName + ": on Screen Will Focus");

            this.focussed = true;
            this.onReduxStateChanged(this.props);
        }

        componentWillReceiveProps = (props) =>
        {
            //console.log(WrappedComponent.displayName + ": component Will Receive Props: " + this.focussed);

            if(this.focussed)
            {   this.onReduxStateChanged(props);}
        }

        onScreenWillBlur = (payload) =>
        {
            //console.log(WrappedComponent.displayName + ": on Screen Will Blur");
            this.focussed = false;
            this.hasNotified = false;   
        }

        onScreenDidFocus = (payload) =>
        {
            //console.log(WrappedComponent.displayName + ": on Screen Did Focus");
            this.forceUpdate();
        }

        onReduxStateChanged = (props) =>
        {
            //console.log("OnReduxStateChanged: " + this.hasNotified);

            this.callForEachListener("onReduxStateChanged", props);

            if(this.hasNotified == false)
            {   this.hasNotified = true;}
        }

        render()
        {
            //console.log(WrappedComponent.display + ": render: hasNotified: " + this.hasNotified )
            return (
                <View style={styles.wrapper}>
                    {this.hasNotified == false && <View style={styles.loading.wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loading.loader} borderWidth={3} />
                    </View>}
                    <WrappedComponent ref={instance => this.onReference(instance)} {...this.props} />
                </View>
            );
        }
    }
    
    const hoc1 = withFocusListener(hoc);
    const hoc2 = connect(mapStateToProps, mapDispatchToProps)(hoc1);
    
    return withStaticFields(WrappedComponent, hoc2);
}