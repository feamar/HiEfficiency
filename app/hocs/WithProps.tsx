import React from "react";
import withStaticFields from "./WithStaticFields";


export default <P extends InjectedProps, InjectedProps> (injectedProps: InjectedProps, WrappedComponent: React.ComponentType<P>) =>
{
    const hoc = class HOC extends React.Component<P & InjectedProps>
    {
        constructor(props: P & InjectedProps)
        {   super(props);}

        render()
        {   return <WrappedComponent {...this.props} {...injectedProps} />}
    }
    
    return withStaticFields(WrappedComponent, hoc);
}