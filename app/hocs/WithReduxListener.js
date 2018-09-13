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

            this.state = {
                loading: true
            }
            this.focussed = false;
        }

        componentWillMount()
        {   this.focussed = true;}

        onScreenWillFocus = (payload) =>
        {   this.focussed = true;}

        componentWillReceiveProps = (props) =>
        {
            this.onReduxStateChanged(props);
        }

        onScreenWillBlur = (payload) =>
        {   this.focussed = false;}

        onReduxStateChanged = (props) =>
        {
            this.callForEachListener("onReduxStateChanged", props);
        }

        render()
        {
            return (
                <View style={styles.wrapper}>
                    {this.state.loading && <View style={styles.loading.wrapper}>
                        <Progress.Circle color={Theme.colors.primary} size={45} indeterminate={true} style={styles.loading.loader} borderWidth={3} />
                    </View>}
                    <WrappedComponent setLoading={(loading => this.setState({loading: loading}))} ref={instance => this.wrapped = instance} {...this.props} />
                </View>
            );
        }
    }
    
    const hoc1 = withFocusListener(hoc);
    const hoc2 = connect(mapStateToProps, mapDispatchToProps)(hoc1);
    
    return withStaticFields(WrappedComponent, hoc2);
}