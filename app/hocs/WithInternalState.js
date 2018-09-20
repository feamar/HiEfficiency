

import React from "react";
import withStaticFields from "./WithStaticFields";
import AbstractHigherOrderComponent from './AbstractHigherOrderComponent';
import { PARAM_NAME_HEADER_RIGHT_INJECTION } from "../components/routing/Router";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default WithOverflowMenu = (WrappedComponent) =>
{
    const hoc = class HOC extends AbstractHigherOrderComponent
    {
        constructor(props)
        {
            super(props);
            this.mounted = false;
        }
       
        onReference = (instance) =>
        {
            this.wrapped = instance;
            this.wrapped.setState = setStateInternal;
        }

        componentWillMount() 
        {   this.mounted = true;}

        componentWillUnmount()
        {   this.mounted = false;}

        setStateInternal = (update, whenDone) =>
        {
            if(this.mounted)
            {   this.wrapped.setState(update, whenDone);}
            else
            {
                this.wrapped.state = {
                    ...this.state,
                    ...update
                }

                if(whenDone)
                {   whenDone();}
            }
        }

        render()
        {   return <WrappedComponent ref={this.onReference} setStateInternal={this.setStateInternal} {...this.props} />}
    }
    
    return withStaticFields(WrappedComponent, hoc);
}